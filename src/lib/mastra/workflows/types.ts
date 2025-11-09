import type { AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { z } from "zod";

/**
 * Workflow event types for streaming progress and content to the UI
 */
export type WorkflowEvent =
  | { type: "progress"; step: number; total: number; message: string }
  | { type: "content"; text: string }
  | { type: "agent-result"; content: string }
  | { type: "complete"; summary: string }
  | { type: "error"; step: number; message: string; canContinue: boolean };

/**
 * Zod schemas for runtime validation of workflow events
 */
const progressEventSchema = z.object({
  type: z.literal("progress"),
  step: z.number().int().positive(),
  total: z.number().int().positive(),
  message: z.string().min(1),
});

const contentEventSchema = z.object({
  type: z.literal("content"),
  text: z.string(),
});

const agentResultEventSchema = z.object({
  type: z.literal("agent-result"),
  content: z.string().min(1),
});

const completeEventSchema = z.object({
  type: z.literal("complete"),
  summary: z.string().min(1),
});

const errorEventSchema = z.object({
  type: z.literal("error"),
  step: z.number().int().positive(),
  message: z.string().min(1),
  canContinue: z.boolean(),
});

/**
 * Union schema for all workflow event types
 */
export const workflowEventSchema = z.discriminatedUnion("type", [
  progressEventSchema,
  contentEventSchema,
  agentResultEventSchema,
  completeEventSchema,
  errorEventSchema,
]);

/**
 * Validates a workflow event against the schema
 * @param event - The event to validate
 * @returns The validated event
 * @throws {z.ZodError} If validation fails
 */
export function validateWorkflowEvent(event: unknown): WorkflowEvent {
  return workflowEventSchema.parse(event);
}

/**
 * Individual workflow step definition
 */
export interface WorkflowStep {
  /** Step name (for logging and debugging) */
  name: string;
  /** Step description shown to user */
  description: string;
  /** Execute the step and return result */
  execute: (context: AgentExecutionContext) => Promise<string>;
}

/**
 * Complete workflow definition with detection and execution logic
 */
export interface WorkflowDefinition {
  /** Workflow unique identifier */
  name: string;
  /** Human-readable description */
  description: string;
  /** Detect if query matches this workflow */
  detect: (query: string) => boolean;
  /** Workflow steps to execute */
  steps: WorkflowStep[];
  /** Execute workflow and stream events */
  execute: (context: AgentExecutionContext) => AsyncGenerator<WorkflowEvent>;
  /** Convert workflow events to formatted text */
  formatEvent: (event: WorkflowEvent) => string;
}

/**
 * Workflow execution result
 */
export interface WorkflowResult {
  workflowName: string;
  steps: Array<{
    name: string;
    result: string;
    duration: number;
  }>;
  totalDuration: number;
  success: boolean;
}

/**
 * Workflow registry for managing available workflows
 */
export class WorkflowRegistry {
  private workflows: Map<string, WorkflowDefinition> = new Map();

  register(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.name, workflow);
  }

  detect(query: string): WorkflowDefinition | null {
    for (const workflow of this.workflows.values()) {
      if (workflow.detect(query)) {
        return workflow;
      }
    }
    return null;
  }

  get(name: string): WorkflowDefinition | undefined {
    return this.workflows.get(name);
  }

  getAll(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }
}
