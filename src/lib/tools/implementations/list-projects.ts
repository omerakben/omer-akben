import { tool } from "ai";
import { projects } from "@/data/projects";
import {
  listProjectsInputSchema,
  listProjectsOutputSchema,
  type ListProjectsInput,
  type ListProjectsOutput,
} from "@/lib/tools/zod-schemas";

export function listProjects(
  input: ListProjectsInput
): ListProjectsOutput {
  const category = input.category ?? "all";
  const featured = input.featured;
  const limit = input.limit;

  let filtered = projects;

  if (category !== "all") {
    filtered = filtered.filter((project) => project.category === category);
  }

  if (typeof featured === "boolean") {
    filtered = filtered.filter((project) => project.featured === featured);
  }

  const total = filtered.length;
  const sliceLimit = limit ? Math.min(limit, filtered.length) : filtered.length;

  return {
    projects: filtered.slice(0, sliceLimit),
    total,
  };
}

export const listProjectsTool = tool({
  name: "list_projects",
  description:
    "List portfolio projects with optional category, featured flag, and limit filters.",
  inputSchema: listProjectsInputSchema,
  outputSchema: listProjectsOutputSchema,
  execute: async (input) => listProjects(input),
});
