/**
 * Streaming Bridge for Workflow → AI SDK Integration
 *
 * Converts Mastra WorkflowEvent async generators to AI SDK v5 compatible streams
 * in real-time, eliminating the 15-30s buffering bottleneck.
 *
 * Architecture:
 * - WorkflowEvent (progress/content/agent-result/complete) → formatEvent() → text chunks
 * - Text chunks streamed immediately as they're generated
 * - Compatible with Mastra's AISDKV5OutputStream and BasePortfolioAgent.stream()
 *
 * Performance Impact:
 * - Before: 15-30s buffer → stream (timeout risk)
 * - After: Real-time streaming (0s buffer, immediate user feedback)
 */

import type { WorkflowDefinition } from "./types";
import { validateWorkflowEvent } from "./types";
import type { AgentExecutionContext } from "../agents/base-agent";
import { MessageList } from "@mastra/core/agent";
import { MastraModelOutput } from "@mastra/core/stream";
import { ChunkFrom } from "@mastra/core/stream";
import type { ChunkType } from "@mastra/core/stream";
import { generateId } from "ai";
import { ReadableStream } from "stream/web";

/**
 * Async generator that yields workflow events as formatted text chunks in real-time.
 *
 * Instead of buffering all workflow output into a string (15-30s), this generator
 * yields each event as it happens, allowing immediate streaming to the user.
 *
 * @param workflow - Workflow definition with execute() and formatEvent()
 * @param context - Agent execution context (history, threadId, path)
 * @yields Formatted text chunks from workflow events
 *
 * @example
 * ```typescript
 * for await (const chunk of workflowToTextStream(workflow, context)) {
 *   // chunk = "\n**[Step 1/3]** Finding projects...\n\n"
 *   // Stream immediately to user
 * }
 * ```
 */
export async function* workflowToTextStream(
  workflow: WorkflowDefinition,
  context: AgentExecutionContext,
  config: StreamingBridgeConfig = DEFAULT_STREAMING_CONFIG
): AsyncGenerator<string> {
  console.error("[StreamingBridge] workflowToTextStream START:", workflow.name);
  const startTime = Date.now();
  const timeoutMs = config.timeoutMs || DEFAULT_STREAMING_CONFIG.timeoutMs!;

  try {
    // Execute workflow and yield formatted text chunks in real-time
    console.error("[StreamingBridge] Starting workflow.execute()");
    for await (const event of workflow.execute(context)) {
      console.error("[StreamingBridge] Received event:", event.type);
      // Check timeout before processing event
      const elapsed = Date.now() - startTime;
      if (elapsed > timeoutMs) {
        console.warn(
          `[StreamingBridge] Workflow timeout after ${elapsed}ms (limit: ${timeoutMs}ms)`
        );
        yield "\n\n⏱️ **Workflow Timeout**\n\n";
        yield `The workflow exceeded the ${timeoutMs / 1000}s time limit. `;
        yield `Partial results are shown above.\n`;
        return; // Stop generator
      }

      // Validate event structure before formatting
      try {
        const validatedEvent = validateWorkflowEvent(event);
        const formattedText = workflow.formatEvent(validatedEvent);

        // Yield text chunk immediately (no buffering)
        yield formattedText;
      } catch (validationError) {
        // Log validation error and yield warning to user
        console.error("[StreamingBridge] Invalid workflow event:", validationError);
        yield "\n\n⚠️ **Validation Error**\n\n";
        yield `An invalid event was encountered during workflow execution.\n`;
        if (validationError instanceof Error) {
          console.error("[StreamingBridge] Validation details:", validationError.message);
        }
        // Continue processing other events
      }
    }
    console.log("[StreamingBridge] Workflow execute() completed");
  } catch (error) {
    // Log error and yield error message to user
    console.error("[StreamingBridge] Workflow execution error:", error);

    yield "\n\n⚠️ **Workflow Error**\n\n";
    yield `An error occurred during workflow execution. Please try again.\n`;

    if (error instanceof Error) {
      yield `\nError: ${error.message}\n`;
    }
  }
}

/**
 * Creates a ReadableStream of text chunks from workflow events.
 *
 * This is a convenience wrapper around workflowToTextStream() that returns
 * a standard ReadableStream for compatibility with web APIs and frameworks
 * that expect ReadableStream<string>.
 *
 * @param workflow - Workflow definition
 * @param context - Agent execution context
 * @returns ReadableStream yielding formatted text chunks
 *
 * @example
 * ```typescript
 * const stream = createWorkflowTextStream(workflow, context);
 * const response = new Response(stream);
 * return response; // Can be returned from API route
 * ```
 */
