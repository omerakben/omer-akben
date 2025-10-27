import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/projects",
  "/skills",
  "/journey",
  "/credentials",
  "/contact",
  "/recruiter",
  "/chat",
];

test.describe("A11y", () => {
  for (const route of routes) {
    test(`axe: ${route}`, async ({ page }) => {
      await page.goto(`http://localhost:3000${route}`, {
        waitUntil: "networkidle",
      });

      // Wait for client-side hydration to complete
      // Check that loading spinner is gone (present on all pages during SSR)
      await page.waitForSelector(".animate-spin", {
        state: "detached",
        timeout: 10000,
      });

      // Additional wait for DOM to stabilize after hydration
      await page.waitForTimeout(500);

      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations,
        JSON.stringify(results.violations, null, 2)
      ).toEqual([]);
    });
  }
});
