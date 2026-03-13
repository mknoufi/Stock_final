import { Platform } from "react-native";
import api from "../httpClient";

// ==========================================
// ADMIN CONTROL PANEL APIs
// ==========================================

// Service Status Management
export const getServicesStatus = async () => {
  try {
    const response = await api.get("/api/admin/control/services/status");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get services status error:", error);
    throw error;
  }
};

export const startService = async (service: string) => {
  try {
    const response = await api.post(`/api/admin/control/services/${service}/start`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Start service error:", error);
    throw error;
  }
};

export const stopService = async (service: string) => {
  try {
    const response = await api.post(`/api/admin/control/services/${service}/stop`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Stop service error:", error);
    throw error;
  }
};

// System Health & Issues
export const getSystemIssues = async () => {
  try {
    const response = await api.get("/api/admin/control/system/issues");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get system issues error:", error);
    throw error;
  }
};

export const getSystemHealthScore = async () => {
  try {
    const response = await api.get("/api/admin/control/system/health-score");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get system health score error:", error);
    throw error;
  }
};

export const getSystemStats = async () => {
  try {
    const response = await api.get("/api/admin/control/system/stats");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get system stats error:", error);
    throw error;
  }
};

// Device & Login Management
export const getLoginDevices = async () => {
  try {
    const response = await api.get("/api/admin/control/devices");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get login devices error:", error);
    throw error;
  }
};

// Log Management
export const getServiceLogs = async (service: string, lines: number = 100, level?: string) => {
  try {
    const params = new URLSearchParams({
      lines: lines.toString(),
    });
    if (level) params.append("level", level);

    const response = await api.get(`/api/admin/control/logs/${service}?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get service logs error:", error);
    throw error;
  }
};

export const clearServiceLogs = async (service: string) => {
  try {
    const response = await api.post("/api/admin/control/logs/clear", null, {
      params: { service },
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error(`Clear ${service} logs error:`, error);
    throw error;
  }
};

// Permission Management
export const getAvailablePermissions = async () => {
  try {
    const response = await api.get("/api/permissions/available");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get available permissions error:", error);
    throw error;
  }
};

export const getRolePermissions = async (role: string) => {
  try {
    const response = await api.get(`/api/permissions/roles/${role}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get role permissions error:", error);
    throw error;
  }
};

export const getUserPermissions = async (username: string) => {
  try {
    const response = await api.get(`/api/permissions/users/${username}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get user permissions error:", error);
    throw error;
  }
};

export const addUserPermissions = async (username: string, permissions: string[]) => {
  try {
    const response = await api.post(`/api/permissions/users/${username}/add`, {
      permissions,
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Add user permissions error:", error);
    throw error;
  }
};

export const removeUserPermissions = async (username: string, permissions: string[]) => {
  try {
    const response = await api.post(`/api/permissions/users/${username}/remove`, {
      permissions,
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Remove user permissions error:", error);
    throw error;
  }
};

// ==========================================
// EXPORT SCHEDULES API
// ==========================================

export const getExportSchedules = async (enabled?: boolean) => {
  try {
    const params = new URLSearchParams();
    if (enabled !== undefined) params.append("enabled", enabled.toString());

    const response = await api.get(`/api/exports/schedules?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get export schedules error:", error);
    throw error;
  }
};

export const getExportSchedule = async (scheduleId: string) => {
  try {
    const response = await api.get(`/api/exports/schedules/${scheduleId}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get export schedule error:", error);
    throw error;
  }
};

export const createExportSchedule = async (scheduleData: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/exports/schedules", scheduleData);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Create export schedule error:", error);
    throw error;
  }
};

export const updateExportSchedule = async (
  scheduleId: string,
  scheduleData: Record<string, unknown>
) => {
  try {
    const response = await api.put(`/api/exports/schedules/${scheduleId}`, scheduleData);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Update export schedule error:", error);
    throw error;
  }
};

export const deleteExportSchedule = async (scheduleId: string) => {
  try {
    const response = await api.delete(`/api/exports/schedules/${scheduleId}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Delete export schedule error:", error);
    throw error;
  }
};

export const triggerExportSchedule = async (scheduleId: string) => {
  try {
    const response = await api.post(`/api/exports/schedules/${scheduleId}/trigger`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Trigger export schedule error:", error);
    throw error;
  }
};

export const getExportResults = async (
  scheduleId?: string,
  status?: string,
  page: number = 1,
  pageSize: number = 50
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (scheduleId) params.append("schedule_id", scheduleId);
    if (status) params.append("status", status);

    const response = await api.get(`/api/exports/results?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get export results error:", error);
    throw error;
  }
};

export const downloadExportResult = async (resultId: string) => {
  try {
    const response = await api.get(`/api/exports/results/${resultId}/download`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Download export result error:", error);
    throw error;
  }
};

// ==========================================
// SYNC CONFLICTS API
// ==========================================

export const getSyncConflicts = async (
  status?: string,
  sessionId?: string,
  page: number = 1,
  pageSize: number = 50
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (status) params.append("status", status);
    if (sessionId) params.append("session_id", sessionId);

    const response = await api.get(`/api/sync/conflicts?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get sync conflicts error:", error);
    throw error;
  }
};

export const getSyncConflictDetail = async (conflictId: string) => {
  try {
    const response = await api.get(`/api/sync/conflicts/${conflictId}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get sync conflict detail error:", error);
    throw error;
  }
};

export const resolveSyncConflict = async (
  conflictId: string,
  resolution: string,
  resolutionNote?: string
) => {
  try {
    const response = await api.post(`/api/sync/conflicts/${conflictId}/resolve`, {
      resolution,
      resolution_note: resolutionNote,
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Resolve sync conflict error:", error);
    throw error;
  }
};

export const batchResolveSyncConflicts = async (
  conflictIds: string[],
  resolution: string,
  resolutionNote?: string
) => {
  try {
    const response = await api.post("/api/sync/conflicts/batch-resolve", {
      conflict_ids: conflictIds,
      resolution,
      resolution_note: resolutionNote,
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Batch resolve sync conflicts error:", error);
    throw error;
  }
};

export const getSyncConflictStats = async () => {
  try {
    const response = await api.get("/api/sync/conflicts/stats");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get sync conflict stats error:", error);
    throw error;
  }
};

// ==========================================
// METRICS API
// ==========================================

export const getMetrics = async () => {
  try {
    const response = await api.get("/api/metrics");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get metrics error:", error);
    throw error;
  }
};

export const getMetricsHealth = async () => {
  try {
    const response = await api.get("/api/metrics/health");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get metrics health error:", error);
    throw error;
  }
};

// Health check alias for backward compatibility
export const checkHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Health check error:", error);
    throw error;
  }
};

export const getMetricsStats = async () => {
  try {
    const response = await api.get("/api/metrics/stats");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get metrics stats error:", error);
    throw error;
  }
};

// Sync Status API
export const getSyncStatus = async () => {
  try {
    const response = await api.get("/api/sync/status");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get sync status error:", error);
    throw error;
  }
};

export const getSyncStats = async () => {
  try {
    const response = await api.get("/api/sync/stats");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get sync stats error:", error);
    throw error;
  }
};

export const triggerManualSync = async () => {
  try {
    const response = await api.post("/api/sync/trigger");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Trigger manual sync error:", error);
    throw error;
  }
};

export const getAvailableReports = async () => {
  try {
    const response = await api.get("/api/admin/control/reports/available");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get available reports error:", error);
    throw error;
  }
};

export type AdminControlReportFormat = "json" | "csv" | "excel";

export type GenerateAdminControlReportResult =
  | { kind: "json"; data: any }
  | { kind: "file"; blob: Blob; fileName: string; contentType?: string }
  | {
      kind: "file";
      arrayBuffer: ArrayBuffer;
      fileName: string;
      contentType?: string;
    };

export const generateReport = async (
  reportId: string,
  options: {
    format?: AdminControlReportFormat;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<GenerateAdminControlReportResult> => {
  try {
    const format = options.format ?? "json";
    const params = {
      report_id: reportId,
      format,
      start_date: options.startDate,
      end_date: options.endDate,
    };

    const responseType =
      format === "json" ? "json" : Platform.OS === "web" ? "blob" : "arraybuffer";

    const response = await api.post("/api/admin/control/reports/generate", null, {
      params,
      responseType: responseType as any,
    });

    const header =
      (response.headers?.["content-disposition"] as string | undefined) ||
      (response.headers?.["Content-Disposition"] as string | undefined);

    const fileName =
      header?.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i)?.[1]?.trim() ||
      `${reportId}_${new Date().toISOString().slice(0, 10)}.${format === "excel" ? "xlsx" : format}`;

    if (format === "json") {
      return { kind: "json", data: response.data };
    }

    const contentType = response.headers?.["content-type"] as string | undefined;
    if (Platform.OS === "web") {
      return {
        kind: "file",
        blob: response.data as Blob,
        fileName,
        contentType,
      };
    }

    return {
      kind: "file",
      arrayBuffer: response.data as ArrayBuffer,
      fileName,
      contentType,
    };
  } catch (error: unknown) {
    __DEV__ && console.error("Generate report error:", error);
    throw error;
  }
};

export const getSqlServerConfig = async () => {
  try {
    const response = await api.get("/api/admin/control/sql-server/config");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get SQL Server config error:", error);
    throw error;
  }
};

export const updateSqlServerConfig = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/admin/control/sql-server/config", config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Update SQL Server config error:", error);
    throw error;
  }
};

export const testSqlServerConnection = async (config?: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/admin/control/sql-server/test", config || {});
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Test SQL Server connection error:", error);
    throw error;
  }
};

// Security Dashboard API
export const getSecuritySummary = async () => {
  try {
    const response = await api.get("/api/admin/security/summary");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get security summary error:", error);
    throw error;
  }
};

export const getFailedLogins = async (
  limit: number = 100,
  hours: number = 24,
  username?: string,
  ipAddress?: string
) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      hours: hours.toString(),
    });
    if (username) params.append("username", username);
    if (ipAddress) params.append("ip_address", ipAddress);
    const response = await api.get(`/api/admin/security/failed-logins?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get failed logins error:", error);
    throw error;
  }
};

export const getSuspiciousActivity = async (hours: number = 24) => {
  try {
    const response = await api.get(`/api/admin/security/suspicious-activity?hours=${hours}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get suspicious activity error:", error);
    throw error;
  }
};

export const getSecuritySessions = async (limit: number = 100, activeOnly: boolean = false) => {
  try {
    const response = await api.get(
      `/api/admin/security/sessions?limit=${limit}&active_only=${activeOnly}`
    );
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get security sessions error:", error);
    throw error;
  }
};

export const getSecurityAuditLog = async (
  limit: number = 100,
  hours: number = 24,
  action?: string,
  user?: string
) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      hours: hours.toString(),
    });
    if (action) params.append("action", action);
    if (user) params.append("user", user);
    const response = await api.get(`/api/admin/security/audit-log?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get security audit log error:", error);
    throw error;
  }
};

export const getIpTracking = async (hours: number = 24) => {
  try {
    const response = await api.get(`/api/admin/security/ip-tracking?hours=${hours}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get IP tracking error:", error);
    throw error;
  }
};

// SQL Server Connection API
export const getSQLStatus = async () => {
  try {
    const response = await api.get("/api/admin/sql/status");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get SQL status error:", error);
    throw error;
  }
};

export const testSQLConnection = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/admin/sql/test", config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Test SQL connection error:", error);
    throw error;
  }
};

export const configureSQLConnection = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/admin/sql/configure", config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Configure SQL connection error:", error);
    throw error;
  }
};

export const getSQLConnectionHistory = async () => {
  try {
    const response = await api.get("/api/admin/sql/history");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get SQL connection history error:", error);
    throw error;
  }
};

// Master Settings API
export const getSystemParameters = async () => {
  try {
    const response = await api.get("/api/admin/settings/parameters");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get system parameters error:", error);
    throw error;
  }
};

export const updateSystemParameters = async (parameters: Record<string, unknown>) => {
  try {
    const response = await api.put("/api/admin/settings/parameters", parameters);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Update system parameters error:", error);
    throw error;
  }
};

export const getSettingsCategories = async () => {
  try {
    const response = await api.get("/api/admin/settings/categories");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get settings categories error:", error);
    throw error;
  }
};

export const resetSettingsToDefaults = async (category?: string) => {
  try {
    const params = category ? { category } : {};
    const response = await api.post("/api/admin/settings/reset", null, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Reset settings error:", error);
    throw error;
  }
};

// Settings API
export const getSystemSettings = async () => {
  try {
    const response = await api.get("/api/admin/settings/parameters");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get system settings error:", error);
    throw error;
  }
};

export const updateSystemSettings = async (settings: Record<string, unknown>) => {
  try {
    const response = await api.put("/api/admin/settings/parameters", settings);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Update system settings error:", error);
    throw error;
  }
};
