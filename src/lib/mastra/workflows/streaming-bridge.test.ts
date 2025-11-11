/**
 * Unit tests for streaming bridge infrastructure
 * Tests real-time workflow event streaming to AI SDK compatible streams
 */

import { describe, expect, it } from "vitest";
import type { AgentExecutionContext } from "../agents/base-agent";
import {
  createWorkflowAISDKStream,
  createWorkflowTextStream,
  isStreamingTimeoutError,
  workflowToTextStream,
} from "./streaming-bridge";
import type { WorkflowDefinition, WorkflowEvent } from "./types";

// Mock workflow for testing
function createMockWorkflow(events: WorkflowEvent[]): WorkflowDefinition {
  return {
    name: "test-workflow",
    description: "Test workflow for streaming tests",
    detect: () => true,
    steps: [],
    async *execute() {
      for (const event of events) {
        yield event;
      }
    },
    formatEvent(event: WorkflowEvent): string {
      switch (event.type) {
        case "progress":
          return `\n**[Step ${event.step}/${event.total}]** ${event.message}\n\n`;
        case "content":
          return event.text;
        case "agent-result":
          return `\n**Agent Result:**\n${event.content}\n\n`;
        case "complete":
          return `\n✅ **Workflow Complete**\n${event.summary}\n\n`;
        case "error":
          return `\n⚠️ **Error:** ${event.message}\n\n`;
      }
    },
  };
}

// Mock execution context
const mockContext: AgentExecutionContext = {
  query: "test query",
  threadId: "test-thread",
  userId: "test-user",
  history: [],
};

