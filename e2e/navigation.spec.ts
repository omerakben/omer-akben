import { expect, test } from "@playwright/test";

test.skip("navigate core routes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();

  await page
    .getByRole("link", { name: /projects/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects/);

  const firstCard = page.locator("a[href^='/projects/']").first();
  if (await firstCard.count()) {
    await firstCard.click();
    await expect(page.locator("main h1")).toBeVisible();
  }

  await page
    .getByRole("link", { name: /recruiter/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/recruiter/);

  await page
    .getByRole("link", { name: /contact/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact/);
});
