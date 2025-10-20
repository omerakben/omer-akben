import type { AgentExecutionContext } from "@/lib/mastra/agents/base-agent";

/**
 * Workflow event types for streaming progress and content to the UI
 */
export type WorkflowEvent =
  | { type: "progress"; step: number; total: number; message: string }
  | { type: "content"; text: string }
  | { type: "agent-result"; content: string }
  | { type: "complete"; summary: string };

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
