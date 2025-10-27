/**
 * Workflow Registry
 *
 * Central registry for all available workflows
 */

import { interviewPrepWorkflow } from "./interview-prep";
import { projectComparisonWorkflow } from "./project-comparison";
import { WorkflowRegistry } from "./types";

// Create and populate registry
export const workflowRegistry = new WorkflowRegistry();
workflowRegistry.register(interviewPrepWorkflow);
workflowRegistry.register(projectComparisonWorkflow);

// Export workflow executor
export { executeWorkflow } from "./workflow-executor";

// Export types
export type { WorkflowDefinition, WorkflowEvent } from "./types";