describe("workflowToTextStream", () => {
  it("should yield formatted text chunks in real-time", async () => {
    const events: WorkflowEvent[] = [
      { type: "progress", step: 1, total: 2, message: "Step 1" },
      { type: "content", text: "Content chunk 1" },
      { type: "progress", step: 2, total: 2, message: "Step 2" },
      { type: "complete", summary: "All done" },
    ];
    const workflow = createMockWorkflow(events);

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(workflow, mockContext)) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(4);
    expect(chunks[0]).toContain("**[Step 1/2]** Step 1");
    expect(chunks[1]).toBe("Content chunk 1");
    expect(chunks[2]).toContain("**[Step 2/2]** Step 2");
    expect(chunks[3]).toContain("✅ **Workflow Complete**");
  });

  it("should handle workflow execution errors gracefully", async () => {
    const errorWorkflow: WorkflowDefinition = {
      name: "error-workflow",
      description: "Workflow that throws errors",
      detect: () => true,
      steps: [],
      async *execute() {
        yield { type: "progress", step: 1, total: 1, message: "Starting" };
        throw new Error("Workflow execution failed");
      },
      formatEvent(event: WorkflowEvent): string {
        return `Event: ${event.type}`;
      },
    };

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(
      errorWorkflow,
      mockContext
    )) {
      chunks.push(chunk);
    }

    // Should yield initial event, then error messages
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toContain("⚠️ **Workflow Error**");
    expect(chunks.join("")).toContain("Workflow execution failed");
  });

  it("should yield chunks immediately without buffering", async () => {
    const events: WorkflowEvent[] = [
      { type: "content", text: "Chunk 1" },
      { type: "content", text: "Chunk 2" },
      { type: "content", text: "Chunk 3" },
    ];
    const workflow = createMockWorkflow(events);

    const yieldTimes: number[] = [];
    const startTime = Date.now();

    for await (const chunk of workflowToTextStream(workflow, mockContext)) {
      yieldTimes.push(Date.now() - startTime);
      expect(chunk).toBeTruthy();
    }

    // All chunks should be yielded within milliseconds (no buffering delay)
    expect(yieldTimes[yieldTimes.length - 1]).toBeLessThan(100);
  });

  it("should timeout and yield partial results when workflow exceeds time limit", async () => {
    // Create a workflow with delayed events to simulate timeout
    const slowWorkflow: WorkflowDefinition = {
      name: "slow-workflow",
      description: "Workflow that takes too long",
      detect: () => true,
      steps: [],
      async *execute() {
        yield { type: "content", text: "Step 1 complete" };
        // Simulate slow operation
        await new Promise((resolve) => setTimeout(resolve, 150));
        yield { type: "content", text: "Step 2 complete" };
        await new Promise((resolve) => setTimeout(resolve, 150));
        yield { type: "content", text: "Step 3 complete" };
      },
      formatEvent(event: WorkflowEvent): string {
        return event.type === "content" ? event.text : "";
      },
    };

    const chunks: string[] = [];
    // Set very short timeout (100ms) to trigger timeout
    for await (const chunk of workflowToTextStream(slowWorkflow, mockContext, {
      timeoutMs: 100,
    })) {
      chunks.push(chunk);
    }

    // Should yield first event, then timeout message
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]).toBe("Step 1 complete");
    expect(chunks.join("")).toContain("⏱️ **Workflow Timeout**");
    expect(chunks.join("")).toContain("exceeded the");
    expect(chunks.join("")).toContain("Partial results");

    // Should NOT contain events after timeout
    expect(chunks.join("")).not.toContain("Step 2 complete");
    expect(chunks.join("")).not.toContain("Step 3 complete");
  });

  it("should handle AI generation errors and yield error events", async () => {
    const errorWorkflow: WorkflowDefinition = {
      name: "error-workflow",
      description: "Workflow with AI generation errors",
      detect: () => true,
      steps: [],
      async *execute() {
        yield {
          type: "progress",
          step: 1,
          total: 3,
          message: "Starting Step 1",
        };
        // Simulate AI generation failure
        yield {
          type: "error",
          step: 1,
          message: "AI generation failed",
          canContinue: true,
        };
        yield { type: "agent-result", content: "Fallback content for Step 1" };

        yield {
          type: "progress",
          step: 2,
          total: 3,
          message: "Starting Step 2",
        };
        yield { type: "agent-result", content: "Step 2 succeeded" };

        yield {
          type: "progress",
          step: 3,
          total: 3,
          message: "Starting Step 3",
        };
        yield {
          type: "error",
          step: 3,
          message: "Another AI error",
          canContinue: true,
        };
        yield { type: "agent-result", content: "Fallback content for Step 3" };

        yield { type: "complete", summary: "Workflow completed with errors" };
      },
      formatEvent(event: WorkflowEvent): string {
        switch (event.type) {
          case "progress":
            return `[Step ${event.step}] ${event.message}`;
          case "agent-result":
            return event.content;
          case "error":
            return `⚠️ ERROR (Step ${event.step}): ${event.message}${event.canContinue ? " [Continuing]" : ""}`;
          case "complete":
            return `✅ ${event.summary}`;
          default:
            return "";
        }
      },
    };

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(
      errorWorkflow,
      mockContext
    )) {
      chunks.push(chunk);
    }

    const output = chunks.join("");

    // Verify error events are formatted correctly
    expect(output).toContain(
      "⚠️ ERROR (Step 1): AI generation failed [Continuing]"
    );
    expect(output).toContain(
      "⚠️ ERROR (Step 3): Another AI error [Continuing]"
    );

    // Verify fallback content appears
    expect(output).toContain("Fallback content for Step 1");
    expect(output).toContain("Fallback content for Step 3");

    // Verify successful step appears
    expect(output).toContain("Step 2 succeeded");

    // Verify workflow completes
    expect(output).toContain("✅ Workflow completed with errors");
  });

  it("should handle partial failures in parallel steps", async () => {
    const partialErrorWorkflow: WorkflowDefinition = {
      name: "partial-error-workflow",
      description: "Workflow with one parallel step failing",
      detect: () => true,
      steps: [],
      async *execute() {
        yield {
          type: "progress",
          step: 1,
          total: 2,
          message: "Running parallel steps",
        };

        // Simulate partial failure: Step 1A succeeds, Step 1B fails
        yield {
          type: "error",
          step: 1,
          message: "Step 1B failed, using fallback",
          canContinue: true,
        };

        // Both results yielded (success + fallback)
        yield { type: "agent-result", content: "Step 1A: Success result" };
        yield { type: "agent-result", content: "Step 1B: Fallback result" };

        yield { type: "progress", step: 2, total: 2, message: "Final step" };
        yield { type: "agent-result", content: "Step 2: Success" };

        yield { type: "complete", summary: "Partial recovery successful" };
      },
      formatEvent(event: WorkflowEvent): string {
        switch (event.type) {
          case "progress":
            return `[${event.step}/${event.total}] ${event.message}\n`;
          case "agent-result":
            return `${event.content}\n`;
          case "error":
            return `⚠️ ${event.message}\n`;
          case "complete":
            return `Done: ${event.summary}`;
          default:
            return "";
        }
      },
    };

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(
      partialErrorWorkflow,
      mockContext
    )) {
      chunks.push(chunk);
    }

    const output = chunks.join("");

    // Verify error yielded for failed parallel step
    expect(output).toContain("⚠️ Step 1B failed, using fallback");

    // Verify both results appear (success + fallback)
    expect(output).toContain("Step 1A: Success result");
    expect(output).toContain("Step 1B: Fallback result");

    // Verify workflow continues to next step
    expect(output).toContain("Step 2: Success");

    // Verify completion
    expect(output).toContain("Done: Partial recovery successful");
  });

  it("should handle complete AI failure recovery with all fallback content", async () => {
    const completeFailureWorkflow: WorkflowDefinition = {
      name: "complete-failure-workflow",
      description: "All AI calls fail, all fallbacks used",
      detect: () => true,
      steps: [],
      async *execute() {
        // Step 1: Parallel failures
        yield {
          type: "progress",
          step: 1,
          total: 3,
          message: "Step 1 (parallel)",
        };
        yield {
          type: "error",
          step: 1,
          message: "Both parallel AI calls failed",
          canContinue: true,
        };
        yield {
          type: "agent-result",
          content: "Fallback 1A: Using cached data",
        };
        yield {
          type: "agent-result",
          content: "Fallback 1B: Using default template",
        };

        // Step 2: Another failure
        yield { type: "progress", step: 2, total: 3, message: "Step 2" };
        yield {
          type: "error",
          step: 2,
          message: "AI call timed out",
          canContinue: true,
        };
        yield { type: "agent-result", content: "Fallback 2: Generic response" };

        // Step 3: Final failure
        yield { type: "progress", step: 3, total: 3, message: "Step 3" };
        yield {
          type: "error",
          step: 3,
          message: "Model unavailable",
          canContinue: true,
        };
        yield { type: "agent-result", content: "Fallback 3: Static content" };

        yield { type: "complete", summary: "All steps used fallback content" };
      },
      formatEvent(event: WorkflowEvent): string {
        switch (event.type) {
          case "progress":
            return `## ${event.message}\n`;
          case "agent-result":
            return `- ${event.content}\n`;
          case "error":
            return `**Error:** ${event.message}\n`;
          case "complete":
            return `\n**Summary:** ${event.summary}`;
          default:
            return "";
        }
      },
    };

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(
      completeFailureWorkflow,
      mockContext
    )) {
      chunks.push(chunk);
    }

    const output = chunks.join("");

    // Verify all error messages appear
    expect(output).toContain("**Error:** Both parallel AI calls failed");
    expect(output).toContain("**Error:** AI call timed out");
    expect(output).toContain("**Error:** Model unavailable");

    // Verify all fallback content appears
    expect(output).toContain("Fallback 1A: Using cached data");
    expect(output).toContain("Fallback 1B: Using default template");
    expect(output).toContain("Fallback 2: Generic response");
    expect(output).toContain("Fallback 3: Static content");

    // Verify workflow completes successfully despite all failures
    expect(output).toContain("**Summary:** All steps used fallback content");

    // Count error events (should be 3)
    const errorCount = (output.match(/\*\*Error:\*\*/g) || []).length;
    expect(errorCount).toBe(3);
  });

  it("should verify canContinue flag controls workflow continuation", async () => {
    const canContinueWorkflow: WorkflowDefinition = {
      name: "can-continue-workflow",
      description: "Tests canContinue flag behavior",
      detect: () => true,
      steps: [],
      async *execute() {
        yield { type: "progress", step: 1, total: 2, message: "Step 1" };
        yield {
          type: "error",
          step: 1,
          message: "Recoverable error",
          canContinue: true,
        };
        yield { type: "agent-result", content: "Step 1 fallback" };

        // Workflow continues because canContinue: true
        yield { type: "progress", step: 2, total: 2, message: "Step 2" };
        yield { type: "agent-result", content: "Step 2 success" };

        yield { type: "complete", summary: "Continued after error" };
      },
      formatEvent(event: WorkflowEvent): string {
        switch (event.type) {
          case "progress":
            return `Progress: ${event.message}\n`;
          case "agent-result":
            return `Result: ${event.content}\n`;
          case "error":
            return `Error: ${event.message} (canContinue: ${event.canContinue})\n`;
          case "complete":
            return `Complete: ${event.summary}`;
          default:
            return "";
        }
      },
    };

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(
      canContinueWorkflow,
      mockContext
    )) {
      chunks.push(chunk);
    }

    const output = chunks.join("");

    // Verify error shows canContinue flag
    expect(output).toContain("Error: Recoverable error (canContinue: true)");

    // Verify workflow continued to Step 2
    expect(output).toContain("Progress: Step 2");
    expect(output).toContain("Result: Step 2 success");

    // Verify completion
    expect(output).toContain("Complete: Continued after error");
  });
});

