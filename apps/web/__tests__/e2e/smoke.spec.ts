import { test, expect, type Page } from "@playwright/test";

/**
 * Route smoke suite — every page renders with a key heading and no error
 * boundary, as both demo roles, plus the end-to-end booking flow.
 */

const demoCookie = (role: string) => ({
  name: "mc-demo",
  value: role,
  domain: "localhost",
  path: "/",
});

async function assertHealthy(page: Page, path: string, marker: string | RegExp) {
  await page.goto(path);
  await expect(page.getByText(marker).first()).toBeVisible({ timeout: 20000 });
  await expect(page.getByText("Something Went Wrong")).toHaveCount(0);
  await expect(page.getByText("Application error")).toHaveCount(0);
}

test.describe("public pages", () => {
  test("landing renders", async ({ page }) => {
    await assertHealthy(page, "/", /Healthcare/);
  });
  test("login renders", async ({ page }) => {
    await assertHealthy(page, "/login", /medicom|Sign in|Welcome/i);
  });
  test("help / privacy / terms render", async ({ page }) => {
    await assertHealthy(page, "/help", /Help|FAQ|support/i);
    await assertHealthy(page, "/privacy", /Privacy/i);
    await assertHealthy(page, "/terms", /Terms/i);
  });

  const marketingRoutes: [string, string | RegExp][] = [
    ["/about", /Healthcare that meets you/i],
    ["/careers", /Open roles/i],
    ["/press", /medicom in the news/i],
    ["/contact", /We're here to help/i],
    ["/blog", /News from medicom/i],
    ["/articles", /Health guidance/i],
    ["/services", /Care for every stage of life/i],
    ["/services/urgent-care", /Urgent Care/],
    ["/services/mental-health", /Mental Health/],
    ["/services/primary-care", /Primary Care/],
    ["/services/pediatrics", /Pediatrics/],
    ["/services/chronic-care", /Chronic Care/],
    ["/faq", /Frequently asked questions/i],
    ["/insurance", /health cover/i],
    ["/patient-guide", /step by step/i],
    ["/business/employers", /Employer Solutions/],
    ["/business/health-plans", /Health Plans/],
    ["/business/partners", /Partner With Us/],
  ];
  for (const [path, marker] of marketingRoutes) {
    test(`marketing page ${path} renders`, async ({ page }) => {
      await assertHealthy(page, path, marker);
    });
  }

  test("unknown service slug shows not-found page", async ({ page }) => {
    await page.goto("/services/nope");
    await expect(page.getByText(/404|not found|doesn't exist/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("contact form submits with toast", async ({ page }) => {
    await page.goto("/contact");
    await page.fill("#name", "Test Person");
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "Hello from the smoke suite");
    await page.click('button:has-text("Send message")');
    await expect(page.getByText(/Message sent/).first()).toBeVisible();
  });

  test("footer links resolve from landing", async ({ page }) => {
    await page.goto("/");
    await page.locator('footer a:has-text("About Us")').click();
    await page.waitForURL("**/about");
    await expect(page.getByText(/Healthcare that meets you/i).first()).toBeVisible();
  });
});

test.describe("patient routes", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ context }) => {
    await context.addCookies([demoCookie("patient")]);
  });

  const routes: [string, string | RegExp][] = [
    ["/dashboard/patient", /Good (morning|afternoon|evening)/],
    ["/appointments", /My appointments/i],
    ["/appointments/book", /Book a visit/i],
    ["/providers", /healthcare provider/i],
    ["/providers/1", /Dr\. Sarah Johnson/],
    ["/prescriptions", /My prescriptions/i],
    ["/prescriptions/1", /Amoxicillin/],
    ["/records", /medical records/i],
    ["/records/1", /Blood Test Results/],
    ["/pharmacies", /Licensed Pharmacies/i],
    ["/verify-drug", /Drug Authentication/i],
    ["/symptom-checker", /symptom/i],
    ["/notifications", /Notifications/],
    ["/subscriptions", /Health Plan/i],
    ["/payment-history", /Payment History/i],
    ["/settings/profile", /Profile/i],
    ["/settings/security", /Security|Password/i],
  ];

  for (const [path, marker] of routes) {
    test(`renders ${path}`, async ({ page }) => {
      await assertHealthy(page, path, marker);
    });
  }

  test("not-found states for bad ids", async ({ page }) => {
    await assertHealthy(page, "/providers/999", /Provider not found/);
    await assertHealthy(page, "/prescriptions/999", /Prescription not found/);
    await assertHealthy(page, "/records/999", /Record not found/);
    await assertHealthy(page, "/appointments/zzz", /Appointment not found/);
  });

  test("book → appears in list → cancel flow", async ({ page }) => {
    await page.goto("/appointments/book");
    await page.locator("select").selectOption({ index: 1 });
    await page.fill('input[type="date"]', "2026-08-20");
    await page.click('button:has-text("10:00 AM")');
    await page.fill("textarea", "Smoke test booking");
    await page.click('button:has-text("Confirm booking")');
    await page.waitForURL("**/appointments");

    // New booking is visible
    await expect(page.getByText("Aug 20").first()).toBeVisible();

    // Cancel it and verify status flips
    await page.locator('button:has-text("Cancel")').first().click();
    await expect(page.getByText(/cancelled/i).first()).toBeVisible();
  });
});

