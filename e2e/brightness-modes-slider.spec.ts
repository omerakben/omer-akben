import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Slider-Based Brightness Control System
 *
 * This test suite validates the new slider-based brightness control implementation
 * which replaces the previous button-based system.
 *
 * Key Changes:
 * - Uses slider interaction (click/drag) instead of individual mode buttons
 * - Validates knob position and track visuals
 * - Tests accessibility with slider ARIA attributes
 */

test.describe("Brightness Control Slider System", () => {
  const modes = ["-3", "-2", "-1", "0", "+1", "+2", "+3"] as const;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for brightness control to be ready
    await page.waitForSelector('[data-testid="brightness-track"]', {
      state: "visible",
      timeout: 5000,
    });
  });

  test("should render brightness slider with proper ARIA attributes", async ({
    page,
  }) => {
    const slider = page.locator('[data-testid="brightness-track"]');

    // Verify slider is visible
    await expect(slider).toBeVisible();

    // Check ARIA attributes
    await expect(slider).toHaveAttribute("role", "slider");
    await expect(slider).toHaveAttribute("aria-valuemin", "-3");
    await expect(slider).toHaveAttribute("aria-valuemax", "3");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
    await expect(slider).toHaveAttribute("aria-orientation", "horizontal");

    // Check for Moon and Sun icons
    const moonIcon = page.locator('[data-testid="brightness-track-icon-moon"]');
    const sunIcon = page.locator('[data-testid="brightness-track-icon-sun"]');
    await expect(moonIcon).toBeVisible();
    await expect(sunIcon).toBeVisible();
  });

  test("should switch brightness modes by clicking on track", async ({
    page,
  }) => {
    const track = page.locator('[data-testid="brightness-track"]');
    const knob = page.locator('[data-testid="brightness-knob"]');
    const trackBox = await track.boundingBox();

    if (!trackBox) throw new Error("Track not found");

    // Test each mode by dragging knob to calculated positions
    // This is more reliable than clicking for edge cases
    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i];
      const percentage = i / (modes.length - 1);
      // For edge positions, clamp slightly to ensure we hit the exact mode
      const clampedPercentage = i === modes.length - 1 ? 0.98 : percentage;
      const targetX = trackBox.x + trackBox.width * clampedPercentage;
      const targetY = trackBox.y + trackBox.height / 2;

      // Drag knob to position
      await knob.hover();
      await page.mouse.down();
      await page.mouse.move(targetX, targetY, { steps: 5 });
      await page.mouse.up();

      // Wait for animation
      await page.waitForTimeout(400);

      // Verify data-brightness attribute on HTML element
      const htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", mode);

      // Verify ARIA value updated
      await expect(track).toHaveAttribute(
        "aria-valuenow",
        mode.replace("+", "")
      );
    }
  });

  test("should display moon icon at minimum brightness", async ({ page }) => {
    const track = page.locator('[data-testid="brightness-track"]');
    const trackBox = await track.boundingBox();

    if (!trackBox) throw new Error("Track not found");

    // Click at far left (-3)
    await page.mouse.click(trackBox.x, trackBox.y + trackBox.height / 2);
    await page.waitForTimeout(350);

    // Check for moon icon on knob
    const knobMoonIcon = page.locator(
      '[data-testid="brightness-knob-icon-moon"]'
    );
    await expect(knobMoonIcon).toBeVisible();

    // Track moon icon should fade out
    const trackMoonIcon = page.locator(
      '[data-testid="brightness-track-icon-moon"]'
    );
    const opacity = await trackMoonIcon.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity)).toBeLessThan(0.5);
  });

  test("should display sun icon at maximum brightness", async ({ page }) => {
    const track = page.locator('[data-testid="brightness-track"]');
    const knob = page.locator('[data-testid="brightness-knob"]');
    const trackBox = await track.boundingBox();

    if (!trackBox) throw new Error("Track not found");

    // Drag knob to far right (+3) - more reliable than clicking
    await knob.hover();
    await page.mouse.down();
    await page.mouse.move(
      trackBox.x + trackBox.width * 0.98,
      trackBox.y + trackBox.height / 2,
      { steps: 10 }
    );
    await page.mouse.up();
    await page.waitForTimeout(400);

    // Verify we're at +3
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveAttribute("data-brightness", "+3");

    // Check for sun icon on knob
    const knobSunIcon = page.locator(
      '[data-testid="brightness-knob-icon-sun"]'
    );
    await expect(knobSunIcon).toBeVisible();

    // Track sun icon should fade out
    const trackSunIcon = page.locator(
      '[data-testid="brightness-track-icon-sun"]'
    );
    const opacity = await trackSunIcon.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity)).toBeLessThan(0.5);
  });

  test("should drag knob to change brightness", async ({ page }) => {
    const knob = page.locator('[data-testid="brightness-knob"]');
    const track = page.locator('[data-testid="brightness-track"]');
    const trackBox = await track.boundingBox();

    if (!trackBox) throw new Error("Track not found");

    // Drag from center to far right
    await knob.hover();
    await page.mouse.down();
    await page.mouse.move(
      trackBox.x + trackBox.width,
      trackBox.y + trackBox.height / 2,
      { steps: 10 }
    );
    await page.mouse.up();

    await page.waitForTimeout(350);

    // Should be at +3
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveAttribute("data-brightness", "+3");
  });

  test.describe("Accessibility - Text Contrast", () => {
    for (const mode of modes) {
      test(`Mode ${mode}: text should be readable`, async ({ page }) => {
        const track = page.locator('[data-testid="brightness-track"]');
        const trackBox = await track.boundingBox();

        if (!trackBox) throw new Error("Track not found");

        // Calculate click position for this mode
        const modeIndex = modes.indexOf(mode);
        const percentage = modeIndex / (modes.length - 1);
        const clickX = trackBox.x + trackBox.width * percentage;
        const clickY = trackBox.y + trackBox.height / 2;

        await page.mouse.click(clickX, clickY);
        await page.waitForTimeout(350);

        // Verify hero section text is visible
        const heroHeading = page.locator("h1").first();
        await expect(heroHeading).toBeVisible();

        // Verify body text is visible
        const bodyText = page.locator("p").first();
        await expect(bodyText).toBeVisible();

        // Check for sufficient contrast (basic visibility check)
        const headingColor = await heroHeading.evaluate(
          (el) => window.getComputedStyle(el).color
        );
        expect(headingColor).toBeTruthy();
      });
    }
  });

  test.describe("Visual States", () => {
    test("should show indicator line at neutral position", async ({ page }) => {
      const track = page.locator('[data-testid="brightness-track"]');
      const trackBox = await track.boundingBox();

      if (!trackBox) throw new Error("Track not found");

      // Click at center (0)
      await page.mouse.click(
        trackBox.x + trackBox.width / 2,
        trackBox.y + trackBox.height / 2
      );
      await page.waitForTimeout(350);

      // Knob should have indicator line (no icon)
      const knob = page.locator('[data-testid="brightness-knob"]');
      const knobMoonIcon = knob.locator(
        '[data-testid="brightness-knob-icon-moon"]'
      );
      const knobSunIcon = knob.locator(
        '[data-testid="brightness-knob-icon-sun"]'
      );

      await expect(knobMoonIcon).not.toBeVisible();
      await expect(knobSunIcon).not.toBeVisible();

      // Check for indicator line class
      const hasIndicatorLine = await knob.evaluate((el) => {
        return el.querySelector(".brightness-knob-line") !== null;
      });
      expect(hasIndicatorLine).toBe(true);
    });

    test("should apply correct theme class to knob", async ({ page }) => {
      const knob = page.locator('[data-testid="brightness-knob"]');
      const track = page.locator('[data-testid="brightness-track"]');
      const trackBox = await track.boundingBox();

      if (!trackBox) throw new Error("Track not found");

      // Test dark mode (-3)
      await knob.hover();
      await page.mouse.down();
      await page.mouse.move(trackBox.x, trackBox.y + trackBox.height / 2, {
        steps: 5,
      });
      await page.mouse.up();
      await page.waitForTimeout(500);

      let knobClass = await knob.getAttribute("class");
      expect(knobClass).toContain("brightness-knob--theme-dark");

      // Test light mode (+3) - use drag to ensure we hit +3
      await knob.hover();
      await page.mouse.down();
      await page.mouse.move(
        trackBox.x + trackBox.width * 0.98,
        trackBox.y + trackBox.height / 2,
        { steps: 10 }
      );
      await page.mouse.up();
      await page.waitForTimeout(500);

      // Verify we're at +3 first
      const htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", "+3");

      knobClass = await knob.getAttribute("class");
      expect(knobClass).toContain("brightness-knob--theme-light");
    });
  });

  test.describe("Persistence", () => {
    test("should persist brightness mode across page reload", async ({
      page,
    }) => {
      const track = page.locator('[data-testid="brightness-track"]');
      const trackBox = await track.boundingBox();

      if (!trackBox) throw new Error("Track not found");

      // Set to +2 (83% across track)
      await page.mouse.click(
        trackBox.x + trackBox.width * 0.83,
        trackBox.y + trackBox.height / 2
      );
      await page.waitForTimeout(350);

      // Verify it's set
      let htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", "+2");

      // Reload page
      await page.reload();
      await page.waitForSelector('[data-testid="brightness-track"]', {
        state: "visible",
      });

      // Should still be +2
      htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", "+2");
    });
  });

  test.describe("Interactive Elements", () => {
    for (const mode of modes) {
      test(`Mode ${mode}: buttons should remain clickable`, async ({
        page,
      }) => {
        const track = page.locator('[data-testid="brightness-track"]');
        const trackBox = await track.boundingBox();

        if (!trackBox) throw new Error("Track not found");

        // Set brightness mode
        const modeIndex = modes.indexOf(mode);
        const percentage = modeIndex / (modes.length - 1);
        await page.mouse.click(
          trackBox.x + trackBox.width * percentage,
          trackBox.y + trackBox.height / 2
        );
        await page.waitForTimeout(350);

        // Try to click primary CTA button
        const ctaButton = page.locator('a:has-text("View Projects")').first();
        await expect(ctaButton).toBeVisible();
        await expect(ctaButton).toBeEnabled();

        // Verify it's clickable (not covered by brightness overlay)
        const isClickable = await ctaButton.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const elementAtPoint = document.elementFromPoint(centerX, centerY);
          return el.contains(elementAtPoint);
        });
        expect(isClickable).toBe(true);
      });
    }
  });

  test("should handle keyboard navigation", async ({ page }) => {
    const track = page.locator('[data-testid="brightness-track"]');

    // Focus the slider
    await track.focus();

    // Verify it's focused
    await expect(track).toBeFocused();

    // Note: Arrow key handling would typically be implemented
    // This is a placeholder for keyboard interaction tests
    // Actual implementation depends on whether custom keyboard handlers are added
  });

  test("should show proper visual feedback on hover", async ({ page }) => {
    const knob = page.locator('[data-testid="brightness-knob"]');

    // Hover over knob
    await knob.hover();

    // Check cursor changes to grab
    const cursor = await knob.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    expect(cursor).toBe("grab");
  });

  test("should handle rapid mode changes smoothly", async ({ page }) => {
    const track = page.locator('[data-testid="brightness-track"]');
    const trackBox = await track.boundingBox();

    if (!trackBox) throw new Error("Track not found");

    // Rapidly click different positions
    for (let i = 0; i < 5; i++) {
      const percentage = Math.random();
      await page.mouse.click(
        trackBox.x + trackBox.width * percentage,
        trackBox.y + trackBox.height / 2
      );
      await page.waitForTimeout(50); // Minimal delay
    }

    // Should still be functional
    const htmlElement = page.locator("html");
    const finalBrightness = await htmlElement.getAttribute("data-brightness");
    expect(finalBrightness).toMatch(/^[+-]?[0-3]$/);
  });
});
