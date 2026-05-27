import { test, expect, type Page } from "@playwright/test";

async function acceptCookies(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("orbitsphere-cookie-consent", "accepted");
  });
}

async function waitForShell(page: Page) {
  await page.waitForSelector("#main-content", { timeout: 30_000 });
}

test.describe("Public site", () => {
  test.beforeEach(async ({ page }) => {
    await acceptCookies(page);
  });

  test("homepage loads with headline and navigation", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForShell(page);
    await expect(page).toHaveTitle(/OrbitSphere/i);
    await expect(page.locator("nav").first()).toBeVisible();
  });

  test("skip link focuses main content", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForShell(page);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /skip to main content/i })).toBeFocused();
  });

  test("legal pages are reachable", async ({ page }) => {
    for (const path of ["/privacy", "/terms", "/cookies", "/corrections"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("navigation", { name: /legal pages/i })).toBeVisible();
    }
  });

  test("article page renders body content", async ({ page }) => {
    await page.goto("/article/nigeria-economic-renaissance", {
      waitUntil: "domcontentloaded",
    });
    await waitForShell(page);
    await expect(page.locator(".article-body").first()).toBeVisible();
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
    await waitForShell(page);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByPlaceholder("Email address")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
  });

  test("citizen submit page loads", async ({ page }) => {
    await page.goto("/submit", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("health endpoint responds", async ({ request }) => {
    const res = await request.get("/api/v1/health");
    expect(res.status()).toBeLessThan(600);
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("checks");
  });
});

test.describe("Footer", () => {
  test.beforeEach(async ({ page }) => {
    await acceptCookies(page);
  });

  test("legal links point to dedicated pages", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForShell(page);
    await page.getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL(/\/privacy$/);
  });
});
