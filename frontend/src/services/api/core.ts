import { getNetworkStatus } from "../../utils/network";
import { createLogger } from "../logging";

const log = createLogger("ApiService");

export type DataSource = "api" | "cache" | "local" | "sql";

/**
 * Response with source metadata for transparency about data freshness
 */
export interface ApiResponseWithSource<T> {
  data: T;
  _source: DataSource;
  _cachedAt?: string | null;
  _stale?: boolean;
  _degraded?: boolean;
}

// Check if online - uses three-state network model for better reliability
export const isOnline = () => {
  const { status, isOnline: rawOnline, isInternetReachable, connectionType } = getNetworkStatus();

  // Debug logging
  log.debug("Network Status Check", {
    status,
    isOnline: rawOnline,
    isInternetReachable,
    connectionType,
  });

  // Use three-state logic: only skip API if definitely offline
  return status !== "OFFLINE";
};
