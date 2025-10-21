import { expect, test } from "@playwright/test";

test("resume links resolve", async ({ request }) => {
  const response = await request.get("/api/tools/download-resume?format=resume");
  expect(response.ok()).toBeTruthy();

  const json = await response.json();
  const file = await request.get(json.data.url);
  expect(file.status()).toBe(200);
});
