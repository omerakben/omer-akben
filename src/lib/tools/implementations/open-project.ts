import { tool } from "ai";
import { getProjectBySlug } from "@/data/projects";
import {
  openProjectInputSchema,
  openProjectOutputSchema,
  type OpenProjectInput,
  type OpenProjectOutput,
} from "@/lib/tools/zod-schemas";

export function openProject(input: OpenProjectInput): OpenProjectOutput {
  const project = getProjectBySlug(input.slug);

  if (!project) {
    throw new Error(`Project with slug "${input.slug}" not found`);
  }

  return { project };
}

export const openProjectTool = tool({
  name: "open_project",
  description: "Retrieve the full project payload by slug for deep dives.",
  inputSchema: openProjectInputSchema,
  outputSchema: openProjectOutputSchema,
  execute: async (input) => openProject(input),
});
