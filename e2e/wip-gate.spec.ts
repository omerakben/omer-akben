import { expect, test } from "@playwright/test";

test.describe("Public site chrome", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test("first-time homepage visitor does not see a development banner or welcome modal", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const modal = page
      .locator('[role="dialog"]')
      .filter({ hasText: /Welcome! Site Under Active Development/i });
    await expect(modal).toHaveCount(0);

    const banner = page
      .locator('aside[aria-label="Site status banner"]')
      .filter({ hasText: /Site under active development/i });
    await expect(banner).toHaveCount(0);

    await expect(
      page.getByRole("link", { name: /view status/i })
    ).toHaveCount(0);
  });

  test("status page remains available without WIP homepage chrome", async ({
    page,
  }) => {
    await page.goto("/status", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await expect(page).toHaveURL("/status");
    await expect(page.locator("h1")).toContainText(/Live Status & Roadmap/i);
    await expect(
      page.getByRole("heading", { name: /why you saw a banner/i })
    ).toHaveCount(0);
  });
});
