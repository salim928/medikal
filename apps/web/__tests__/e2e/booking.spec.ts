import { test, expect } from "@playwright/test";

test.describe("Appointment Booking Flow", () => {
  test("should book appointment successfully", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', "patient@test.com");
    await page.fill('input[type="password"]', "testpassword123");
    await page.click("button:has-text('Sign In')");

    // Wait for dashboard
    await page.waitForURL("/dashboard");

    // Navigate to book appointment
    await page.click("text=Book New Appointment");
    await page.waitForURL("/book");

    // Fill booking form
    await page.fill('input[type="datetime-local"]', "2025-12-15T10:00");
    await page.fill(
      'textarea[placeholder*="symptoms"]',
      "I have been experiencing persistent headaches for the past week"
    );
    await page.selectOption('select[name="reasonCategory"]', "acute");

    // Submit
    await page.click("button:has-text('Book Appointment')");

    // Verify success
    await expect(page.locator("text=Appointment booked successfully")).toBeVisible();
  });

  test("should show validation errors", async ({ page }) => {
    await page.goto("/book");

    // Try to submit empty form
    await page.click("button:has-text('Book Appointment')");

    // Verify errors
    await expect(page.locator("text=Please describe")).toBeVisible();
  });

  test("should display AI triage assessment", async ({ page }) => {
    // ... login and booking steps ...

    // Wait for triage assessment
    await page.waitForSelector("text=AI Triage Assessment");
    await expect(page.locator("text=Risk Level")).toBeVisible();
  });
});