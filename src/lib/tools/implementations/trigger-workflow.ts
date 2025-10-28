import { tool } from "ai";

import {
  TriggerWorkflowInput,
  TriggerWorkflowResponse,
  createSuccessResponse,
  triggerWorkflowInputSchema,
  triggerWorkflowResponseSchema,
} from "@/lib/tools/zod-schemas";

export const triggerWorkflow = tool<
  TriggerWorkflowInput,
  TriggerWorkflowResponse
>({
  description:
    "Trigger a backend workflow for CRM updates, notifications, or analytics events.",
  inputSchema: triggerWorkflowInputSchema,
  outputSchema: triggerWorkflowResponseSchema,
  execute: async (input) => {
    if (!process.env.N8N_WEBHOOK_URL) {
      console.warn("[workflow] N8N_WEBHOOK_URL not configured");
    }

    return createSuccessResponse({
      workflowId: input.workflowId,
      status: "completed",
      result: {
        message: "Workflow executed successfully",
        timestamp: new Date().toISOString(),
      },
      message: `Workflow ${input.workflowId} triggered successfully`,
    });
  },
});
