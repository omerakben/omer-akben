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
      await page.goto(`http://localhost:3000${route}`);
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations,
        JSON.stringify(results.violations, null, 2)
      ).toEqual([]);
    });
  }
});
