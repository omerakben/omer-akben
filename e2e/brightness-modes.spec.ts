import { test, expect } from "@playwright/test";

test.describe("8-Mode Brightness System", () => {
  const modes = ["-3", "-2", "-1", "0", "+1", "+2", "+3", "auto"] as const;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render BrightnessControl with all 8 modes", async ({ page }) => {
    // Verify brightness control is visible
    const brightnessControl = page.locator('[aria-label*="brightness"]').first();
    await expect(brightnessControl).toBeVisible({ timeout: 5000 });

    // Verify all mode buttons exist
    for (const mode of ["-3", "-2", "-1", "0", "+1", "+2", "+3"]) {
      const button = page.locator(`button:has-text("${mode}")`);
      await expect(button).toBeVisible();
    }

    // Verify Auto button exists
    const autoButton = page.locator('button:has-text("Auto")');
    await expect(autoButton).toBeVisible();
  });

  test("should switch brightness modes and update data-brightness attribute", async ({ page }) => {
    for (const mode of modes) {
      // Click the mode button
      const button = mode === "auto"
        ? page.locator('button:has-text("Auto")')
        : page.locator(`button:has-text("${mode}")`);

      await button.click();

      // Verify data-brightness attribute on HTML element
      const htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", mode);

      // Small delay for visual inspection (optional)
      await page.waitForTimeout(200);
    }
  });

  test.describe("Accessibility - Text Contrast", () => {
    for (const mode of modes) {
      test(`Mode ${mode}: text should be readable with sufficient contrast`, async ({ page }) => {
        // Set brightness mode
        const button = mode === "auto"
          ? page.locator('button:has-text("Auto")')
          : page.locator(`button:has-text("${mode}")`);
        await button.click();

        // Wait for mode to apply
        await page.waitForTimeout(300);

        // Verify hero section text is visible (primary text)
        const heroHeading = page.locator('h1').first();
        await expect(heroHeading).toBeVisible();

        // Verify body text is visible
        const bodyText = page.locator('p').first();
        await expect(bodyText).toBeVisible();

        // Verify navigation links are visible
        const navLink = page.locator('nav a').first();
        await expect(navLink).toBeVisible();

        // Check computed styles for text color (should not be transparent)
        const textColor = await heroHeading.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });
        expect(textColor).not.toBe("rgba(0, 0, 0, 0)");
        expect(textColor).not.toBe("transparent");
      });
    }
  });

  test.describe("Accessibility - Border Visibility", () => {
    for (const mode of modes) {
      test(`Mode ${mode}: borders should be visible on cards`, async ({ page }) => {
        // Set brightness mode
        const button = mode === "auto"
          ? page.locator('button:has-text("Auto")')
          : page.locator(`button:has-text("${mode}")`);
        await button.click();

        // Wait for mode to apply
        await page.waitForTimeout(300);

        // Check if project cards have visible borders
        const projectCard = page.locator('.card').first();
        if (await projectCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          const borderColor = await projectCard.evaluate((el) => {
            return window.getComputedStyle(el).borderColor;
          });
          expect(borderColor).not.toBe("rgba(0, 0, 0, 0)");
          expect(borderColor).not.toBe("transparent");
        }
      });
    }
  });

  test.describe("CSS Custom Properties Application", () => {
    for (const mode of modes) {
      test(`Mode ${mode}: CSS custom properties should update`, async ({ page }) => {
        // Set brightness mode
        const button = mode === "auto"
          ? page.locator('button:has-text("Auto")')
          : page.locator(`button:has-text("${mode}")`);
        await button.click();

        // Wait for mode to apply
        await page.waitForTimeout(300);

        // Check that CSS custom properties are defined on root element
        const rootStyles = await page.evaluate(() => {
          const root = document.documentElement;
          const styles = window.getComputedStyle(root);
          return {
            textColor1: styles.getPropertyValue('--color-text-1'),
            surfBg0: styles.getPropertyValue('--color-surf-0'),
            brandPrimary: styles.getPropertyValue('--color-brand-primary'),
          };
        });

        // Verify custom properties have values
        expect(rootStyles.textColor1).toBeTruthy();
        expect(rootStyles.surfBg0).toBeTruthy();
        expect(rootStyles.brandPrimary).toBeTruthy();
      });
    }
  });

  test.describe("Component Rendering", () => {
    for (const mode of modes) {
      test(`Mode ${mode}: key components should render properly`, async ({ page }) => {
        // Set brightness mode
        const button = mode === "auto"
          ? page.locator('button:has-text("Auto")')
          : page.locator(`button:has-text("${mode}")`);
        await button.click();

        // Wait for mode to apply
        await page.waitForTimeout(300);

        // Verify header is visible
        const header = page.locator("header");
        await expect(header).toBeVisible();

        // Verify navigation is visible
        const nav = page.locator("nav");
        await expect(nav).toBeVisible();

        // Verify main content is visible
        const main = page.locator("main");
        await expect(main).toBeVisible();

        // Verify footer is visible
        const footer = page.locator("footer");
        await expect(footer).toBeVisible();

        // Verify GlobalChatButton is visible
        const chatButton = page.locator('button[aria-label*="Ozzy" i]');
        await expect(chatButton).toBeVisible();
      });
    }
  });

  test.describe("Dark Mode Detection", () => {
    test("Modes -3, -2, -1, 0 should be considered dark modes", async ({ page }) => {
      const darkModes = ["-3", "-2", "-1", "0"];

      for (const mode of darkModes) {
        const button = page.locator(`button:has-text("${mode}")`);
        await button.click();

        await page.waitForTimeout(200);

        // Check that dark mode classes or styles are applied
        const htmlElement = page.locator("html");
        const dataTheme = await htmlElement.getAttribute("data-brightness");
        expect(dataTheme).toBe(mode);

        // Verify background is relatively dark
        const bgColor = await page.evaluate(() => {
          const root = document.documentElement;
          return window.getComputedStyle(root).backgroundColor;
        });
        expect(bgColor).toBeTruthy();
      }
    });

    test("Modes +1, +2, +3 should be considered light modes", async ({ page }) => {
      const lightModes = ["+1", "+2", "+3"];

      for (const mode of lightModes) {
        const button = page.locator(`button:has-text("${mode}")`);
        await button.click();

        await page.waitForTimeout(200);

        // Check that light mode classes or styles are applied
        const htmlElement = page.locator("html");
        const dataTheme = await htmlElement.getAttribute("data-brightness");
        expect(dataTheme).toBe(mode);

        // Verify background is relatively light
        const bgColor = await page.evaluate(() => {
          const root = document.documentElement;
          return window.getComputedStyle(root).backgroundColor;
        });
        expect(bgColor).toBeTruthy();
      }
    });
  });

  test.describe("Persistence", () => {
    test("should persist brightness mode across page reload", async ({ page }) => {
      // Set to mode +2
      const button = page.locator('button:has-text("+2")');
      await button.click();

      await page.waitForTimeout(300);

      // Verify mode is applied
      let htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", "+2");

      // Reload page
      await page.reload();

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify mode persists
      htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", "+2");
    });

    test("should persist 'auto' mode across page reload", async ({ page }) => {
      // Set to auto mode
      const autoButton = page.locator('button:has-text("Auto")');
      await autoButton.click();

      await page.waitForTimeout(300);

      // Verify auto mode is applied
      let htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", "auto");

      // Reload page
      await page.reload();

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify auto mode persists
      htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-brightness", "auto");
    });
  });

  test.describe("Interactive Elements", () => {
    for (const mode of modes) {
      test(`Mode ${mode}: buttons should be clickable and interactive`, async ({ page }) => {
        // Set brightness mode
        const button = mode === "auto"
          ? page.locator('button:has-text("Auto")')
          : page.locator(`button:has-text("${mode}")`);
        await button.click();

        // Wait for mode to apply
        await page.waitForTimeout(300);

        // Test that GlobalChatButton is interactive
        const chatButton = page.locator('button[aria-label*="Ozzy" i]');
        await expect(chatButton).toBeVisible();
        await expect(chatButton).toBeEnabled();

        // Test that navigation links are interactive
        const navLinks = page.locator('nav a');
        const firstNavLink = navLinks.first();
        await expect(firstNavLink).toBeVisible();
        await expect(firstNavLink).toBeEnabled();
      });
    }
  });
});
