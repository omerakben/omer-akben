import type { AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import type { UIMessage } from "ai";
import type { Mock } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  detectProjectComparison,
  projectComparisonWorkflow,
} from "./project-comparison";

// Mock the AI SDK
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

// Mock OpenAI
vi.mock("@ai-sdk/openai", () => ({
  openai: vi.fn(() => "mocked-model"),
}));

import { generateText } from "ai";

describe("project-comparison workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("detectProjectComparison", () => {
    it("should detect 'compare projects' query", () => {
      expect(detectProjectComparison("compare projects")).toBe(true);
    });

    it("should detect 'compare my projects' query", () => {
      expect(detectProjectComparison("compare my projects")).toBe(true);
    });

    it("should detect 'show projects comparison' query", () => {
      expect(detectProjectComparison("show me a projects comparison")).toBe(
        true
      );
    });

    it("should detect 'difference between projects' query", () => {
      expect(
        detectProjectComparison("what's the difference between your projects")
      ).toBe(true);
    });

    it("should detect 'which project is better' query", () => {
      expect(detectProjectComparison("which project is better")).toBe(true);
    });

    it("should detect 'what project is best' query", () => {
      expect(detectProjectComparison("what projects would you recommend")).toBe(
        true
      );
    });

    it("should be case-insensitive", () => {
      expect(detectProjectComparison("COMPARE PROJECTS")).toBe(true);
      expect(detectProjectComparison("Compare Your Projects")).toBe(true);
    });

    it("should not detect unrelated queries", () => {
      expect(detectProjectComparison("show me your resume")).toBe(false);
      expect(detectProjectComparison("tell me about yourself")).toBe(false);
      expect(detectProjectComparison("what is your contact info")).toBe(false);
    });
  });

  describe("workflow metadata", () => {
    it("should have correct name", () => {
      expect(projectComparisonWorkflow.name).toBe("project-comparison");
    });

    it("should have description", () => {
      expect(projectComparisonWorkflow.description).toContain("project");
      expect(projectComparisonWorkflow.description.length).toBeGreaterThan(10);
    });

    it("should have detect function", () => {
      expect(projectComparisonWorkflow.detect).toBe(detectProjectComparison);
    });

    it("should have execute function", () => {
      expect(typeof projectComparisonWorkflow.execute).toBe("function");
    });

    it("should have formatEvent function", () => {
      expect(typeof projectComparisonWorkflow.formatEvent).toBe("function");
    });
  });

  describe("formatEvent", () => {
    it("should format progress event", () => {
      const event = {
        type: "progress" as const,
        step: 1,
        total: 3,
        message: "Finding projects",
      };
      const formatted = projectComparisonWorkflow.formatEvent(event);
      expect(formatted).toContain("[Step 1/3]");
      expect(formatted).toContain("Finding projects");
      expect(formatted).toContain("**");
    });

    it("should format content event", () => {
      const event = {
        type: "content" as const,
        text: "Here is some content",
      };
      const formatted = projectComparisonWorkflow.formatEvent(event);
      expect(formatted).toBe("Here is some content");
    });

    it("should format agent-result event", () => {
      const event = {
        type: "agent-result" as const,
        content: "Comparison complete",
      };
      const formatted = projectComparisonWorkflow.formatEvent(event);
      expect(formatted).toContain("Comparison complete");
    });

    it("should format complete event", () => {
      const event = {
        type: "complete" as const,
        summary: "Workflow finished successfully",
      };
      const formatted = projectComparisonWorkflow.formatEvent(event);
      expect(formatted).toContain("---");
      expect(formatted).toContain("Workflow finished successfully");
    });
  });

  describe("execute", () => {
    const mockContext: AgentExecutionContext = {
      threadId: "test-thread",
      userId: "test-user",
      query: "Compare your AI projects",
      history: [] as UIMessage[],
    };

    beforeEach(() => {
      (generateText as Mock).mockResolvedValue({
        text: "Mocked AI response",
      });
    });

    it("should yield progress event for step 1", async () => {
      const generator = projectComparisonWorkflow.execute(mockContext);
      const firstEvent = await generator.next();

      expect(firstEvent.done).toBe(false);
      expect(firstEvent.value.type).toBe("progress");
      expect(firstEvent.value.step).toBe(1);
      expect(firstEvent.value.total).toBe(3);
    });

    it("should yield 7 total events (3 progress + 3 results + 1 complete)", async () => {
      const generator = projectComparisonWorkflow.execute(mockContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      expect(events).toHaveLength(7);
      expect(events.filter((e) => e.type === "progress")).toHaveLength(3);
      expect(events.filter((e) => e.type === "agent-result")).toHaveLength(3);
      expect(events.filter((e) => e.type === "complete")).toHaveLength(1);
    });

    it("should call generateText 3 times (one per step)", async () => {
      const generator = projectComparisonWorkflow.execute(mockContext);

      for await (const event of generator) {
        void event;
      }

      expect(generateText).toHaveBeenCalledTimes(3);
    });

    it("should extract AI category from query", async () => {
      const aiContext = {
        ...mockContext,
        query: "Compare your AI projects",
      };

      const generator = projectComparisonWorkflow.execute(aiContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      const completeEvent = events.find((e) => e.type === "complete");
      expect(completeEvent?.summary).toMatch(/AI\/ML|ai-ml/i);
    });

    it("should extract web category from query", async () => {
      const webContext = {
        ...mockContext,
        query: "Compare your web projects",
      };

      const generator = projectComparisonWorkflow.execute(webContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      const firstProgress = events.find((e) => e.type === "progress");
      expect(firstProgress?.message).toContain("web");
    });

    it("should extract Full-Stack role from query", async () => {
      const fullStackContext = {
        ...mockContext,
        query: "Compare your full-stack projects",
      };

      const generator = projectComparisonWorkflow.execute(fullStackContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      const firstProgress = events.find((e) => e.type === "progress");
      expect(firstProgress?.message).toContain("Full-Stack");
    });

    it("should extract technology from query", async () => {
      const reactContext = {
        ...mockContext,
        query: "Compare your React projects",
      };

      const generator = projectComparisonWorkflow.execute(reactContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      const firstProgress = events.find((e) => e.type === "progress");
      expect(firstProgress?.message?.toLowerCase()).toContain("react");
    });

    it("should extract featured filter from query", async () => {
      const featuredContext = {
        ...mockContext,
        query: "Compare your featured projects",
      };

      const generator = projectComparisonWorkflow.execute(featuredContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      const firstProgress = events.find((e) => e.type === "progress");
      expect(firstProgress?.message).toContain("featured");
    });

    it("should handle errors gracefully", async () => {
      (generateText as Mock).mockRejectedValueOnce(new Error("API error"));

      const generator = projectComparisonWorkflow.execute(mockContext);

      await expect(async () => {
        for await (const event of generator) {
          void event;
        }
      }).rejects.toThrow("API error");
    });
  });
});
