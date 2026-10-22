import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const modes = ["-3", "-2", "-1", "0", "+1", "+2", "+3", "auto"];

test.describe("Skills contrast", () => {
  for (const mode of modes) {
    test(`readable in brightness mode ${mode}`, async ({ page }) => {
      await page.addInitScript((brightness) => {
        localStorage.setItem("brightness-mode", brightness);
      }, mode);
      await page.goto("http://localhost:3001/skills", {
        waitUntil: "networkidle",
      });
      await expect(
        page.getByRole("heading", { name: "Skills & Expertise" })
      ).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute(
        "data-brightness",
        mode === "auto" ? /^(?:-1|0|\+1|\+2)$/ : mode
      );

      const results = await new AxeBuilder({ page })
        .include("main")
        .withRules(["color-contrast"])
        .analyze();
      expect(
        results.violations,
        JSON.stringify(results.violations, null, 2)
      ).toEqual([]);
    });
  }
});
