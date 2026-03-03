import api from "../httpClient";
import { syncOfflineQueue as syncOfflineQueueService } from "../syncService";

// Import for grouped exports
import {
  createSession,
  getSessions,
  getSession,
  bulkCloseSessions,
  bulkReconcileSessions,
  bulkExportSessions,
  getSessionsAnalytics,
  updateSessionStatus,
} from "./sessions";
import {
  createCountLine,
  getCountLines,
  checkItemCounted,
  addQuantityToCountLine,
  getVarianceReasons,
  approveCountLine,
  rejectCountLine,
  verifyStock,
  unverifyStock,
} from "./count";
import {
  getItemByBarcode,
  searchItems,
  searchItemsOptimized,
  searchItemsManual,
  getSearchSuggestions,
  createUnknownItem,
  getItemBatches,
} from "./inventory";
import { refreshItemStock } from "./erp";
import {
  getAvailableTables,
  getTableColumns,
  getCurrentMapping,
  testMapping,
  saveMapping,
  removeUserPermissions,
  addUserPermissions,
  getUnknownItems,
  mapUnknownToSku,
  createSkuFromUnknown,
  deleteUnknownItem,
  getWatchtowerStats,
} from "./admin";
import {
  getExportSchedules,
  getExportSchedule,
  createExportSchedule,
  updateExportSchedule,
  deleteExportSchedule,
  triggerExportSchedule,
  getExportResults,
  downloadExportResult,
  getAvailableReports,
  generateReport,
} from "./reports";
import {
  getSyncConflicts,
  getSyncConflictDetail,
  resolveSyncConflict,
  batchResolveSyncConflicts,
  getSyncConflictStats,
  getSyncStatus,
  getSyncStats,
  triggerManualSync,
} from "./sync";
import {
  getSystemParameters,
  updateSystemParameters,
  getSettingsCategories,
  resetSettingsToDefaults,
  getSystemSettings,
  updateSystemSettings,
} from "./settings";
import {
  createRecountRequest,
  listRecountRequests,
  getRecountRequest,
  completeRecountRequest,
  cancelRecountRequest,
  reassignRecountRequest,
  getRecountRejectionHistory,
  acceptRecountRequest,
  rejectRecountRequest,
  startRecount,
  submitRecount,
} from "./recountRequests";
import {
  getSqlServerConfig,
  updateSqlServerConfig,
  testSqlServerConnection,
  getSQLStatus,
  testSQLConnection,
  configureSQLConnection,
  getSQLConnectionHistory,
} from "./sql";
import {
  getSecuritySummary,
  getFailedLogins,
  getSuspiciousActivity,
  getSecuritySessions,
  getSecurityAuditLog,
  getIpTracking,
} from "./security";
import {
  getServicesStatus,
  startService,
  stopService,
  getSystemIssues,
  getLoginDevices,
  getServiceLogs,
  clearServiceLogs,
} from "./admin";
import {
  getMetrics,
  getMetricsHealth,
  getMetricsStats,
  getSystemHealthScore,
  getSystemStats,
} from "./metrics";

// Re-export all services
export * from "./core";
export * from "./auth";
export * from "./erp";
export * from "./logging";
export * from "./sessions";
export * from "./inventory";
export * from "./count";
export * from "./admin";
export * from "./sync";
export * from "./locations";
export * from "./ai";
export * from "./notifications";
export * from "./dynamicFields";
export * from "./diagnosis";
export * from "./reports";
export * from "./security";
export * from "./settings";
export * from "./sql";
export * from "./metrics";
export * from "./recountRequests";

// Re-export default for backward compatibility
export default api;

// Manual exports for things that need special handling or aliases

// Sync offline queue wrapper (to match original API signature)
export const syncOfflineQueue = async (options?: Record<string, unknown>) => {
  return await syncOfflineQueueService(options);
};

// Grouped Exports (matching original api.ts structure)

export const sessionsApi = {
  createSession,
  getSessions,
  getSession,
  bulkCloseSessions,
  bulkReconcileSessions,
  bulkExportSessions,
  getSessionsAnalytics,
  updateSessionStatus,
};

export const countLineApi = {
  createCountLine,
  getCountLines,
  checkItemCounted,
  addQuantityToCountLine,
  getVarianceReasons,
  approveCountLine,
  rejectCountLine,
  verifyStock,
  unverifyStock,
};

export const itemsApi = {
  getItemByBarcode,
  searchItems,
  searchItemsOptimized,
  searchItemsManual,
  getSearchSuggestions,
  createUnknownItem,
  refreshItemStock,
  getItemBatches,
};

export const mappingApi = {
  getAvailableTables,
  getTableColumns,
  getCurrentMapping,
  testMapping,
  saveMapping,
  removeUserPermissions,
  addUserPermissions,
  getUnknownItems,
  mapUnknownToSku,
  createSkuFromUnknown,
  deleteUnknownItem,
};

export const exportsApi = {
  getExportSchedules,
  getExportSchedule,
  createExportSchedule,
  updateExportSchedule,
  deleteExportSchedule,
  triggerExportSchedule,
  getExportResults,
  downloadExportResult,
};

export const syncApi = {
  syncOfflineQueue,
  getSyncConflicts,
  getSyncConflictDetail,
  resolveSyncConflict,
  batchResolveSyncConflicts,
  getSyncConflictStats,
  getSyncStatus,
  getSyncStats,
  triggerManualSync,
};

export const metricsApi = {
  getMetrics,
  getMetricsHealth,
  getMetricsStats,
  getSystemHealthScore,
  getSystemStats,
};

export const adminControlApi = {
  getServicesStatus,
  startService,
  stopService,
  getSystemIssues,
  getLoginDevices,
  getServiceLogs,
  clearServiceLogs,
  getWatchtowerStats,
};

export const reportsApi = {
  getAvailableReports,
  generateReport,
};

export const sqlServerApi = {
  getSqlServerConfig,
  updateSqlServerConfig,
  testSqlServerConnection,
  getSQLStatus,
  testSQLConnection,
  configureSQLConnection,
  getSQLConnectionHistory,
};

export const securityApi = {
  getSecuritySummary,
  getFailedLogins,
  getSuspiciousActivity,
  getSecuritySessions,
  getSecurityAuditLog,
  getIpTracking,
};

export const settingsApi = {
  getSystemParameters,
  updateSystemParameters,
  getSettingsCategories,
  resetSettingsToDefaults,
  getSystemSettings,
  updateSystemSettings,
};

export const recountRequestApi = {
  createRecountRequest,
  listRecountRequests,
  getRecountRequest,
  completeRecountRequest,
  cancelRecountRequest,
  reassignRecountRequest,
  getRecountRejectionHistory,
  acceptRecountRequest,
  rejectRecountRequest,
  startRecount,
  submitRecount,
};
