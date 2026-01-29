import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard Access", () => {
  test("should allow admin login and access dashboard", async ({ page }) => {
    // 1. Go to Login
    await page.goto("/auth/login");

    // 2. Fill Credentials
    await page.fill('input[placeholder="Username"]', "admin");
    await page.fill('input[placeholder="Password"]', "admin123");

    // 3. Submit
    await page.click("text=Login");

    // 4. Verification
    // Wait for navigation or specific admin element
    // Check for "Admin" text which usually appears in header/sidebar
    await expect(page.getByText("Admin", { exact: false })).toBeVisible({ timeout: 15000 });

    // Check for Dashboard specific text
    // Adjust based on actual UI if needed, but "Dashboard" is common
    try {
      await expect(page.getByText("Dashboard")).toBeVisible();
    } catch (e) {
      console.log("Dashboard text not found, checking for alternative admin indicators");
      await expect(page.locator("text=Control Panel")).toBeVisible();
    }

    console.log("Admin login successful");
  });
});
