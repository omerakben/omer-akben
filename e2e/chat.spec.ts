import { expect, test } from "@/test-utils/playwright-chat";

// Exercise the real chat UI with deterministic API responses and no paid services.
test.describe("Chat Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("chat_thread_id");

      Object.keys(localStorage)
        .filter((key) => key.startsWith("thread_"))
        .forEach((key) => localStorage.removeItem(key));
    });
    await page.goto("/", { waitUntil: "networkidle" });

    // Wait for hydration to complete
    await page.waitForTimeout(1500);

    // Select the public chat control by its exact accessible name.
    await page
      .getByRole("button", {
        name: "Open AI Ozzy chat (cmd/ctrl+K)",
        exact: true,
      })
      .waitFor({
        state: "visible",
        timeout: 10000,
      });
  });

  test.skip("should open and close chat sidebar", async ({ page }) => {
    // Find and click the chat button to open sidebar
    const chatButton = page.locator('button[aria-label*="chat" i]').last();
    await chatButton.click();

    // Verify sidebar is visible
    const sidebar = page.locator('[role="dialog"], aside').filter({
      hasText: /Ozzy|AI|Chat/i,
    });
    await expect(sidebar).toBeVisible();

    // Close the sidebar
    const closeButton = page.locator('button[title*="Close" i]').first();
    await closeButton.click();

    // Verify sidebar is closed
    await expect(sidebar).not.toBeVisible();
  });

  test.skip("should send a message and receive a response", async ({ page }) => {
    // Open chat sidebar
    const chatButton = page.locator('button[aria-label*="chat" i]').last();
    await chatButton.click();

    // Wait for chat interface to load
    await page.waitForSelector('textarea, input[type="text"]');

    // Type and send a message
    const messageInput = page.locator('textarea, input[type="text"]').first();
    await messageInput.fill("Hello, what can you help me with?");

    const sendButton = page.locator('button[type="submit"]').first();
    await sendButton.click();

    // Wait for user message to appear
    await expect(
      page.locator("text=Hello, what can you help me with?")
    ).toBeVisible();

    // Wait for assistant response (with timeout for API call)
    await expect(
      page.locator('[class*="message"], [data-role="assistant"]').filter({
        hasText: /.+/,
      })
    ).toBeVisible({ timeout: 15000 });
  });

  test.skip("should render markdown in messages", async ({ page }) => {
    // Open chat sidebar
    const chatButton = page.locator('button[aria-label*="chat" i]').last();
    await chatButton.click();

    // Send a message asking for markdown
    await page.waitForSelector('textarea, input[type="text"]');
    const messageInput = page.locator('textarea, input[type="text"]').first();
    await messageInput.fill("Can you give me a bulleted list of your skills?");

    const sendButton = page.locator('button[type="submit"]').first();
    await sendButton.click();

    // Wait for response with markdown (lists use <ul> or <li> tags)
    await expect(page.locator("ul, ol")).toBeVisible({ timeout: 15000 });
  });

  test("should have clickable links with correct attributes", async ({
    page,
  }) => {
    // Open chat sidebar
    const chatButton = page.getByRole("button", {
      name: "Open AI Ozzy chat (cmd/ctrl+K)",
      exact: true,
    });
    await chatButton.click();

    // Send a message that should return links
    await page.waitForSelector('textarea, input[type="text"]');
    const messageInput = page.locator('textarea, input[type="text"]').first();
    await messageInput.fill("What's your portfolio website?");

    const sendButton = page.locator('button[type="submit"]').first();
    await sendButton.click();

    // Wait for response with link
    const link = page
      .locator(".chat-message")
      .getByRole("link", { name: "GitHub", exact: true })
      .first();
    await expect(link).toBeVisible({ timeout: 15000 });

    // Verify link attributes
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener noreferrer/);
  });

  for (const brightness of ["-3", "-2", "-1", "0", "+1", "+2", "+3", "auto"]) {
    test(`should auto-scroll to latest message in ${brightness} brightness`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.evaluate((mode) => localStorage.setItem("brightness-mode", mode), brightness);
      await page.reload({ waitUntil: "networkidle" });
      if (brightness !== "auto") {
        await expect(page.locator("html")).toHaveAttribute("data-brightness", brightness);
      }

      // Open chat sidebar
      const chatButton = page.getByRole("button", {
        name: "Open AI Ozzy chat (cmd/ctrl+K)",
        exact: true,
      });
      await chatButton.click();

      const sidebar = page
        .locator('[role="dialog"], aside')
        .filter({
          has: page.locator('textarea, input[type="text"]'),
        })
        .first();

      await expect(sidebar).toBeVisible();
      const scrollContainer = sidebar.locator(".chat-scroll-smooth").first();
      await scrollContainer.evaluate((element) => {
        const originalScroll = element.scrollTo.bind(element);
        element.scrollTo = (options?: ScrollToOptions | number, y?: number) => {
          if (typeof options === "number") {
            originalScroll(options, y ?? 0);
          } else {
            element.setAttribute("data-last-scroll-behavior", options?.behavior ?? "auto");
            originalScroll(options);
          }
        };
      });

      // Send multiple messages to create scroll
      for (let i = 1; i <= 3; i++) {
        const messageInput = sidebar
          .locator('textarea, input[type="text"]')
          .first();
        await messageInput.fill(`Test message ${i}`);

        const sendButton = sidebar.locator('button[type="submit"]').first();
        await sendButton.click();

        // Wait for each user message to appear in the chat transcript.
        await expect(
          sidebar.locator(".chat-message").filter({
            hasText: `Test message ${i}`,
          }),
        ).toHaveCount(1);

        // Wait for the streamed assistant response before submitting the next message.
        await expect(
          sidebar.getByRole("link", { name: "Omer's portfolio", exact: true }),
        ).toHaveCount(i);
      }

      // Get the messages container
      const messagesContainer = sidebar.locator(".chat-scroll-smooth").first();

      // Check if the container is scrolled to bottom (within a small threshold)
      await expect
        .poll(() =>
          messagesContainer.evaluate((el) => {
            const threshold = 50; // Allow 50px threshold
            return (
              Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <=
              threshold
            );
          }),
        )
        .toBeTruthy();
      expect(
        await messagesContainer.evaluate(
          (el) => el.scrollHeight > el.clientHeight,
        ),
      ).toBeTruthy();
      await expect(scrollContainer).toHaveAttribute("data-last-scroll-behavior", "instant");

      // A completed reply must not pull readers back down after they scroll up.
      await scrollContainer.evaluate((element) => element.scrollTo({ top: 0, behavior: "instant" }));
      const messageInput = sidebar.locator("textarea").first();
      await messageInput.fill("Draft only, do not submit");
      await page.waitForTimeout(200);
      expect(await scrollContainer.evaluate((element) => element.scrollTop)).toBe(0);
    });
  }

  test.skip("should display follow-up question buttons", async ({ page }) => {
    // Open chat sidebar
    const chatButton = page.locator('button[aria-label*="chat" i]').last();
    await chatButton.click();

    // Send a message
    await page.waitForSelector('textarea, input[type="text"]');
    const messageInput = page.locator('textarea, input[type="text"]').first();
    await messageInput.fill("Tell me about your projects");

    const sendButton = page.locator('button[type="submit"]').first();
    await sendButton.click();

    // Wait for assistant response
    await page.waitForTimeout(5000);

    // Look for follow-up question buttons (should appear after assistant message)
    const followUpButtons = page.locator(
      'button:has-text("View"), button:has-text("Tell me more"), button:has-text("Show"), button[class*="follow-up"], button[class*="suggestion"]'
    );

    // Should have at least one follow-up button
    const count = await followUpButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test.skip("should persist chat state when expanding to full screen", async ({
    page,
  }) => {
    // Open chat sidebar
    const chatButton = page.locator('button[aria-label*="chat" i]').last();
    await chatButton.click();

    // Send a test message
    await page.waitForSelector('textarea, input[type="text"]');
    const messageInput = page.locator('textarea, input[type="text"]').first();
    const testMessage = "This is a state persistence test";
    await messageInput.fill(testMessage);

    const sendButton = page.locator('button[type="submit"]').first();
    await sendButton.click();

    // Wait for message to appear
    await expect(page.locator(`text=${testMessage}`)).toBeVisible();

    // Click expand button to go to full-screen mode
    const expandButton = page.locator('button[title*="Expand" i]').first();
    await expandButton.click();

    // Wait for navigation to /chat page
    await page.waitForURL("**/chat");

    // Verify the test message is still visible on the full-screen page
    await expect(page.locator(`text=${testMessage}`)).toBeVisible({
      timeout: 5000,
    });
  });

  test("should handle empty message submission gracefully", async ({
    page,
  }) => {
    // Open chat sidebar
    const chatButton = page.getByRole("button", {
      name: "Open AI Ozzy chat (cmd/ctrl+K)",
      exact: true,
    });
    await chatButton.click();

    await page.waitForSelector('textarea, input[type="text"]');

    // Try to submit empty message
    const sendButton = page.locator('button[type="submit"]').first();

    // Button should be disabled or nothing should happen
    const isDisabled = await sendButton.isDisabled();

    if (!isDisabled) {
      // If not disabled, clicking shouldn't create a message
      await sendButton.click();
      await page.waitForTimeout(1000);

      // Count messages - should only have initial/welcome messages if any
      const userMessages = page.locator('[data-role="user"], .user-message');
      const count = await userMessages.count();
      expect(count).toBe(0);
    } else {
      expect(isDisabled).toBeTruthy();
    }
  });
});