export function createWorkflowTextStream(
  workflow: WorkflowDefinition,
  context: AgentExecutionContext,
  config: StreamingBridgeConfig = DEFAULT_STREAMING_CONFIG
): ReadableStream<string> {
  const generator = workflowToTextStream(workflow, context, config);

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          controller.enqueue(chunk);
        }
        controller.close();
      } catch (error) {
        console.error("[StreamingBridge] ReadableStream error:", error);
        controller.error(error);
      }
    },
  });
}

/**
 * Type guard to check if an error is related to streaming timeouts
 */
export function isStreamingTimeoutError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const timeoutPatterns = [
    /timeout/i,
    /timed\s+out/i,
    /exceeded.*time/i,
    /time.*exceeded/i,
    /aborted/i,
  ];

  return timeoutPatterns.some(pattern => pattern.test(error.message));
}

/**
 * Streaming bridge configuration options
 */
export interface StreamingBridgeConfig {
  /**
   * Maximum time to wait for workflow completion (milliseconds)
   * @default 28000 (28 seconds - safe margin before Vercel's 30s timeout)
   */
  timeoutMs?: number;

  /**
   * Enable verbose logging for debugging
   * @default false
   */
  debug?: boolean;
}

/**
 * Default streaming bridge configuration
 */
export const DEFAULT_STREAMING_CONFIG: StreamingBridgeConfig = {
  timeoutMs: 28000, // 28s (safe margin before Vercel's 30s timeout)
  debug: false,
};

/**
 * Creates an AI SDK v5 compatible stream wrapper for workflow text output.
 *
 * This bypasses the LLM entirely and streams workflow-formatted text directly
 * to the user. Compatible with Mastra's AISDKV5OutputStream interface via
 * the toUIMessageStreamResponse() method.
 *
 * @param workflow - Workflow definition
 * @param context - Agent execution context
 * @returns Object with toUIMessageStreamResponse() method for API routes
 *
 * @example
 * ```typescript
 * // In coordinator.ts executeWorkflowStream()
 * const workflowStream = createWorkflowAISDKStream(workflow, context);
 * return workflowStream; // Returns AISDKV5OutputStream-compatible object
 * ```
 */
export function createWorkflowAISDKStream(
  workflow: WorkflowDefinition,
  context: AgentExecutionContext,
  config: StreamingBridgeConfig = DEFAULT_STREAMING_CONFIG
) {
  console.error("[StreamingBridge] createWorkflowAISDKStream START:", workflow.name);

  // 1. Create MessageList from context.history
  const messageList = new MessageList({ threadId: context.threadId });
  messageList.add(context.history, "input");
  console.error("[StreamingBridge] MessageList created with", context.history.length, "messages");

  // 2. Create ReadableStream<ChunkType> from workflow text stream
  const messageId = generateId();
  const chunkStream = new ReadableStream<ChunkType<undefined>>({
    async start(controller) {
      console.error("[StreamingBridge] Chunk stream starting, messageId:", messageId);

      try {
        // Stream text-delta chunks from workflow events
        for await (const textChunk of workflowToTextStream(workflow, context, config)) {
          console.error("[StreamingBridge] Received workflow text chunk:", textChunk.substring(0, 100));

          // Enqueue text-delta chunk
          controller.enqueue({
            runId: context.threadId,
            from: ChunkFrom.WORKFLOW,
            type: "text-delta",
            payload: {
              id: messageId,
              text: textChunk,
            },
          } as ChunkType);

          console.error("[StreamingBridge] Enqueued text-delta chunk");
        }

        console.error("[StreamingBridge] Workflow text stream completed");

        // Send finish chunk (let downstream handle messages from original context)
        controller.enqueue({
          runId: context.threadId,
          from: ChunkFrom.WORKFLOW,
          type: "finish",
          payload: {
            stepResult: {
              reason: "stop",
              warnings: [],
              isContinued: false,
            },
            output: {
              usage: {
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
              },
            },
            metadata: {},
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any, // Type cast to bypass strict payload typing
        });

        console.error("[StreamingBridge] Enqueued finish chunk");
        controller.close();
        console.error("[StreamingBridge] Chunk stream closed");
      } catch (error) {
        console.error("[StreamingBridge] Chunk stream error:", error);
        controller.error(error);
      }
    },
  });

  // 3. Create MastraModelOutput wrapping the chunk stream
  const modelOutput = new MastraModelOutput({
    model: {
      modelId: "workflow",
      provider: "workflow",
      version: "v2" as const,
    },
    stream: chunkStream,
    messageList,
    options: {
      runId: context.threadId,
    },
    messageId,
  });

  console.error("[StreamingBridge] MastraModelOutput created");
  console.error("[StreamingBridge] Returning AISDKV5OutputStream via .aisdk.v5 getter");

  // 4. Return proper AISDKV5OutputStream instance via .aisdk.v5 getter
  return modelOutput.aisdk.v5;
}
