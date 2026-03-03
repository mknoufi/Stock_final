/**
 * Canonical app route constants.
 * Keep path strings centralized to avoid drift across screens/guards.
 */
export const ROUTES = {
  LOGIN: "/login",
  WELCOME: "/welcome",
  REGISTER: "/register",
  HELP: "/help",
  FORGOT_PASSWORD: "/forgot-password",
  OTP_VERIFICATION: "/otp-verification",
  RESET_PASSWORD: "/reset-password",
  SECURITY: "/security",
  NOTIFICATIONS: "/notifications",

  STAFF_HOME: "/staff/home",
  SUPERVISOR_DASHBOARD: "/supervisor/dashboard",
  // Legacy alias retained for compatibility; canonical route is dashboard-web.
  ADMIN_DASHBOARD: "/admin/dashboard-web",
  ADMIN_DASHBOARD_WEB: "/admin/dashboard-web",
  ADMIN_METRICS: "/admin/metrics",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const PUBLIC_ROUTE_SET: ReadonlySet<string> = new Set<string>([
  ROUTES.LOGIN,
  ROUTES.WELCOME,
  ROUTES.REGISTER,
  ROUTES.HELP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.OTP_VERIFICATION,
  ROUTES.RESET_PASSWORD,
]);

// Routes that should never be shown to authenticated users (redirect to role home).
export const AUTH_REDIRECT_ROUTE_SET: ReadonlySet<string> = new Set<string>([
  ROUTES.LOGIN,
  ROUTES.WELCOME,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.OTP_VERIFICATION,
  ROUTES.RESET_PASSWORD,
]);