describe("workflow event validation", () => {
  it("should validate all 5 event types successfully", async () => {
    const validEvents: WorkflowEvent[] = [
      { type: "progress", step: 1, total: 3, message: "Step 1" },
      { type: "content", text: "Some content" },
      { type: "agent-result", content: "Agent output" },
      { type: "complete", summary: "Workflow complete" },
      { type: "error", step: 2, message: "Error occurred", canContinue: true },
    ];

    const workflow = createMockWorkflow(validEvents);
    const chunks: string[] = [];

    // All events should validate and stream successfully
    for await (const chunk of workflowToTextStream(workflow, mockContext)) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(5);
    expect(chunks[0]).toContain("**[Step 1/3]** Step 1");
    expect(chunks[1]).toBe("Some content");
    expect(chunks[2]).toContain("**Agent Result:**");
    expect(chunks[3]).toContain("✅ **Workflow Complete**");
    expect(chunks[4]).toContain("⚠️ **Error:** Error occurred");
  });

  it("should handle validation errors for malformed progress events", async () => {
    const malformedWorkflow: WorkflowDefinition = {
      name: "malformed-workflow",
      description: "Workflow with malformed events",
      detect: () => true,
      steps: [],
      async *execute() {
        // Missing required fields
        yield {
          type: "progress",
          step: -1,
          total: 0,
          message: "",
        } as WorkflowEvent;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      formatEvent(_event: WorkflowEvent): string {
        return "Should not reach here";
      },
    };

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(
      malformedWorkflow,
      mockContext
    )) {
      chunks.push(chunk);
    }

    // Should yield validation error message
    const output = chunks.join("");
    expect(output).toContain("⚠️ **Validation Error**");
    expect(output).toContain("invalid event was encountered");
  });

  it("should handle validation errors for malformed agent-result events", async () => {
    const malformedWorkflow: WorkflowDefinition = {
      name: "malformed-agent-result-workflow",
      description: "Workflow with empty agent-result content",
      detect: () => true,
      steps: [],
      async *execute() {
        // Empty content (violates min(1) constraint)
        yield { type: "agent-result", content: "" } as WorkflowEvent;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      formatEvent(_event: WorkflowEvent): string {
        return "Should not reach here";
      },
    };

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(
      malformedWorkflow,
      mockContext
    )) {
      chunks.push(chunk);
    }

    const output = chunks.join("");
    expect(output).toContain("⚠️ **Validation Error**");
  });

  it("should continue processing valid events after validation error", async () => {
    const mixedWorkflow: WorkflowDefinition = {
      name: "mixed-workflow",
      description: "Workflow with both valid and invalid events",
      detect: () => true,
      steps: [],
      async *execute() {
        yield { type: "content", text: "First valid event" };
        // Invalid event (negative step)
        yield {
          type: "progress",
          step: -5,
          total: 3,
          message: "Invalid",
        } as WorkflowEvent;
        yield { type: "content", text: "Second valid event" };
        yield { type: "complete", summary: "Done despite error" };
      },
      formatEvent(event: WorkflowEvent): string {
        switch (event.type) {
          case "content":
            return event.text;
          case "complete":
            return `Complete: ${event.summary}`;
          default:
            return "";
        }
      },
    };

    const chunks: string[] = [];
    for await (const chunk of workflowToTextStream(
      mixedWorkflow,
      mockContext
    )) {
      chunks.push(chunk);
    }

    const output = chunks.join("");

    // Should contain first valid event
    expect(output).toContain("First valid event");

    // Should contain validation error
    expect(output).toContain("⚠️ **Validation Error**");

    // Should continue processing and contain subsequent valid events
    expect(output).toContain("Second valid event");
    expect(output).toContain("Complete: Done despite error");
  });
});

