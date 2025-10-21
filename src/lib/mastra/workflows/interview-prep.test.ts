import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { interviewPrepWorkflow, detectInterviewPrep } from "./interview-prep";
import type { AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import type { UIMessage } from "ai";

// Mock the AI SDK
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

// Mock OpenAI
vi.mock("@ai-sdk/openai", () => ({
  openai: vi.fn(() => "mocked-model"),
}));

import { generateText } from "ai";

describe("interview-prep workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("detectInterviewPrep", () => {
    it("should detect 'interview prep' query", () => {
      expect(detectInterviewPrep("interview prep")).toBe(true);
    });

    it("should detect 'interview preparation' query", () => {
      expect(detectInterviewPrep("help me with interview preparation")).toBe(true);
    });

    it("should detect 'prepare for interview' query", () => {
      expect(detectInterviewPrep("I need to prepare for an interview")).toBe(true);
    });

    it("should detect 'interview question' query", () => {
      expect(detectInterviewPrep("show me interview questions")).toBe(true);
    });

    it("should detect 'help prepare interview' query", () => {
      expect(detectInterviewPrep("help me prepare for my interview")).toBe(true);
    });

    it("should be case-insensitive", () => {
      expect(detectInterviewPrep("INTERVIEW PREP")).toBe(true);
      expect(detectInterviewPrep("Interview Preparation")).toBe(true);
    });

    it("should not detect unrelated queries", () => {
      expect(detectInterviewPrep("show me your projects")).toBe(false);
      expect(detectInterviewPrep("tell me about yourself")).toBe(false);
      expect(detectInterviewPrep("what is your contact info")).toBe(false);
    });
  });

  describe("workflow metadata", () => {
    it("should have correct name", () => {
      expect(interviewPrepWorkflow.name).toBe("interview-prep");
    });

    it("should have description", () => {
      expect(interviewPrepWorkflow.description).toContain("interview");
      expect(interviewPrepWorkflow.description.length).toBeGreaterThan(10);
    });

    it("should have detect function", () => {
      expect(interviewPrepWorkflow.detect).toBe(detectInterviewPrep);
    });

    it("should have execute function", () => {
      expect(typeof interviewPrepWorkflow.execute).toBe("function");
    });

    it("should have formatEvent function", () => {
      expect(typeof interviewPrepWorkflow.formatEvent).toBe("function");
    });
  });

  describe("formatEvent", () => {
    it("should format progress event", () => {
      const event = {
        type: "progress" as const,
        step: 1,
        total: 3,
        message: "Reviewing resume"
      };
      const formatted = interviewPrepWorkflow.formatEvent(event);
      expect(formatted).toContain("[Step 1/3]");
      expect(formatted).toContain("Reviewing resume");
      expect(formatted).toContain("**");
    });

    it("should format content event", () => {
      const event = {
        type: "content" as const,
        text: "Here is some content"
      };
      const formatted = interviewPrepWorkflow.formatEvent(event);
      expect(formatted).toBe("Here is some content");
    });

    it("should format agent-result event", () => {
      const event = {
        type: "agent-result" as const,
        content: "Analysis complete"
      };
      const formatted = interviewPrepWorkflow.formatEvent(event);
      expect(formatted).toContain("Analysis complete");
    });

    it("should format complete event", () => {
      const event = {
        type: "complete" as const,
        summary: "Workflow finished successfully"
      };
      const formatted = interviewPrepWorkflow.formatEvent(event);
      expect(formatted).toContain("---");
      expect(formatted).toContain("Workflow finished successfully");
    });
  });

  describe("execute", () => {
    const mockContext: AgentExecutionContext = {
      threadId: "test-thread",
      userId: "test-user",
      query: "Help me prepare for a React interview",
      history: [] as UIMessage[]
    };

    beforeEach(() => {
      (generateText as Mock).mockResolvedValue({
        text: "Mocked AI response"
      });
    });

    it("should yield progress event for step 1", async () => {
      const generator = interviewPrepWorkflow.execute(mockContext);
      const firstEvent = await generator.next();

      expect(firstEvent.done).toBe(false);
      expect(firstEvent.value.type).toBe("progress");
      expect(firstEvent.value.step).toBe(1);
      expect(firstEvent.value.total).toBe(3);
    });

    it("should yield 7 total events (3 progress + 3 results + 1 complete)", async () => {
      const generator = interviewPrepWorkflow.execute(mockContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      expect(events).toHaveLength(7);
      expect(events.filter(e => e.type === "progress")).toHaveLength(3);
      expect(events.filter(e => e.type === "agent-result")).toHaveLength(3);
      expect(events.filter(e => e.type === "complete")).toHaveLength(1);
    });

    it("should call generateText 3 times (one per step)", async () => {
      const generator = interviewPrepWorkflow.execute(mockContext);

      for await (const event of generator) {
        void event;
      }

      expect(generateText).toHaveBeenCalledTimes(3);
    });

    it("should extract interview type from query", async () => {
      const reactContext = {
        ...mockContext,
        query: "Help me prepare for a React interview"
      };

      const generator = interviewPrepWorkflow.execute(reactContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      const completeEvent = events.find(e => e.type === "complete");
      expect(completeEvent?.summary.toLowerCase()).toContain("react");
    });

    it("should extract company from query", async () => {
      const googleContext = {
        ...mockContext,
        query: "Help me prepare for a React interview at Google"
      };

      const generator = interviewPrepWorkflow.execute(googleContext);
      const events = [];

      for await (const event of generator) {
        events.push(event);
      }

      const completeEvent = events.find(e => e.type === "complete");
      expect(completeEvent?.summary).toContain("Google");
    });

    it("should handle errors gracefully", async () => {
      (generateText as Mock).mockRejectedValueOnce(new Error("API error"));

      const generator = interviewPrepWorkflow.execute(mockContext);

      await expect(async () => {
        for await (const event of generator) {
          void event;
        }
      }).rejects.toThrow("API error");
    });
  });
});
