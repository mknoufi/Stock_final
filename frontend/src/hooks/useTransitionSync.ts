import { useSyncExternalStore } from "react";
import { transitionQueue, TransitionRequest } from "../services/sync/TransitionQueue";

export function useTransitionSync(itemId?: string) {
  const queue = useSyncExternalStore(
    (callback) => transitionQueue.subscribe(callback),
    () => transitionQueue.getQueue()
  );

  const pendingRequests = itemId
    ? queue.filter((req) => req.payload?.item_code === itemId || req.metadata?.itemId === itemId)
    : queue;

  const handleEnqueue = (
    req: Omit<TransitionRequest, "timestamp" | "retryCount" | "nextAttemptAt" | "lastError">
  ) => {
    transitionQueue.enqueue(req);
  };

  return {
    pendingCount: pendingRequests.length,
    totalPendingCount: queue.length,
    pendingRequests,
    isSyncing: queue.length > 0,
    enqueue: handleEnqueue,
    processQueue: () => transitionQueue.processQueue(),
  };
}
