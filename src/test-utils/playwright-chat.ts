import { test as base, expect } from "@playwright/test";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

/** UI contracts only: provider quality and Redis persistence need separate integration tests. */
export const test = base.extend({
  page: async ({ page }, runFixture) => {
    await page.route(/\/api\/chat(?:\?|$)/, async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({ json: { messages: [] } });
        return;
      }

      if (route.request().method() !== "POST") {
        await route.abort();
        return;
      }

      const stream = createUIMessageStream({
        execute: ({ writer }) => {
          writer.write({ type: "start", messageId: `fixture-${Date.now()}` });
          writer.write({ type: "text-start", id: "answer" });
          writer.write({
            type: "text-delta",
            id: "answer",
            delta:
              "Visit [Omer's portfolio](https://omerakben.com) for projects and experience, or [GitHub](https://github.com/omerakben) for source code.\n\n" +
              Array.from(
                { length: 8 },
                (_, index) =>
                  `Paragraph ${index + 1}: This deterministic response exercises the actual message renderer and makes the conversation long enough to require scrolling.`,
              ).join("\n\n"),
          });
          writer.write({ type: "text-end", id: "answer" });
          writer.write({ type: "finish" });
        },
      });
      const response = createUIMessageStreamResponse({ stream });
      await route.fulfill({
        status: response.status,
        headers: Object.fromEntries(response.headers),
        body: await response.text(),
      });
    });

    await page.route("**/api/suggest-followups", (route) =>
      route.fulfill({ json: { suggested_followups: [] } }),
    );
    await runFixture(page);
  },
});

export { expect };
