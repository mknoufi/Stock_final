import {
  ADMIN_ALLOWED_EXACT_PATHS,
  SUPERVISOR_ALLOWED_EXACT_PATHS,
} from "../allowedPaths";

describe("role allowlists", () => {
  it("admin allowlist includes canonical dashboard route", () => {
    expect(ADMIN_ALLOWED_EXACT_PATHS.has("/admin/dashboard-web")).toBe(true);
  });

  it("supervisor allowlist includes routes linked from settings/sidebar", () => {
    expect(SUPERVISOR_ALLOWED_EXACT_PATHS.has("/supervisor/db-mapping")).toBe(
      true,
    );
    expect(SUPERVISOR_ALLOWED_EXACT_PATHS.has("/supervisor/error-logs")).toBe(
      true,
    );
  });
});

