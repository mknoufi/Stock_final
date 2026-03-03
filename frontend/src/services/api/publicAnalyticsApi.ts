import api, { connectionManager } from "../httpClient";
import { createLogger } from "../logging";

const log = createLogger("PublicAnalyticsApi");

export interface PublicMetrics {
  total_items_scanned: number;
  verified_items: number;
  total_sessions: number;
  completed_sessions: number;
  system_uptime: number;
  active_users_24h: number;
  timestamp: string;
}

/**
 * Fetch public metrics for the welcome screen
 * This call does not require authentication
 */
export const getPublicMetrics = async (): Promise<PublicMetrics | null> => {
  try {
    // Reduced timeout for discovery-phase calls to prevent long hangs
    const response = await api.get("/api/metrics/public", { timeout: 8000 });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    log.warn("Failed to fetch public metrics initially", error);

    // If we failed and connection is not yet healthy, it might be discovery lag
    const connection = connectionManager.getConnection();
    if (!connection?.isHealthy) {
      log.info(
        "Connectivity unsettled; metrics will be updated via ConnectionManager subscription elsewhere."
      );
    }
    return null;
  }
};