describe("createWorkflowTextStream", () => {
  it("should return a ReadableStream that yields text chunks", async () => {
    const events: WorkflowEvent[] = [
      { type: "content", text: "Text 1" },
      { type: "content", text: "Text 2" },
    ];
    const workflow = createMockWorkflow(events);

    const stream = createWorkflowTextStream(workflow, mockContext);
    expect(stream).toBeInstanceOf(ReadableStream);

    const reader = stream.getReader();
    const chunks: string[] = [];

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toBe("Text 1");
    expect(chunks[1]).toBe("Text 2");
  });

  it("should close the stream after all chunks are read", async () => {
    const events: WorkflowEvent[] = [{ type: "complete", summary: "Done" }];
    const workflow = createMockWorkflow(events);

    const stream = createWorkflowTextStream(workflow, mockContext);
    const reader = stream.getReader();

    // Read the complete event
    await reader.read();

    // Next read should indicate done
    const { done } = await reader.read();
    expect(done).toBe(true);

    reader.releaseLock();
  });
});

describe("createWorkflowAISDKStream", () => {
  it("should return an object with toUIMessageStreamResponse method", () => {
    const workflow = createMockWorkflow([]);
    const stream = createWorkflowAISDKStream(workflow, mockContext);

    expect(stream).toHaveProperty("toUIMessageStreamResponse");
    expect(typeof stream.toUIMessageStreamResponse).toBe("function");
  });

  it("should encode text chunks in SSE format with text-delta type", async () => {
    const events: WorkflowEvent[] = [{ type: "content", text: "Test content" }];
    const workflow = createMockWorkflow(events);

    const stream = createWorkflowAISDKStream(workflow, mockContext);
    const response = stream.toUIMessageStreamResponse();

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream");
    expect(response.headers.get("Cache-Control")).toBe("no-cache");
    expect(response.headers.get("Connection")).toBe("keep-alive");

    // Read stream body
    const reader = response.body?.getReader();
    expect(reader).toBeDefined();

    if (reader) {
      const decoder = new TextDecoder();
      const chunks: string[] = [];

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(decoder.decode(value));
        }
      } finally {
        reader.releaseLock();
      }

      const output = chunks.join("");

      // Should contain SSE formatted text-delta
      expect(output).toContain('data: {"type":"text-delta"');
      expect(output).toContain('"delta":"Test content"');

      // Should end with finish message
      expect(output).toContain('data: {"type":"finish"');
      expect(output).toContain("data: [DONE]");
    }
  });

  it("should handle multiple text chunks in sequence", async () => {
    const events: WorkflowEvent[] = [
      { type: "content", text: "First" },
      { type: "content", text: "Second" },
      { type: "content", text: "Third" },
    ];
    const workflow = createMockWorkflow(events);

    const stream = createWorkflowAISDKStream(workflow, mockContext);
    const response = stream.toUIMessageStreamResponse();

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const chunks: string[] = [];

    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(decoder.decode(value));
        }
      } finally {
        reader.releaseLock();
      }
    }

    const output = chunks.join("");

    // Should contain all three text deltas
    expect(output).toContain('"delta":"First"');
    expect(output).toContain('"delta":"Second"');
    expect(output).toContain('"delta":"Third"');
  });
});