test.describe("doctor routes", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([demoCookie("doctor")]);
  });

  const routes: [string, string | RegExp][] = [
    ["/dashboard/doctor", /Good (morning|afternoon|evening), Dr\./],
    ["/appointments", /Appointment management/i],
    ["/triage-queue", /AI triage queue/i],
    ["/patients", /Patients/],
    ["/patients/1", /John Parker/],
    ["/prescriptions/write", /Write Prescription/i],
    ["/appointments/availability", /Set Availability/i],
  ];

  for (const [path, marker] of routes) {
    test(`renders ${path}`, async ({ page }) => {
      await assertHealthy(page, path, marker);
    });
  }

  test("triage approve action works", async ({ page }) => {
    await page.goto("/triage-queue");
    await page.locator('button:has-text("Approve recommendation")').first().click();
    await expect(page.getByText(/Review complete/i).first()).toBeVisible();
  });
});

test.describe("interactive feature flows (patient)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([demoCookie("patient")]);
  });

  test("verify-drug authenticates a genuine batch and flags a fake", async ({ page }) => {
    await page.goto("/verify-drug");
    await page.fill('input[placeholder*="FDA-AMX"]', "FDA-AMX-2024-001");
    await page.click('button:has-text("Verify")');
    await expect(page.getByText(/Amoxicillin 500mg/).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Authentic/).first()).toBeVisible();

    await page.fill('input[placeholder*="FDA-AMX"]', "FAKE-123-456");
    await page.click('button:has-text("Verify")');
    await expect(page.getByText(/Counterfeit/).first()).toBeVisible({ timeout: 15000 });
  });

  test("notifications: mark read decrements unread count", async ({ page }) => {
    await page.goto("/notifications");
    await expect(page.getByText(/unread notification/).first()).toBeVisible();
    await page.locator('button:has-text("Mark Read")').first().click();
    await expect(page.getByText(/1 unread notification|All caught up/).first()).toBeVisible();
  });

  test("pharmacy order shows confirmation toast", async ({ page }) => {
    await page.goto("/pharmacies");
    await page.locator('button:has-text("Order Prescription")').first().click();
    await expect(page.getByText(/order sent to/i).first()).toBeVisible();
  });

  test("subscriptions billing toggle updates prices", async ({ page }) => {
    await page.goto("/subscriptions");
    await expect(page.getByText("GH₵ 99").first()).toBeVisible();
    await page.click('button:has-text("Yearly")');
    await expect(page.getByText("GH₵ 999").first()).toBeVisible();
  });

  test("settings profile edit + save shows toast", async ({ page }) => {
    await page.goto("/settings/profile");
    await page.click('button:has-text("Edit Profile")');
    await page.click('button:has-text("Save Changes")');
    await expect(page.getByText("Profile updated").first()).toBeVisible();
  });
});

test.describe("other role dashboards", () => {
  for (const role of ["nurse", "midwife", "lawyer"] as const) {
    test(`renders /dashboard/${role}`, async ({ browser }) => {
      const ctx = await browser.newContext();
      await ctx.addCookies([demoCookie(role)]);
      const page = await ctx.newPage();
      await page.goto(`/dashboard/${role}`);
      await expect(page.getByText(/Good (morning|afternoon|evening)/).first()).toBeVisible({ timeout: 20000 });
      await expect(page.getByText("Something Went Wrong")).toHaveCount(0);
      await ctx.close();
    });
  }
});
