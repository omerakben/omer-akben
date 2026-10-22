import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { recordSkillsContrast } from "@/test-utils/playwright-contrast";

const modes = ["-3", "-2", "-1", "0", "+1", "+2", "+3", "auto"];
test.use({ timezoneId: "UTC", colorScheme: "light" });

test.describe("Skills contrast", () => {
  for (const mode of modes) {
    test(`readable in brightness mode ${mode}`, async ({ page }) => {
      await page.clock.setFixedTime(new Date("2026-10-22T18:00:00Z"));
      await recordSkillsContrast(page);
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
      await expect.poll(() => page.evaluate(() => window.skillsContrastFrames.frames)).toBeGreaterThanOrEqual(30);
      expect(await page.evaluate(() => window.skillsContrastFrames.failures)).toEqual([]);
    });
  }

  test("keeps contrast during manual switches and automatic OS changes", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-22T18:00:00Z"));
    await recordSkillsContrast(page);
    await page.addInitScript(() => localStorage.setItem("brightness-mode", "auto"));
    await page.goto("/skills", { waitUntil: "networkidle" });
    for (const [colorScheme, hour, expectedMode] of [
      ["dark", "23", "-1"], ["light", "09", "+2"],
      ["dark", "09", "0"], ["light", "18", "+1"],
    ] as const) {
      await page.clock.setFixedTime(new Date(`2026-10-22T${hour}:00:00Z`));
      await page.emulateMedia({ colorScheme });
      await expect(page.locator("html")).toHaveAttribute("data-brightness", expectedMode);
      const start = await page.evaluate(() => window.skillsContrastFrames.frames);
      await expect.poll(() => page.evaluate(() => window.skillsContrastFrames.frames)).toBeGreaterThan(start + 15);
    }
    const slider = page.getByRole("slider", { name: "Brightness control slider" });
    await slider.press("ArrowRight");
    await expect(page.locator("html")).toHaveAttribute("data-brightness", "0");
    await slider.press("Home");
    await expect(page.locator("html")).toHaveAttribute("data-brightness", "-3");
    for (const [key, sequence] of [
      ["ArrowRight", modes.slice(1, 7)],
      ["ArrowLeft", modes.slice(0, 6).reverse()],
    ] as const) {
      for (const expectedMode of sequence) {
        await slider.press(key);
        await expect(page.locator("html")).toHaveAttribute("data-brightness", expectedMode);
        const start = await page.evaluate(() => window.skillsContrastFrames.frames);
        await expect.poll(() => page.evaluate(() => window.skillsContrastFrames.frames)).toBeGreaterThan(start + 15);
      }
    }
    expect(await page.evaluate(() => window.skillsContrastFrames.failures)).toEqual([]);
  });
});
