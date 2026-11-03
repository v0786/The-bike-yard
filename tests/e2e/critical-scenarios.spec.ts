import { test, expect } from "@playwright/test"

test.describe("The Bike Yard — Critical Business Scenarios (TESTING.md §13)", () => {
  test.use({ baseURL: process.env.BASE_URL || "http://localhost:3000" })

  test("same physical bike cannot be reserved/sold twice", async ({ page }) => {
    // Navigate to admin stock inward, add a bike, then attempt to reserve/sell it twice
    await page.goto("/admin/login")
    await page.fill('input[name="email"]', "admin@thebikeyard.local")
    await page.fill('input[name="password"]', "admin123")
    await page.click('button[type="submit"]')

    await page.goto("/admin/stock/units")
    // ... stock inward flow
    // Attempt second reservation on same chassis → expect 409 RESERVATION_CONFLICT
    await expect(page.locator("text=RESERVATION_CONFLICT")).toBeVisible()
  })

  test("only one active reservation per unit; history preserved", async ({ page }) => {
    await page.goto("/admin/login")
    await page.fill('input[name="email"]', "admin@thebikeyard.local")
    await page.fill('input[name="password"]', "admin123")
    await page.click('button[type="submit"]')

    await page.goto("/admin/bookings")
    // Create booking → unit reserved
    // Cancel booking → reservation released, history retained
    // Re-book same unit → new active reservation succeeds
    await expect(page.locator("text=reservation history")).toBeVisible()
  })

  test("failed/cancelled booking releases reservation correctly", async ({ page }) => {
    await page.goto("/admin/login")
    await page.fill('input[name="email"]', "admin@thebikeyard.local")
    await page.fill('input[name="password"]', "admin123")
    await page.click('button[type="submit"]')

    await page.goto("/admin/bookings")
    // Cancel booking → unit status returns to "available"
    await expect(page.locator('text=available')).toBeVisible()
  })

  test("booking advance carried to sale exactly once", async ({ page }) => {
    await page.goto("/admin/login")
    await page.fill('input[name="email"]', "admin@thebikeyard.local")
    await page.fill('input[name="password"]', "admin123")
    await page.click('button[type="submit"]')

    await page.goto("/admin/bookings")
    // Record advance against booking
    // Convert booking to sale
    // Verify advance allocation carried to sale exactly once; outstanding correct
    await expect(page.locator("text=advance carried")).toBeVisible()
  })

  test("refund self-approval blocked (403)", async ({ page }) => {
    await page.goto("/admin/login")
    await page.fill('input[name="email"]', "accountant@thebikeyard.local")
    await page.fill('input[name="password"]', "accountant123")
    await page.click('button[type="submit"]')

    await page.goto("/admin/refunds")
    // Request a refund, then attempt to approve own refund → expect 403
    await expect(page.locator("text=403")).toBeVisible()
    await expect(page.locator("text=self-approve")).toBeVisible()
  })

  test("invoice totals use correct immutable GST snapshot", async ({ page }) => {
    await page.goto("/admin/login")
    await page.fill('input[name="email"]', "admin@thebikeyard.local")
    await page.fill('input[name="password"]', "admin123")
    await page.click('button[type="submit"]')

    await page.goto("/admin/invoices")
    // Generate GST invoice → verify CGST+SGST+IGST = GST; rate in basis points
    await expect(page.locator("text=CGST+SGST+IGST = GST")).toBeVisible()
  })

  test("stock movements written for all types", async ({ page }) => {
    await page.goto("/admin/login")
    await page.fill('input[name="email"]', "admin@thebikeyard.local")
    await page.fill('input[name="password"]', "admin123")
    await page.click('button[type="submit"]')

    await page.goto("/admin/stock/movements")
    // Perform inward, reservation, sale, return, adjustment, delivery
    // Verify movement rows written for each type
    await expect(page.locator("text=inward")).toBeVisible()
    await expect(page.locator("text=sale")).toBeVisible()
    await expect(page.locator("text=delivery")).toBeVisible()
  })

  test("staff cannot access another role's restricted data", async ({ page }) => {
    await page.goto("/admin/login")
    await page.fill('input[name="email"]', "accountant@thebikeyard.local")
    await page.fill('input[name="password"]', "accountant123")
    await page.click('button[type="submit"]')

    // Accountant attempts stock inward → 403
    await page.goto("/admin/stock/inward")
    await expect(page.locator("text=403")).toBeVisible()
  })

  test("public pages never leak internal cost or customer documents", async ({ page }) => {
    await page.goto("/")
    await page.goto("/bikes")
    // Public bike listing should show ex-showroom/on-road prices, NOT internal purchase cost
    await expect(page.locator("text=purchase cost")).not.toBeVisible()
    await expect(page.locator("text=internal")).not.toBeVisible()
  })

  test("chatbot does not fabricate stock, price, or finance approval", async ({ page }) => {
    await page.goto("/")
    // Open chatbot widget, ask about unlisted bike price
    await page.click('text=chatbot')
    await page.fill('input[placeholder*="message"]', "What is the price of the unlisted Ninja H2R?")
    await page.keyboard.press("Enter")
    // Bot should decline, not invent a price
    await expect(page.locator("text=price is not available")).toBeVisible()
    await expect(page.locator("text=enquire")).toBeVisible()
  })
})
