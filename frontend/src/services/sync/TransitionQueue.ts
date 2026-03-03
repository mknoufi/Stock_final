import NetInfo from "@react-native-community/netinfo";
import { createLogger } from "../logging";
import apiClient from "../httpClient";
import { mmkvStorage } from "../mmkvStorage";

const log = createLogger("TransitionQueue");
const STORAGE_KEY = "offline_transition_queue";

export interface TransitionRequest {
  id: string;
  type: "verify" | "unverify" | "approve" | "reject" | "mutation";
  url: string;
  method: "POST" | "PUT" | "DELETE" | "PATCH";
  payload?: any;
  timestamp: number;
  retryCount: number;
  nextAttemptAt?: number;
  lastError?: string;
  metadata?: Record<string, any>;
}

class TransitionQueueService {
  private static readonly MAX_RETRIES = 5;
  private static readonly BASE_BACKOFF_MS = 2000;
  private static readonly MAX_BACKOFF_MS = 60000;

  private queue: TransitionRequest[] = [];
  private isProcessing: boolean = false;
  private listeners: ((queue: TransitionRequest[]) => void)[] = [];
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.loadQueue();
    // Auto-process on network restore
    NetInfo.addEventListener((state) => {
      const isOnline = !!state.isConnected && state.isInternetReachable !== false;
      if (isOnline) {
        this.processQueue();
      }
    });
  }

  private loadQueue() {
    try {
      const json = mmkvStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed = JSON.parse(json) as TransitionRequest[];
        this.queue = parsed.map((req) => ({
          ...req,
          nextAttemptAt: req.nextAttemptAt ?? req.timestamp,
        }));
        log.info("Loaded offline queue", { count: this.queue.length });
      }
    } catch (e) {
      log.error("Failed to load transition queue", e);
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
      this.scheduleNextProcessing();
    } catch (e) {
      log.error("Failed to save transition queue", e);
    }
  }

  private clearRetryTimer() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private scheduleNextProcessing() {
    this.clearRetryTimer();
    if (this.queue.length === 0) return;

    const nextAttempt = this.queue.reduce((min, req) => {
      const candidate = req.nextAttemptAt ?? req.timestamp;
      return Math.min(min, candidate);
    }, Number.POSITIVE_INFINITY);

    if (!Number.isFinite(nextAttempt)) return;

    const delayMs = Math.max(0, nextAttempt - Date.now());
    this.retryTimer = setTimeout(() => {
      this.processQueue();
    }, delayMs);
  }

  private calculateBackoffMs(nextRetryCount: number): number {
    const exponential = TransitionQueueService.BASE_BACKOFF_MS * 2 ** Math.max(0, nextRetryCount - 1);
    return Math.min(exponential, TransitionQueueService.MAX_BACKOFF_MS);
  }

  public enqueue(
    request: Omit<TransitionRequest, "timestamp" | "retryCount" | "nextAttemptAt" | "lastError">
  ) {
    const newRequest: TransitionRequest = {
      ...request,
      timestamp: Date.now(),
      retryCount: 0,
      nextAttemptAt: Date.now(),
    };
    // Immutable update
    this.queue = [...this.queue, newRequest];
    this.saveQueue();
    log.info("Enqueued transition request", {
      id: newRequest.id,
      type: newRequest.type,
    });

    // Try to process immediately if connected
    this.processQueue();
  }

  public getQueue(): TransitionRequest[] {
    return this.queue;
  }

  public getPendingRequests(itemId?: string): TransitionRequest[] {
    if (!itemId) return this.queue;
    return this.queue.filter(
      (req) => req.payload?.item_code === itemId || req.metadata?.itemId === itemId
    );
  }

  public subscribe(listener: (queue: TransitionRequest[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l(this.queue));
  }

  public async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    const state = await NetInfo.fetch();
    const isOnline = !!state.isConnected && state.isInternetReachable !== false;
    if (!isOnline) {
      log.debug("Skipping queue processing: Offline");
      this.scheduleNextProcessing();
      return;
    }

    this.isProcessing = true;
    log.info("Processing transition queue", { count: this.queue.length });

    try {
      const currentQueue = [...this.queue].sort((a, b) => a.timestamp - b.timestamp);
      const completedIds: string[] = [];
      const retryUpdates: { id: string; count: number; nextAttemptAt: number; lastError?: string }[] = [];
      let attemptedCount = 0;
      const now = Date.now();

      for (const req of currentQueue) {
        if ((req.nextAttemptAt ?? req.timestamp) > now) {
          continue;
        }

        attemptedCount += 1;

        // Stop if network drops mid-process
        const netState = await NetInfo.fetch();
        const stillOnline = !!netState.isConnected && netState.isInternetReachable !== false;
        if (!stillOnline) {
          log.warn("Network lost during queue processing, stopping.");
          break;
        }

        try {
          log.debug("Sending queued request", { id: req.id, url: req.url });

          await apiClient.request({
            method: req.method,
            url: req.url,
            data: req.payload,
          });

          log.info("Successfully processed offline request", { id: req.id });
          completedIds.push(req.id);
        } catch (error: any) {
          const status = error.response?.status;

          // Retryable codes: Network error (undefined status), 5xx, 429, 408
          const isRetryable = !status || status >= 500 || status === 429 || status === 408;

          if (isRetryable && req.retryCount < TransitionQueueService.MAX_RETRIES) {
            const nextRetryCount = req.retryCount + 1;
            const backoffMs = this.calculateBackoffMs(nextRetryCount);
            const nextAttemptAt = Date.now() + backoffMs;
            log.warn("Request failed, scheduling retry", {
              id: req.id,
              retry: nextRetryCount,
              nextAttemptAt,
              error: error.message,
            });
            retryUpdates.push({
              id: req.id,
              count: nextRetryCount,
              nextAttemptAt,
              lastError: error.message,
            });
          } else {
            log.error("Request failed permanently or max retries exceeded", {
              id: req.id,
              status,
              error: error.message,
            });
            // Permanent failure: Remove it from queue to stop blocking
            completedIds.push(req.id);
          }
        }
      }

      // Batch update the queue
      if (completedIds.length > 0 || retryUpdates.length > 0) {
        this.queue = this.queue.filter((req) => !completedIds.includes(req.id));

        this.queue = this.queue.map((req) => {
          const update = retryUpdates.find((u) => u.id === req.id);
          return update
            ? {
                ...req,
                retryCount: update.count,
                nextAttemptAt: update.nextAttemptAt,
                lastError: update.lastError,
              }
            : req;
        });

        this.saveQueue();
      } else if (attemptedCount === 0) {
        log.debug("No queued transitions are due yet; waiting for next retry window");
        this.scheduleNextProcessing();
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export const transitionQueue = new TransitionQueueService();
