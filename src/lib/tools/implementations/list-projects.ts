import { projects } from "@/data/projects";
import { tool } from "ai";

import {
  ListProjectsInput,
  ListProjectsResponse,
  createSuccessResponse,
  listProjectsInputSchema,
  listProjectsResponseSchema,
  projectSchema,
} from "@/lib/tools/zod-schemas";

export const listProjects = tool<ListProjectsInput, ListProjectsResponse>({
  description: "List portfolio projects with optional category, featured, or limit filters.",
  inputSchema: listProjectsInputSchema,
  outputSchema: listProjectsResponseSchema,
  execute: async (input) => {
    const { category = "all", featured, limit } = input;
    let filtered = projects;

    if (category !== "all") {
      filtered = filtered.filter((project) => project.category === category);
    }

    if (typeof featured === "boolean") {
      filtered = filtered.filter((project) => project.featured === featured);
    }

    const total = filtered.length;
    const bounded = typeof limit === "number" ? filtered.slice(0, limit) : filtered;
    const normalized = bounded.map((project) => projectSchema.parse(project));

    return createSuccessResponse({
      projects: normalized,
      total,
    });
  },
});
