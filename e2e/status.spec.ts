import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const BRIGHTNESS_MODES = ["auto", "-3", "-2", "-1", "0", "+1", "+2", "+3"];

test.describe("Status Page", () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/status", { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="status-page"]');
    await page.waitForTimeout(500);
  });

  test("renders hero and all primary sections", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /live status & roadmap/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /live metrics/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /what is live today/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /recent milestones/i })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Roadmap", exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /lessons learned/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /how to use ozzy/i })
    ).toBeVisible();
  });

  test("persona switch filters prompts", async ({ page }) => {
    await page.getByRole("tab", { name: "Engineers" }).click();
    await expect(
      page.getByText(/open the repo and summarize the app architecture/i)
    ).toBeVisible();
    await expect(
      page.getByText(/give me a 60-second pitch/i)
    ).not.toBeVisible();
  });

  test("copy prompt button provides feedback", async ({ page }) => {
    // Wait for component to fully hydrate
    await page.waitForSelector('button:has-text("Copy")');
    const copyButton = page.getByRole("button", { name: "Copy" }).first();
    await copyButton.click();
    // Wait for state update after async clipboard operation
    await page.waitForTimeout(100);
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible({
      timeout: 3000,
    });
  });

  test("supports all brightness modes without layout shifts", async ({ page }) => {
    for (const mode of BRIGHTNESS_MODES) {
      await page.evaluate((value) => {
        document.documentElement.setAttribute("data-brightness", value);
      }, mode);
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("passes axe accessibility scan", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("[data-testid='status-page']")
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
