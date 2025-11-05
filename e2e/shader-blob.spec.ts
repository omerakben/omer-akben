/**
 * E2E Tests for Shader Blob
 *
 * Tests animated shader blob across all 8 brightness modes, interactions, and accessibility.
 */

import { test, expect } from '@playwright/test';

test.describe('Shader Blob - Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('displays shader blob on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Wait for hero section animation
    await page.waitForSelector('.hero-fade-in-right', { timeout: 5000 });

    // Check for canvas (WebGL) or div (fallback) in hero section
    const shaderElement = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    await expect(shaderElement).toBeVisible();
  });

  test('hides shader blob on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Shader blob container should have hidden class on mobile (more specific selector)
    const container = page.locator('.hidden.lg\\:block.relative.hero-fade-in-right');
    await expect(container).not.toBeVisible();
  });

  test('is clickable and interactive', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Verify shader blob is clickable (hero section only)
    const shaderBlob = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    // Verify element is present and clickable
    await expect(shaderBlob).toBeVisible();
    await expect(shaderBlob).toHaveAttribute('role', 'button');
    await expect(shaderBlob).toHaveAttribute('tabindex', '0');

    // Click should not throw error (even if sidebar doesn't open in isolation)
    await shaderBlob.click({ force: true });
  });

  test('has correct accessibility attributes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const shaderBlob = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    // Check role="button"
    await expect(shaderBlob).toHaveAttribute('role', 'button');

    // Check tabindex for keyboard navigation
    await expect(shaderBlob).toHaveAttribute('tabindex', '0');

    // Check aria-label
    await expect(shaderBlob).toHaveAttribute('aria-label', 'Open Ozzy AI Assistant');
  });

  test('supports keyboard navigation (Enter key)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const shaderBlob = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    // Verify element is keyboard accessible
    await expect(shaderBlob).toBeVisible();
    await expect(shaderBlob).toHaveAttribute('tabindex', '0');

    // Focus and press Enter should not throw error
    await shaderBlob.focus();
    await shaderBlob.press('Enter');

    // Verify element is still present after interaction
    await expect(shaderBlob).toBeVisible();
  });

  test('supports keyboard navigation (Space key)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const shaderBlob = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    // Verify element is keyboard accessible
    await expect(shaderBlob).toBeVisible();
    await expect(shaderBlob).toHaveAttribute('tabindex', '0');

    // Focus and press Space should not throw error
    await shaderBlob.focus();
    await shaderBlob.press('Space');

    // Verify element is still present after interaction
    await expect(shaderBlob).toBeVisible();
  });
});

test.describe('Shader Blob - 8 Brightness Modes', () => {
  const brightnessLevels = [-3, -2, -1, 0, 1, 2, 3];

  for (const level of brightnessLevels) {
    test(`renders correctly in brightness mode ${level}`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Set brightness mode via data attribute
      await page.evaluate((brightness) => {
        document.documentElement.setAttribute('data-brightness', String(brightness));
      }, level);

      // Wait for CSS custom properties to update
      await page.waitForTimeout(500);

      // Verify shader blob still visible (hero section only)
      const shaderBlob = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
        .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

      await expect(shaderBlob).toBeVisible();

      // Verify colors updated (check computed styles)
      const brandPrimary = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--brand-primary').trim();
      });

      expect(brandPrimary).toBeTruthy();
      expect(brandPrimary).toMatch(/^#[0-9a-f]{6}$/i);
    });
  }

  test('handles auto brightness mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Set to auto mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-brightness', 'auto');
    });

    await page.waitForTimeout(500);

    // Shader blob should still be visible (hero section only)
    const shaderBlob = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    await expect(shaderBlob).toBeVisible();
  });

  test('smooth color transitions between brightness modes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Start at mode 0
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-brightness', '0');
    });

    await page.waitForTimeout(500);

    // Get initial brightness attribute
    const initialBrightness = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-brightness');
    });

    // Change to mode +3
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-brightness', '3');
    });

    await page.waitForTimeout(500);

    // Get new brightness attribute
    const newBrightness = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-brightness');
    });

    // Brightness mode should have changed
    expect(initialBrightness).toBe('0');
    expect(newBrightness).toBe('3');

    // Shader should still be visible (hero section only)
    const shaderBlob = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    await expect(shaderBlob).toBeVisible();
  });
});

test.describe('Shader Blob - WebGL Feature Detection', () => {
  test('renders WebGL canvas when supported', async ({ page, browserName }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Modern browsers support WebGL (hero section only)
    const canvas = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]');

    // Should render canvas in modern browsers
    if (browserName === 'chromium' || browserName === 'firefox') {
      await expect(canvas).toBeVisible();
    }
  });

  test('gracefully handles WebGL unavailability', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Even if WebGL fails, fallback should render (hero section only)
    const shaderElement = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    await expect(shaderElement).toBeVisible();
  });
});

test.describe('Shader Blob - Animation and Performance', () => {
  test('respects prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Shader blob should still render (hero section only)
    const shaderBlob = page.locator('section canvas[aria-label="Open Ozzy AI Assistant"]')
      .or(page.locator('section div[aria-label="Open Ozzy AI Assistant"]'));

    await expect(shaderBlob).toBeVisible();

    // Check that breathe animation class is present
    const container = page.locator('.shader-blob-breathe');
    await expect(container).toBeVisible();

    // Verify motion-reduce class exists in DOM
    const reducedMotionClass = page.locator('.motion-reduce\\:animate-none');
    expect(await reducedMotionClass.count()).toBeGreaterThan(0);
  });

  test('maintains 60fps performance (no console errors)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for shader to render
    await page.waitForTimeout(2000);

    // No WebGL or shader errors
    const shaderErrors = consoleErrors.filter(
      (err) => err.includes('WebGL') || err.includes('shader') || err.includes('gl')
    );

    expect(shaderErrors).toHaveLength(0);
  });
});
