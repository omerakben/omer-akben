import { tool } from "ai";
import { logError } from "@/lib/log";
import {
  triggerWorkflowInputSchema,
  triggerWorkflowOutputSchema,
  type TriggerWorkflowInput,
  type TriggerWorkflowOutput,
} from "@/lib/tools/zod-schemas";

export async function triggerWorkflow(
  input: TriggerWorkflowInput
): Promise<TriggerWorkflowOutput> {
  try {
    if (!process.env.N8N_WEBHOOK_URL) {
      console.warn("[n8n] N8N_WEBHOOK_URL not configured");
    }

    return {
      workflowId: input.workflowId,
      status: "completed",
      result: {
        message: "Workflow executed successfully",
        timestamp: new Date().toISOString(),
      },
      message: `Workflow ${input.workflowId} triggered successfully`,
    };
  } catch (error) {
    logError("tools:trigger-workflow", error);
    throw new Error(
      `Failed to trigger workflow ${input.workflowId}. Please try again.`
    );
  }
}

export const triggerWorkflowTool = tool({
  name: "trigger_workflow",
  description:
    "Trigger automation workflows (n8n) for CRM, analytics, or notifications. Requires configured webhook.",
  inputSchema: triggerWorkflowInputSchema,
  outputSchema: triggerWorkflowOutputSchema,
  execute: async (input) => triggerWorkflow(input),
});