describe("isStreamingTimeoutError", () => {
  it("should detect timeout errors by message pattern", () => {
    expect(isStreamingTimeoutError(new Error("Request timeout"))).toBe(true);
    expect(isStreamingTimeoutError(new Error("Operation timed out"))).toBe(
      true
    );
    expect(isStreamingTimeoutError(new Error("Exceeded time limit"))).toBe(
      true
    );
    expect(isStreamingTimeoutError(new Error("Time limit exceeded"))).toBe(
      true
    );
    expect(isStreamingTimeoutError(new Error("Request aborted"))).toBe(true);
  });

  it("should return false for non-timeout errors", () => {
    expect(isStreamingTimeoutError(new Error("Network error"))).toBe(false);
    expect(isStreamingTimeoutError(new Error("Invalid response"))).toBe(false);
    expect(isStreamingTimeoutError("not an error")).toBe(false);
    expect(isStreamingTimeoutError(null)).toBe(false);
    expect(isStreamingTimeoutError(undefined)).toBe(false);
  });

  it("should be case-insensitive", () => {
    expect(isStreamingTimeoutError(new Error("TIMEOUT ERROR"))).toBe(true);
    expect(isStreamingTimeoutError(new Error("Timeout"))).toBe(true);
    expect(isStreamingTimeoutError(new Error("ABORTED"))).toBe(true);
  });
});
