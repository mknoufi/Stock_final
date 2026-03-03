import { getPublicMetrics } from "./publicAnalyticsApi";
import { AnalyticsMetric } from "../analyticsService";

class PublicAnalyticsService {
  /**
   * Get formatted metrics for the welcome screen
   */
  async getWelcomeMetrics(): Promise<AnalyticsMetric[]> {
    const data = await getPublicMetrics();
    if (!data) return this.getFallbackMetrics();

    return [
      {
        label: "Items Verified",
        value: data.verified_items,
        trend: "up",
        format: "number",
      },
      {
        label: "Completed Sessions",
        value: data.completed_sessions,
        trend: "neutral",
        format: "number",
      },
      {
        label: "Active Scanners",
        value: data.active_users_24h,
        trend: "up",
        format: "number",
      },
      {
        label: "System Uptime",
        value: Math.floor(data.system_uptime / 3600), // in hours
        trend: "neutral",
        format: "number",
      },
    ];
  }

  private getFallbackMetrics(): AnalyticsMetric[] {
    return [
      {
        label: "Items Verified",
        value: 0,
        trend: "neutral",
        format: "number",
      },
      {
        label: "Live Sessions",
        value: 0,
        trend: "neutral",
        format: "number",
      },
      {
        label: "System Status",
        value: 100,
        trend: "up",
        format: "percentage",
      },
    ];
  }

  /**
   * Format uptime from seconds to human readable
   */
  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  }
}

export const publicAnalyticsService = new PublicAnalyticsService();
export default publicAnalyticsService;
