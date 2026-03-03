/**
 * Role layout allowlists.
 *
 * These are intentionally strict and should include every route we actually
 * link to from within the app (sidebars, buttons, etc).
 */

export const ADMIN_ALLOWED_EXACT_PATHS = new Set<string>([
  "/admin",
  "/admin/index",
  // Legacy deep-link kept via redirect stub.
  "/admin/dashboard",
  "/admin/dashboard-web",
  "/admin/ai-assistant",
  "/admin/live-view",
  "/admin/realtime-dashboard",
  "/admin/users",
  "/admin/permissions",
  "/admin/security",
  "/admin/metrics",
  "/admin/unknown-items",
  "/admin/sql-config",
  "/admin/logs",
  "/admin/settings",
  "/admin/reports",
  "/admin/control-panel",
  "/admin/control-panel-v2",
]);

export const SUPERVISOR_ALLOWED_EXACT_PATHS = new Set<string>([
  "/supervisor",
  "/supervisor/index",
  "/supervisor/dashboard",
  "/supervisor/sessions",
  "/supervisor/variances",
  "/supervisor/variance-details",
  "/supervisor/items",
  "/supervisor/offline-queue",
  "/supervisor/sync-conflicts",
  "/supervisor/dead-letter",
  "/supervisor/settings",
  "/supervisor/db-mapping",
  "/supervisor/error-logs",
]);

export const SUPERVISOR_ALLOWED_PREFIX_PATHS = ["/supervisor/session/"] as const;
