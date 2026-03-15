import Ionicons from "@expo/vector-icons/Ionicons";

import { flags } from "../../constants/flags";

export interface AdminNavItem {
  key: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badge?: number;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        subtitle: "Admin overview, monitoring, and report tabs",
        icon: "grid",
        route: "/admin/dashboard-web",
      },
      {
        key: "sessions",
        label: "Sessions",
        subtitle: "Review active and completed count sessions",
        icon: "cube",
        route: "/supervisor/sessions",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        key: "users",
        label: "Users",
        subtitle: "Manage access, roles, and account status",
        icon: "people",
        route: "/admin/users",
      },
      {
        key: "permissions",
        label: "Permissions",
        subtitle: "Control grants and role capabilities",
        icon: "shield",
        route: "/admin/permissions",
      },
      {
        key: "security",
        label: "Security",
        subtitle: "Review admin activity and risk signals",
        icon: "lock-closed",
        route: "/admin/security",
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
      {
        key: "user-workflows",
        label: "User Workflows",
        subtitle: "Track workflow state across operators",
        icon: "git-network",
        route: "/supervisor/user-workflows",
      },
      {
        key: "realtime-dashboard",
        label: "Real-Time Dashboard",
        subtitle: "Inspect live verifications and table data",
        icon: "pulse",
        route: "/admin/realtime-dashboard",
      },
      {
        key: "activity-logs",
        label: "Activity Logs",
        subtitle: "Audit operator and session activity",
        icon: "list",
        route: "/supervisor/activity-logs",
      },
      ...(flags.enableNotes
        ? [
            {
              key: "notes",
              label: "Notes",
              subtitle: "Capture supervisor/admin handoff context",
              icon: "document-text",
              route: "/supervisor/notes",
            } satisfies AdminNavItem,
          ]
        : []),
      {
        key: "error-logs",
        label: "Error Logs",
        subtitle: "Investigate failures and crash events",
        icon: "warning",
        route: "/supervisor/error-logs",
      },
      {
        key: "sync-conflicts",
        label: "Sync Conflicts",
        subtitle: "Resolve offline and server data conflicts",
        icon: "sync",
        route: "/supervisor/sync-conflicts",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        key: "unknown-items",
        label: "Unknown Items",
        subtitle: "Resolve unmatched or unmapped inventory",
        icon: "help-circle-outline",
        route: "/admin/unknown-items",
      },
      {
        key: "sql-config",
        label: "SQL Config",
        subtitle: "Configure SQL connections and diagnostics",
        icon: "server",
        route: "/admin/sql-config",
      },
      {
        key: "logs",
        label: "System Logs",
        subtitle: "Inspect backend and service output",
        icon: "journal",
        route: "/admin/logs",
      },
      {
        key: "ai-assistant",
        label: "AI Assistant",
        subtitle: "Use admin-side AI tools and prompts",
        icon: "chatbubble-ellipses",
        route: "/admin/ai-assistant",
      },
    ],
  },
  {
    title: "Exports",
    items: [
      {
        key: "export-schedules",
        label: "Export Schedules",
        subtitle: "Schedule recurring export jobs",
        icon: "calendar",
        route: "/supervisor/export-schedules",
      },
      {
        key: "export-results",
        label: "Export Results",
        subtitle: "Review generated files and delivery status",
        icon: "document",
        route: "/supervisor/export-results",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        key: "settings",
        label: "Settings",
        subtitle: "Adjust platform defaults and personal controls",
        icon: "settings",
        route: "/admin/settings",
      },
      {
        key: "db-mapping",
        label: "DB Mapping",
        subtitle: "Maintain mapping between app and database fields",
        icon: "server",
        route: "/supervisor/db-mapping",
      },
    ],
  },
];
