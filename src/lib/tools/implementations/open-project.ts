import { getProjectBySlug } from "@/data/projects";
import { tool } from "ai";

import {
  OpenProjectInput,
  OpenProjectResponse,
  createErrorResponse,
  createSuccessResponse,
  openProjectInputSchema,
  openProjectResponseSchema,
  projectDetailSchema,
} from "@/lib/tools/zod-schemas";

export const openProject = tool<OpenProjectInput, OpenProjectResponse>({
  description: "Retrieve project details by slug for deep dives.",
  inputSchema: openProjectInputSchema,
  outputSchema: openProjectResponseSchema,
  execute: async (input) => {
    const project = getProjectBySlug(input.slug);
    if (!project) {
      return createErrorResponse(`Project with slug "${input.slug}" not found`);
    }

    return createSuccessResponse({ project: projectDetailSchema.parse(project) });
  },
});
