import { getRouteForRole, isRouteAllowedForRole } from "../roleNavigation";

describe("roleNavigation.isRouteAllowedForRole", () => {
  it("returns canonical landing routes per role", () => {
    expect(getRouteForRole("staff")).toBe("/staff/home");
    expect(getRouteForRole("supervisor")).toBe("/supervisor/dashboard");
    expect(getRouteForRole("admin")).toBe("/admin/dashboard-web");
  });

  it("admin routes are admin-only", () => {
    expect(isRouteAllowedForRole("/admin/dashboard", "admin")).toBe(true);
    expect(isRouteAllowedForRole("/admin/dashboard", "supervisor")).toBe(false);
    expect(isRouteAllowedForRole("/admin/dashboard", "staff")).toBe(false);
  });

  it("supervisor routes are supervisor+admin", () => {
    expect(isRouteAllowedForRole("/supervisor/dashboard", "supervisor")).toBe(true);
    expect(isRouteAllowedForRole("/supervisor/dashboard", "admin")).toBe(true);
    expect(isRouteAllowedForRole("/supervisor/dashboard", "staff")).toBe(false);
  });

  it("staff routes are staff-only", () => {
    expect(isRouteAllowedForRole("/staff/home", "staff")).toBe(true);
    expect(isRouteAllowedForRole("/staff/home", "supervisor")).toBe(false);
    expect(isRouteAllowedForRole("/staff/home", "admin")).toBe(false);
  });

  it("non-role routes are allowed for any authenticated user", () => {
    expect(isRouteAllowedForRole("/help", "staff")).toBe(true);
    expect(isRouteAllowedForRole("/help", "supervisor")).toBe(true);
    expect(isRouteAllowedForRole("/help", "admin")).toBe(true);
  });

  it("root protected routes are allowed for authenticated users", () => {
    expect(isRouteAllowedForRole("/security", "staff")).toBe(true);
    expect(isRouteAllowedForRole("/notifications", "supervisor")).toBe(true);
  });

  it("prevents staff from accessing other role prefixes", () => {
    expect(isRouteAllowedForRole("/admin/dashboard", "staff")).toBe(false);
    expect(isRouteAllowedForRole("/supervisor/dashboard", "staff")).toBe(false);
  });

  it("prevents supervisor from accessing admin role prefixes", () => {
    expect(isRouteAllowedForRole("/admin/dashboard", "supervisor")).toBe(false);
  });
});
