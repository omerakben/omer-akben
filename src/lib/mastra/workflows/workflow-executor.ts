import type { AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import type { WorkflowDefinition, WorkflowEvent } from "./types";

/**
 * Executes a workflow and yields formatted text chunks
 */
export async function* executeWorkflow(
  workflow: WorkflowDefinition,
  context: AgentExecutionContext
): AsyncGenerator<string> {
  const events = workflow.execute(context);

  for await (const event of events) {
    yield workflow.formatEvent(event);
  }
}

/**
 * Helper to format workflow events as text
 */
export function formatWorkflowEvent(event: WorkflowEvent): string {
  switch (event.type) {
    case "progress":
      return `\n**[Step ${event.step}/${event.total}]** ${event.message}\n\n`;
    case "content":
      return event.text;
    case "agent-result":
      return `\n${event.content}\n`;
    case "complete":
      return `\n\n---\n\n${event.summary}`;
  }
}

/**
 * Helper to create workflow step execution wrapper with timing
 */
export async function executeStepWithTiming(
  stepName: string,
  execute: () => Promise<string>
): Promise<{ result: string; duration: number }> {
  const start = Date.now();
  try {
    const result = await execute();
    const duration = Date.now() - start;
    return { result, duration };
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      result: `Error in step "${stepName}": ${errorMessage}`,
      duration,
    };
  }
}
