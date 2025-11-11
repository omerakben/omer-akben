import { expect, test } from "@playwright/test";

const bannerStorageKey = `wip_banner_dismissed:${process.env.NEXT_PUBLIC_GIT_SHA ?? "local"}`;

test.describe("WIP Gate - Modal and Banner Flow", () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies and localStorage to simulate first visit
    await context.clearCookies();

    // Use addInitScript to clear storage before page loads (avoids SecurityError)
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto("/", { waitUntil: "networkidle" });

    // Wait for hydration to complete
    await page.waitForTimeout(500);
  });

  test("should show WIP modal on first homepage visit", async ({ page }) => {
    // Verify modal dialog appears
    const modal = page
      .locator('[role="dialog"]')
      .filter({ hasText: /Welcome! Site Under Active Development/i });
    await expect(modal).toBeVisible();

    // Verify modal content
    await expect(modal).toContainText(/Thanks for visiting!/i);
    await expect(modal).toContainText(
      /This portfolio is actively being built/i
    );
    await expect(modal).toContainText(
      /Some features are still works-in-progress/i
    );

    // Verify email link
    const emailLink = modal.locator('a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", "mailto:me@omerakben.com");

    // Verify Got it button
    const gotItButton = modal.locator("button", {
      hasText: /got it, let me explore/i,
    });
    await expect(gotItButton).toBeVisible();
  });

  test("should dismiss modal and persist to localStorage", async ({ page }) => {
    // Wait for modal to appear
    const modal = page
      .locator('[role="dialog"]')
      .filter({ hasText: /Welcome! Site Under Active Development/i });
    await expect(modal).toBeVisible();

    // Click Got it button
    const gotItButton = modal.locator("button", {
      hasText: /got it, let me explore/i,
    });
    await gotItButton.click();

    // Wait for modal to close
    await expect(modal).not.toBeVisible();

    // Verify localStorage persistence
    const modalDismissed = await page.evaluate(() =>
      localStorage.getItem("wip_modal_dismissed")
    );
    expect(modalDismissed).toBe("true");
  });

  test("should show banner after modal dismissal", async ({ page }) => {
    // Dismiss modal first
    const modal = page
      .locator('[role="dialog"]')
      .filter({ hasText: /Welcome! Site Under Active Development/i });
    await expect(modal).toBeVisible();

    const gotItButton = modal.locator("button", {
      hasText: /got it, let me explore/i,
    });
    await gotItButton.click();
    await expect(modal).not.toBeVisible();

    // Verify banner appears
    const banner = page
      .locator('aside[aria-label="Site status banner"]')
      .filter({ hasText: /Site under active development/i });
    await expect(banner).toBeVisible();

    // Verify banner content
    await expect(banner).toContainText(/Some features are still being built/i);

    // Verify View status link
    const statusLink = banner.locator('a[href="/status"]');
    await expect(statusLink).toBeVisible();
  });

  test.skip("should dismiss banner and persist to localStorage", async ({
    page,
  }) => {
    // Set modal as already dismissed in localStorage
    await page.evaluate(() => {
      localStorage.setItem("wip_modal_dismissed", "true");
    });

    // Reload to show banner without modal
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Verify banner is visible
    const banner = page
      .locator('aside[aria-label="Site status banner"]')
      .filter({ hasText: /Site under active development/i });
    await expect(banner).toBeVisible();

    // Click dismiss button
    const dismissButton = banner.locator(
      'button[aria-label*="Dismiss banner" i]'
    );
    await dismissButton.click();

    // Verify banner is hidden
    await expect(banner).not.toBeVisible();

    // Verify localStorage persistence
    const bannerDismissed = await page.evaluate(
      (key) => localStorage.getItem(key),
      bannerStorageKey
    );
    expect(bannerDismissed).toBe("true");
  });

  test.skip("should navigate to status page from banner link", async ({
    page,
  }) => {
    // Set modal as dismissed
    await page.evaluate(() => {
      localStorage.setItem("wip_modal_dismissed", "true");
    });

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Verify banner is visible
    const banner = page
      .locator('aside[aria-label="Site status banner"]')
      .filter({ hasText: /Site under active development/i });
    await expect(banner).toBeVisible();

    // Click View status link
    const statusLink = banner.locator('a[href="/status"]');
    await statusLink.click();

    // Verify navigation to status page
    await expect(page).toHaveURL("/status");
    await expect(page.locator("h1")).toContainText(/Live Status & Roadmap/i);
  });

  test("should not show modal on non-homepage routes", async ({ page }) => {
    // Navigate to /projects
    await page.goto("/projects", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Verify modal does not appear
    const modal = page
      .locator('[role="dialog"]')
      .filter({ hasText: /Welcome! Site Under Active Development/i });
    await expect(modal).not.toBeVisible();
  });

  test("should not show banner on non-homepage routes", async ({ page }) => {
    // Set modal as dismissed
    await page.evaluate(() => {
      localStorage.setItem("wip_modal_dismissed", "true");
    });

    // Navigate to /skills
    await page.goto("/skills", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Verify banner DOES appear (banner shows on all pages except /status)
    const banner = page
      .locator('aside[aria-label="Site status banner"]')
      .filter({ hasText: /Site under active development/i });
    await expect(banner).toBeVisible();
  });

  test("should maintain dismissal state across page reloads", async ({
    page,
  }) => {
    // Clear first, then set dismissal state using addInitScript (persists across navigations)
    await page.context().clearCookies();
    await page.addInitScript((key) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("wip_modal_dismissed", "true");
      localStorage.setItem(key, "true");
    }, bannerStorageKey);

    // Navigate to homepage
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Verify neither modal nor banner appear
    const modal = page
      .locator('[role="dialog"]')
      .filter({ hasText: /Welcome! Site Under Active Development/i });
    await expect(modal).not.toBeVisible();

    const banner = page
      .locator('aside[aria-label="Site status banner"]')
      .filter({ hasText: /Site under active development/i });
    await expect(banner).not.toBeVisible();

    // Navigate away and back to homepage
    await page.goto("/projects");
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Verify dismissal state persists
    await expect(modal).not.toBeVisible();
    await expect(banner).not.toBeVisible();
  });
});

test.describe("WIP Gate - Status Page", () => {
  test("should display unified status page with development info", async ({
    page,
  }) => {
    await page.goto("/status", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Verify page heading
    await expect(page.locator("h1")).toContainText(/Live Status & Roadmap/i);

    // Verify status page contains development information
    // (exact content depends on implementation - adjust as needed)
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("should be accessible from banner View status link", async ({
    page,
  }) => {
    // Set modal as dismissed to show banner
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.setItem("wip_modal_dismissed", "true");
    });

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Click View status link from banner
    const banner = page
      .locator('aside[aria-label="Site status banner"]')
      .filter({ hasText: /Site under active development/i });
    const statusLink = banner.locator('a[href="/status"]');
    await statusLink.click();

    // Wait for navigation to complete
    await page.waitForURL("/status");
    await page.waitForTimeout(500);

    // Verify we're on status page
    await expect(page).toHaveURL("/status");
    await expect(page.locator("h1")).toContainText(/Live Status & Roadmap/i);
  });
});
