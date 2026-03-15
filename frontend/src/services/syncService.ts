import {
  getOfflineQueue,
  removeManyFromOfflineQueue,
  updateQueueItemRetries,
  getCacheStats,
  OfflineQueueItem,
  removeFromOfflineQueue,
  removeSessionFromCache,
} from "./offline/offlineStorage";
import { syncBatch, isOnline } from "./api/api";
import { useNetworkStore } from "../store/networkStore";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { createLogger } from "./logging";

const log = createLogger("syncService");

const CLEANUP_RETRIES_THRESHOLD = 5;

export interface SyncResult {
  success: number;
  failed: number;
  total: number;
  errors: { id: string; error: string }[];
}

export interface SyncOptions {
  onProgress?: (current: number, total: number) => void;
  background?: boolean;
}

// Simple in-memory lock to prevent concurrent syncs
let isSyncing = false;

export const initializeSyncService = () => {
  let networkReady = false;

  const unsubscribe = useNetworkStore.subscribe((state) => {
    const wasOnline = networkReady;
    networkReady = state.isOnline;

    if (state.isOnline && !wasOnline) {
      const settings = useSettingsStore.getState().settings;
      if (
        settings.offlineMode ||
        !settings.autoSyncEnabled ||
        !settings.syncOnReconnect
      ) {
        log.debug("Reconnect sync disabled by user settings");
        return;
      }

      log.debug("Network came online, scheduling sync");

      setTimeout(() => {
        const authState = useAuthStore.getState();
        if (authState.isAuthenticated && authState.user) {
          log.debug("Authenticated and online, triggering sync");
          syncOfflineQueue({ background: true });
        } else {
          log.debug("Not authenticated yet, skipping sync until login");
        }
      }, 2000);
    }
  });

  return {
    cleanup: () => {
      unsubscribe();
    },
  };
};

export const getSyncStatus = async () => {
  const stats = await getCacheStats();
  const online = useNetworkStore.getState().isOnline;

  return {
    isOnline: online,
    queuedOperations: stats.queuedOperations,
    lastSync: stats.lastSync,
    cacheSize: stats.cacheSizeKB,
    needsSync: stats.queuedOperations > 0,
  };
};

export const syncOfflineQueue = async (
  options?: SyncOptions,
): Promise<SyncResult> => {
  if (isSyncing) {
    log.debug("Sync already in progress, skipping");
    return { success: 0, failed: 0, total: 0, errors: [] };
  }

  if (!isOnline()) {
    log.debug("Offline, skipping sync");
    return { success: 0, failed: 0, total: 0, errors: [] };
  }

  const settings = useSettingsStore.getState().settings;
  if (options?.background && (settings.offlineMode || !settings.autoSyncEnabled)) {
    log.debug("Background sync disabled by user settings");
    return { success: 0, failed: 0, total: 0, errors: [] };
  }

  const authState = useAuthStore.getState();
  if (!authState.isAuthenticated || !authState.user) {
    log.debug("Not authenticated, skipping sync");
    return { success: 0, failed: 0, total: 0, errors: [] };
  }

  isSyncing = true;

  try {
    const queue = await getOfflineQueue();
    if (queue.length === 0) {
      isSyncing = false;
      return { success: 0, failed: 0, total: 0, errors: [] };
    }

    const total = queue.length;
    log.info(`Syncing ${total} items from offline queue`);

    // Process in batches of 50 to avoid payload size issues
    const BATCH_SIZE = 50;
    let processed = 0;
    let successCount = 0;
    let failedCount = 0;
    let errors: { id: string; error: string }[] = [];

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = queue.slice(i, i + BATCH_SIZE);

      try {
        // Optimistically transform queue items to expected sync format
        const operations = batch.map((item: OfflineQueueItem) => ({
          id: item.id,
          type: item.type,
          data: item.data,
          timestamp: item.timestamp,
        }));

        log.debug(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}`, {
          batchSize: batch.length,
          operations: operations.map((op: Record<string, unknown>) => ({
            id: op.id,
            type: op.type,
          })),
        });

        const response = await syncBatch(operations);

        // Handle response
        const results = response.results || [];
        const successIds: string[] = [];

        for (const res of results) {
          if (res.success) {
            successIds.push(res.id);
            successCount++;
          } else {
            failedCount++;
            const errorMessage = res.message || "Unknown error";
            errors.push({ id: res.id, error: errorMessage });
            log.warn(`Sync item failed: ${res.id} - ${errorMessage}`);
            // Update retry count for failed items
            await updateQueueItemRetries(res.id);
          }
        }

        // Remove successful items locally
        if (successIds.length > 0) {
          await removeManyFromOfflineQueue(successIds);
          log.debug(`Removed ${successIds.length} synced items from queue`);

          const successSet = new Set(successIds);
          for (const item of batch) {
            if (!successSet.has(item.id) || item.type !== "session") {
              continue;
            }

            const data = item.data as Record<string, unknown> | undefined;
            if (!data || "operation" in data) {
              continue;
            }

            const offlineId = data.id || data.session_id;
            if (typeof offlineId === "string") {
              await removeSessionFromCache(offlineId);
              log.debug("Removed synced offline session from cache", {
                sessionId: offlineId,
              });
            }
          }
        }
      } catch (batchError: unknown) {
        const errorMessage =
          batchError instanceof Error
            ? batchError.message
            : "Unknown batch error";

        // Check if this is an auth error (401) - don't retry, just mark all as failed
        const axiosError = batchError as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          log.warn(
            "Auth error during sync - will retry after re-authentication",
          );
          // Don't increment retries for auth errors - they may resolve after login
        } else {
          log.error(
            `Batch sync failed: ${errorMessage}`,
            batchError as Record<string, unknown>,
          );

          // Mark all items in this batch as failed and increment retries
          failedCount += batch.length;
          for (const item of batch) {
            await updateQueueItemRetries(item.id);
          }
        }
      }

      processed += batch.length;
      options?.onProgress?.(processed, total);
    }

    log.info(
      `Sync complete: ${successCount} succeeded, ${failedCount} failed`,
      {
        total,
        successCount,
        failedCount,
        errorCount: errors.length,
      },
    );

    await cleanupOldFailedItems();

    return {
      success: successCount,
      failed: failedCount,
      total,
      errors,
    };
  } catch (error: unknown) {
    log.error("Sync process error", error as Record<string, unknown>);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown sync error";
    return {
      success: 0,
      failed: 0,
      total: 0,
      errors: [{ id: "general", error: errorMessage }],
    };
  } finally {
    isSyncing = false;
  }
};

export const forceSync = async (options?: SyncOptions): Promise<SyncResult> => {
  return syncOfflineQueue(options);
};

const cleanupOldFailedItems = async (): Promise<number> => {
  try {
    const queue = await getOfflineQueue();
    const itemsToRemove: string[] = [];

    for (const item of queue) {
      if (item.retries >= CLEANUP_RETRIES_THRESHOLD) {
        log.warn(`Removing item with too many retries`, {
          id: item.id,
          type: item.type,
          retries: item.retries,
        });
        itemsToRemove.push(item.id);
      }
    }

    for (const id of itemsToRemove) {
      await removeFromOfflineQueue(id);
    }

    if (itemsToRemove.length > 0) {
      log.info(
        `Cleaned up ${itemsToRemove.length} items that exceeded retry threshold`,
      );
    }

    return itemsToRemove.length;
  } catch (error) {
    log.error("Error during cleanup", error as Record<string, unknown>);
    return 0;
  }
};
