import { syncOfflineQueue } from "../syncService";
import { createLogger } from "../logging";

const log = createLogger("offlineSyncService");
const DEFAULT_INTERVAL_MS = 30000;

let intervalId: ReturnType<typeof setInterval> | null = null;

export function startSyncService(options?: {
  intervalMs?: number;
  runImmediately?: boolean;
}): void {
  if (intervalId) return;

  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const runImmediately = options?.runImmediately ?? true;

  const run = () => {
    syncOfflineQueue({ background: true }).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      log.warn("Background sync failed", { error: message });
    });
  };

  if (runImmediately) {
    run();
  }

  intervalId = setInterval(run, intervalMs);
}

export function stopSyncService(): void {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
}
