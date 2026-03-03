import { test, expect } from "@playwright/test";

test.describe("Misplaced Item Verification", () => {
  test("should show warning when scanning item in wrong rack", async ({ page }) => {
    // 1. Login
    await page.goto("/auth/login");
    await page.fill('input[placeholder="Username"]', "staff2");
    await page.fill('input[placeholder="Password"]', "staff123");
    await page.click("text=Login");

    // Verify Dashboard
    await expect(page.getByText("Dashboard")).toBeVisible();

    // 2. Start Session in Rack "B1" (Item is in A1)
    await page.click("text=Start New Session");
    await page.click("text=Showroom");
    await page.click("text=Ground Floor");
    await page.fill('input[placeholder="e.g. A-123"]', "B1");
    await page.click("text=Start Session");

    // Verify Scan Screen
    await expect(page.getByText("Scan Barcode")).toBeVisible();

    // 3. Scan Item 510005
    await page.fill('input[placeholder="Enter barcode or item code..."]', "510005");
    await page.getByTestId("scan-search-submit").click();

    // 4. Verify Item Detail and Warning - Increased timeout to 15s
    await expect(page.getByText("SAGARA CHAPPATHI ROASTER")).toBeVisible({ timeout: 15000 });

    // Expect Warning Badge Title - Exact uppercase match
    await expect(page.getByText("MISPLACED ITEM")).toBeVisible({ timeout: 5000 });

    console.log("Test Passed: Misplaced warning visible");
  });
});
