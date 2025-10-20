/**
 * Workflow Registry
 *
 * Central registry for all available workflows
 */

import { WorkflowRegistry } from "./types";
import { interviewPrepWorkflow } from "./interview-prep";

// Create and populate registry
export const workflowRegistry = new WorkflowRegistry();
workflowRegistry.register(interviewPrepWorkflow);

// Export workflow executor
export { executeWorkflow } from "./workflow-executor";

// Export types
export type { WorkflowDefinition, WorkflowEvent } from "./types";
