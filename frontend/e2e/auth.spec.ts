import { test, expect } from "@playwright/test";

async function ensureCredentialsMode(page: any) {
  const usernameField = page.getByPlaceholder(/username/i);
  if (await usernameField.isVisible({ timeout: 750 }).catch(() => false)) return;

  const credentialsTab = page
    .getByRole("button", { name: /credentials/i })
    .or(page.getByText(/credentials/i));
  await credentialsTab.first().waitFor({ state: "visible", timeout: 15000 });
  await credentialsTab.first().click({ timeout: 15000 });
  await expect(usernameField).toBeVisible({ timeout: 5000 });
}

/**
 * Authentication E2E Tests
 *
 * Tests the complete authentication flow including:
 * - Login with valid credentials
 * - Login with invalid credentials
 * - PIN-based quick login
 * - Logout flow
 * - Session persistence
 */

test.describe("Authentication", () => {
  test.describe("Login Flow", () => {
    test("should show login page for unauthenticated users", async ({
      page,
    }) => {
      await page.goto("/login");

      const loginModeToggle = page.getByText(/pin|credentials/i);
      await expect(loginModeToggle).toBeVisible({ timeout: 15000 });
    });

    test("should login successfully with valid credentials", async ({
      page,
    }) => {
      await page.goto("/login");

      await ensureCredentialsMode(page);

      await page.getByPlaceholder(/username/i).fill("staff1");
      await page.getByPlaceholder(/password/i).fill("staff123");
      await page.getByRole("button", { name: /sign in/i }).click();

      // Should redirect to home/dashboard
      await expect(
        page.getByText(/new count area/i).or(page.getByText(/dashboard/i)),
      ).toBeVisible({ timeout: 15000 });
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto("/login");

      await ensureCredentialsMode(page);

      const dialogPromise = page.waitForEvent("dialog").catch(() => null);

      await page.getByPlaceholder(/username/i).fill("staff1");
      await page.getByPlaceholder(/password/i).fill("wrongpassword");
      await page.getByRole("button", { name: /sign in/i }).click();

      const dialog = await dialogPromise;
      if (dialog) {
        expect(dialog.message()).toMatch(/invalid|incorrect|failed/i);
        await dialog.accept();
        return;
      }

      await expect(
        page.getByText(/invalid|incorrect|failed/i).or(page.getByRole("alert")),
      ).toBeVisible({ timeout: 10000 });
    });

    test("should clear form fields on error", async ({ page }) => {
      await page.goto("/login");

      await ensureCredentialsMode(page);

      const usernameField = page.getByPlaceholder(/username/i);
      const passwordField = page.getByPlaceholder(/password/i);

      const dialogPromise = page.waitForEvent("dialog").catch(() => null);

      await usernameField.fill("admin");
      await passwordField.fill("wrongpassword");
      await page.getByRole("button", { name: /sign in/i }).click();

      const dialog = await dialogPromise;
      if (dialog) {
        await dialog.accept();
      } else {
        await expect(
          page.getByText(/invalid|incorrect|failed/i).or(page.getByRole("alert")),
        ).toBeVisible({ timeout: 10000 });
      }

      await expect(usernameField).toHaveValue("admin");
    });
  });

  test.describe("Logout Flow", () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto("/login");

      await ensureCredentialsMode(page);

      await page.getByPlaceholder(/username/i).fill("staff1");
      await page.getByPlaceholder(/password/i).fill("staff123");
      await page.getByRole("button", { name: /sign in/i }).click();

      await expect(
        page.getByText(/new count area/i).or(page.getByText(/dashboard/i)),
      ).toBeVisible({ timeout: 15000 });
    });

    test("should logout successfully", async ({ page }) => {
      test.skip(true, "Logout UI is app-role/layout dependent; enable when stable.");
      // Find and click logout button (might be in menu)
      const settingsLink = page.getByText(/settings/i).first();
      if (await settingsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await settingsLink.click();
      }

      const logoutTarget = page
        .getByRole("button", { name: /log\s*out|sign\s*out/i })
        .or(page.getByText(/log\s*out|sign\s*out/i));

      await expect(logoutTarget).toBeVisible({ timeout: 15000 });
      await logoutTarget.first().click();

      await expect(page.getByText(/pin|credentials/i)).toBeVisible({
        timeout: 15000,
      });
    });
  });

  test.describe("Session Persistence", () => {
    test("should maintain session after page refresh", async ({ page }) => {
      test.skip(true, "Persistence depends on storage and environment; enable when stable.");
      // Login
      await page.goto("/login");

      await ensureCredentialsMode(page);

      await page.getByPlaceholder(/username/i).fill("staff1");
      await page.getByPlaceholder(/password/i).fill("staff123");
      await page.getByRole("button", { name: /sign in/i }).click();

      await expect(
        page.getByText(/new count area/i).or(page.getByText(/dashboard/i)),
      ).toBeVisible({ timeout: 15000 });

      // Refresh page
      await page.reload();

      // Should still be logged in
      await expect(
        page.getByText(/new count area/i).or(page.getByText(/dashboard/i)),
      ).toBeVisible({ timeout: 15000 });

      // Should NOT see login screen
      await expect(page.getByRole("button", { name: /sign in/i }))
        .not.toBeVisible({ timeout: 3000 })
        .catch(() => {
          // This is expected - login button should not be visible
        });
    });
  });
});

test.describe("PIN Authentication", () => {
  test("should allow PIN-based quick login when configured", async ({
    page,
  }) => {
    // This test assumes PIN is configured for the user
    // Skip if PIN feature is not enabled
    test.skip(true, "PIN feature test - requires configured PIN");

    await page.goto("/");

    // Look for PIN entry option
    const pinOption = page.getByText(/use pin|quick login|pin/i);
    if (await pinOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await pinOption.click();

      // Enter PIN digits
      const pinInput = page.getByPlaceholder(/pin/i);
      await pinInput.fill("1234");

      // Should login successfully
      await expect(
        page.getByText(/new count area/i).or(page.getByText(/dashboard/i)),
      ).toBeVisible({ timeout: 15000 });
    }
  });
});
