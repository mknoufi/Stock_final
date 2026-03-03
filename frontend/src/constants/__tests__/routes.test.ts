import { AUTH_REDIRECT_ROUTE_SET, PUBLIC_ROUTE_SET, ROUTES } from "../routes";

describe("routes: public vs auth-redirect", () => {
  it("help is public and NOT auth-redirect", () => {
    expect(PUBLIC_ROUTE_SET.has(ROUTES.HELP)).toBe(true);
    expect(AUTH_REDIRECT_ROUTE_SET.has(ROUTES.HELP)).toBe(false);
  });

  it("security is NOT public", () => {
    expect(PUBLIC_ROUTE_SET.has(ROUTES.SECURITY)).toBe(false);
  });

  it("notifications is NOT public", () => {
    expect(PUBLIC_ROUTE_SET.has(ROUTES.NOTIFICATIONS)).toBe(false);
  });
});

