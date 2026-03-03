import { ROUTES, type AppRoute } from "../constants/routes";

export type UserRole = "staff" | "supervisor" | "admin";

export const getRouteForRole = (role: UserRole): AppRoute => {
  switch (role) {
    case "supervisor":
      return ROUTES.SUPERVISOR_DASHBOARD;
    case "admin":
      return ROUTES.ADMIN_DASHBOARD_WEB;
    case "staff":
      return ROUTES.STAFF_HOME;
    default:
      // Fallback to login to avoid redirect loops on public routes
      return ROUTES.LOGIN;
  }
};

export const isRouteAllowedForRole = (route: string, role: UserRole): boolean => {
  if (route.startsWith("/admin")) return role === "admin";
  if (route.startsWith("/supervisor")) return role === "supervisor" || role === "admin";
  if (route.startsWith("/staff")) return role === "staff";

  // Shared authenticated routes like /security, /notifications, /help
  return true;
};
