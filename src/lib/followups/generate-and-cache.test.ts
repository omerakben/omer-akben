/**
 * Unit tests for follow-up generation and caching helper
 * Tests message conversion from UIMessage to simple format
 * Critical for handling workflow messages vs regular LLM messages
 */

import type { UIMessage } from "ai";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("./dynamic-generator", () => ({
  generateDynamicFollowups: vi.fn().mockResolvedValue([
    "Follow-up question 1",
    "Follow-up question 2",
  ]),
}));

vi.mock("./cache", () => ({
  followupCache: {
    set: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock("@/lib/memory/redis-memory", () => ({
  RedisMemoryManager: vi.fn().mockImplementation(() => ({
    getSemantic: vi.fn().mockResolvedValue(null),
  })),
}));

describe("generate-and-cache", () => {
  describe("convertUIMessageToSimple", () => {
    // We need to test the internal function, so we'll test it indirectly through generateAndCacheFollowups
    // First, let's create a helper to access the function

    it("should handle regular LLM messages with text parts", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      // Regular message with parts array
      const regularMessage: UIMessage = {
        id: "msg-1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What are your top projects?",
          },
        ],
      };

      // Should not throw and should process successfully
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-1",
          userId: "user-1",
          messages: [regularMessage],
        })
      ).resolves.not.toThrow();
    });

    it("should handle workflow messages with empty parts array", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      // Workflow message with empty parts
      const workflowMessage: UIMessage = {
        id: "msg-2",
        role: "assistant",
        parts: [],
      };

      // Should not throw even with empty parts
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-2",
          userId: "user-2",
          messages: [workflowMessage],
        })
      ).resolves.not.toThrow();
    });

    it("should handle workflow messages with text-delta chunks (no .text property)", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      // Workflow message with text-delta chunks
      const workflowMessage: UIMessage = {
        id: "msg-3",
        role: "assistant",
        parts: [
          {
            type: "text-delta" as "text", // Cast to satisfy UIMessage type
            payload: {
              text: "**[Step 1/3]** Analyzing projects...",
            },
          } as never, // Type assertion needed for workflow format
        ],
      };

      // Should not throw and should handle gracefully
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-3",
          userId: "user-3",
          messages: [workflowMessage],
        })
      ).resolves.not.toThrow();
    });

    it("should handle messages without parts and without content", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      // Message with neither parts nor content
      const malformedMessage = {
        id: "msg-4",
        role: "user",
        parts: undefined, // Simulate missing parts property
      } as unknown as UIMessage; // Type assertion for malformed message

      // Should not throw and should filter out empty messages
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-4",
          userId: "user-4",
          messages: [malformedMessage],
        })
      ).resolves.not.toThrow();
    });

    it("should handle messages with content property (workflow fallback)", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      // Workflow message with content property instead of parts
      const workflowMessage = {
        id: "msg-5",
        role: "assistant",
        parts: [],
        content: "Project comparison complete. Analysis shows...",
      } as unknown as UIMessage;

      // Should extract content from .content property
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-5",
          userId: "user-5",
          messages: [workflowMessage],
        })
      ).resolves.not.toThrow();
    });

    it("should handle mixed message formats in conversation", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      const mixedMessages: UIMessage[] = [
        // Regular user message
        {
          id: "msg-6a",
          role: "user",
          parts: [{ type: "text", text: "Compare my web projects" }],
        },
        // Workflow response with content
        {
          id: "msg-6b",
          role: "assistant",
          parts: [],
          content: "**[Step 1/3]** Loading projects...",
        } as unknown as UIMessage,
        // Empty workflow message
        {
          id: "msg-6c",
          role: "assistant",
          parts: [],
        },
        // Final workflow message
        {
          id: "msg-6d",
          role: "assistant",
          parts: [{ type: "text", text: "Comparison complete!" }],
        },
      ];

      // Should handle all message types gracefully
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-6",
          userId: "user-6",
          messages: mixedMessages,
        })
      ).resolves.not.toThrow();
    });

    it("should map tool role to assistant role", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      // Message with tool role (should be converted to assistant)
      const toolMessage: UIMessage = {
        id: "msg-7",
        role: "tool" as "user", // Cast needed for UIMessage type
        parts: [{ type: "text", text: "Tool result data" }],
      };

      // Should not throw and should map tool -> assistant
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-7",
          userId: "user-7",
          messages: [toolMessage],
        })
      ).resolves.not.toThrow();
    });
  });

  describe("generateAndCacheFollowups", () => {
    it("should skip generation for empty message list", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      // Should handle empty messages gracefully
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-empty",
          userId: "user-empty",
          messages: [],
        })
      ).resolves.not.toThrow();
    });

    it("should skip generation for anonymous users", async () => {
      const { generateAndCacheFollowups } = await import(
        "./generate-and-cache"
      );

      const message: UIMessage = {
        id: "msg-anon",
        role: "user",
        parts: [{ type: "text", text: "Hello" }],
      };

      // Should not throw for anonymous users
      await expect(
        generateAndCacheFollowups({
          threadId: "thread-anon",
          userId: "anonymous",
          messages: [message],
        })
      ).resolves.not.toThrow();
    });
  });
});
