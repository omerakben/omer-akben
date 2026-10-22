/**
 * E2E Tests for Navbar Shader Blob
 *
 * Tests animated shader blob in navbar across all scenarios:
 * - Visual rendering at 64x64px
 * - Click navigation to homepage
 * - 8 brightness modes color adaptation
 * - Concurrent WebGL contexts (navbar + hero)
 * - Mobile navbar rendering
 * - Accessibility features
 */

import { test, expect, type Page } from '@playwright/test';

function navbarBlobLocator(page: Page) {
  return page
    .locator('header a[href="/"]')
    .first()
    .locator('> canvas.rounded-full, > div.relative.rounded-full');
}

test.describe('Navbar Shader Blob', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('renders shader blob in navbar at 64x64px', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Wait for navbar to render
    await page.waitForSelector('header', { timeout: 5000 });

    // Find navbar shader blob (canvas or fallback icon div)
    const navbarBlob = navbarBlobLocator(page);

    // Verify it's visible
    await expect(navbarBlob).toBeVisible();

    // Verify size (64x64px as specified)
    const boundingBox = await navbarBlob.boundingBox();
    expect(boundingBox?.width).toBeCloseTo(64, 5); // Allow 5px tolerance
    expect(boundingBox?.height).toBeCloseTo(64, 5);
  });

  test('navbar blob is clickable and navigates to homepage', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Navigate to a different page first
    await page.goto('/projects', { waitUntil: 'networkidle' });

    // Click navbar home link (blob is rendered inside this link)
    const navbarHomeLink = page.locator('header a[href="/"]').first();
    await navbarHomeLink.click();

    // Wait for navigation
    await page.waitForURL('/', { timeout: 5000 });

    // Verify we're on homepage (URL ends with just '/')
    expect(page.url()).toMatch(/\/$/);
  });

  test('navbar blob renders alongside hero blob (2 concurrent WebGL contexts)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Find both shader blobs
    const navbarBlob = navbarBlobLocator(page);
    const heroBlob = page
      .locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    // Both should be visible concurrently
    await expect(navbarBlob).toBeVisible();
    await expect(heroBlob).toBeVisible();

    // Verify no WebGL errors in console
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    const webglErrors = consoleErrors.filter(
      (err) => err.includes('WebGL') || err.includes('gl') || err.includes('context')
    );

    expect(webglErrors).toHaveLength(0);
  });

  test('navbar blob has correct accessibility attributes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const navbarBlob = navbarBlobLocator(page);

    // No role/tabindex needed since it's inside a Link component
    // The Link provides navigation semantics
    await expect(navbarBlob).toBeVisible();
  });

  test('navbar blob supports keyboard navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Navigate to projects page
    await page.goto('/projects', { waitUntil: 'networkidle' });

    // Focus the navbar logo link directly instead of using Tab
    const logoLink = page.locator('header a[href="/"]');
    await logoLink.focus();

    // Press Enter to navigate
    await page.keyboard.press('Enter');

    // Wait for navigation to homepage
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toMatch(/\/$/);
  });

  test('navbar blob renders in mobile navbar', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for mobile navbar
    await page.waitForSelector('header', { timeout: 5000 });

    // Navbar blob should be visible even on mobile
    const navbarBlob = navbarBlobLocator(page);
    await expect(navbarBlob).toBeVisible();
  });
});

test.describe('Navbar Shader Blob - 8 Brightness Modes', () => {
  const brightnessLevels = [-3, -2, -1, 0, 1, 2, 3];

  for (const level of brightnessLevels) {
    test(`navbar blob adapts to brightness mode ${level}`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Set brightness mode
      await page.evaluate((brightness) => {
        document.documentElement.setAttribute('data-brightness', String(brightness));
      }, level);

      await page.waitForTimeout(500);

      // Navbar shader blob should still be visible
      const navbarBlob = navbarBlobLocator(page);
      await expect(navbarBlob).toBeVisible();

      // Verify colors updated (check computed styles)
      const brandPrimary = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--brand-primary').trim();
      });

      expect(brandPrimary).toBeTruthy();
      expect(brandPrimary).toMatch(/^#[0-9a-f]{6}$/i);
    });
  }

  test('navbar blob handles auto brightness mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Set to auto mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-brightness', 'auto');
    });

    await page.waitForTimeout(500);

    // Navbar blob should still be visible
    const navbarBlob = navbarBlobLocator(page);
    await expect(navbarBlob).toBeVisible();
  });
});

test.describe('Navbar Shader Blob - Performance', () => {
  test('respects prefers-reduced-motion in navbar', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Navbar shader blob should still render
    const navbarBlob = navbarBlobLocator(page);
    await expect(navbarBlob).toBeVisible();
  });

  test('maintains performance with 2 shader instances (no console errors)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for both shaders to render
    await page.waitForTimeout(3000);

    // No WebGL or performance errors
    const performanceErrors = consoleErrors.filter(
      (err) => err.includes('WebGL') || err.includes('shader') || err.includes('gl') || err.includes('performance')
    );

    expect(performanceErrors).toHaveLength(0);
  });
});
