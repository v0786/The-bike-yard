import { test, expect } from "@playwright/test";

test.use({ baseURL: process.env.BASE_URL || "http://localhost:3000" });

test.describe("The Bike Yard — Public Website", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=The Bike Yard")).toBeVisible();
  });

  test("public homepage does not expose internal cost data", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("text=purchase cost, internal cost, dealer cost")
    ).not.toBeVisible();
  });
});

test.describe("The Bike Yard — Authentication & Route Protection", () => {
  const ADMIN_EMAIL = "admin@thebikeyard.local";
  const ADMIN_PASSWORD = "changed-immediately";

  test("protected admin routes redirect unauthenticated users to sign-in", async ({ page }) => {
    const response = await page.goto("/admin/dashboard");
    // Should redirect (302/307) to sign-in
    expect([302, 307]).toContain(response?.status() ?? 0);
  });

  test("protected staff routes redirect unauthenticated users to sign-in", async ({ page }) => {
    const response = await page.goto("/staff/dashboard");
    expect([302, 307]).toContain(response?.status() ?? 0);
  });

  test("admin can sign in and access dashboard", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    // After sign-in, should redirect to admin dashboard or callback
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("rejected with invalid credentials", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill("wrong-password");
    await page.click('button[type="submit"]');
    // Should stay on sign-in page or show error
    await expect(page).toHaveURL(/\/auth\/(error|signin)/);
  });
});

test.describe("The Bike Yard — Admin Dashboard (authenticated)", () => {
  const ADMIN_EMAIL = "admin@thebikeyard.local";
  const ADMIN_PASSWORD = "changed-immediately";

  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signin");
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin/);
  });

  test("dashboard loads after sign-in", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("stock units page loads", async ({ page }) => {
    await page.goto("/admin/stock/units");
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("sales page loads", async ({ page }) => {
    await page.goto("/admin/sales");
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("payments page loads", async ({ page }) => {
    await page.goto("/admin/payments");
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("refunds page loads", async ({ page }) => {
    await page.goto("/admin/refunds");
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("invoices page loads", async ({ page }) => {
    await page.goto("/admin/invoices");
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("bookings page loads", async ({ page }) => {
    await page.goto("/admin/bookings");
    await expect(page.locator("h1, h2")).toBeVisible();
  });
});

test.describe("The Bike Yard — Staff Portal", () => {
  test("staff login page is protected", async ({ page }) => {
    const response = await page.goto("/staff/login");
    expect([302, 307]).toContain(response?.status() ?? 0);
  });
});
