import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
});

test("mobile home loads and recruiter CTA visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();

  await page.goto("/recruiter");
  await expect(page.getByRole("button", { name: /download/i })).toBeVisible();
});
