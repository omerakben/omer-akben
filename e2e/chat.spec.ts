import { expect, test } from "@playwright/test";

// Skip chat E2E tests in CI to avoid OpenAI API calls and timeout issues
// These tests make real AI API calls which are slow, expensive, and unreliable
// Run locally with: npm run test:e2e -- chat.spec.ts
test.describe("Chat Functionality", () => {
  // Skip all chat tests in CI environment
  test.skip(!!process.env.CI, "Skipping chat tests in CI (real API calls)");

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

    // Wait for visible chat button (use .last() to get the floating button, not the invisible one)
    await page.locator('button[aria-label*="chat" i]').last().waitFor({
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
    const chatButton = page.locator('button[aria-label*="chat" i]').last();
    await chatButton.click();

    // Send a message that should return links
    await page.waitForSelector('textarea, input[type="text"]');
    const messageInput = page.locator('textarea, input[type="text"]').first();
    await messageInput.fill("What's your portfolio website?");

    const sendButton = page.locator('button[type="submit"]').first();
    await sendButton.click();

    // Wait for response with link
    const link = page.locator('a[href*="omerakben.com"]').first();
    await expect(link).toBeVisible({ timeout: 15000 });

    // Verify link attributes
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener noreferrer/);
  });

  test("should auto-scroll to latest message", async ({ page }) => {
    // Open chat sidebar
    const chatButton = page.locator('button[aria-label*="chat" i]').last();
    await chatButton.click();

    const sidebar = page
      .locator('[role="dialog"], aside')
      .filter({
        has: page.locator('textarea, input[type="text"]'),
      })
      .first();

    await expect(sidebar).toBeVisible();

    // Send multiple messages to create scroll
    for (let i = 1; i <= 3; i++) {
      const messageInput = sidebar.locator('textarea, input[type="text"]').first();
      await messageInput.fill(`Test message ${i}`);

      const sendButton = sidebar.locator('button[type="submit"]').first();
      await sendButton.click();

      // Wait for each user message to appear in the chat transcript.
      await expect(
        sidebar.locator(".chat-message").filter({
          hasText: `Test message ${i}`,
        })
      ).toHaveCount(1);

      // Wait a bit for potential response
      await page.waitForTimeout(2000);
    }

    // Get the messages container
    const messagesContainer = sidebar.locator(".chat-scroll-smooth").first();

    // Check if the container is scrolled to bottom (within a small threshold)
    const isScrolledToBottom = await messagesContainer.evaluate((el) => {
      const threshold = 50; // Allow 50px threshold
      return (
        Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= threshold
      );
    });

    expect(isScrolledToBottom).toBeTruthy();
  });

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
    const chatButton = page.locator('button[aria-label*="chat" i]').last();
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
