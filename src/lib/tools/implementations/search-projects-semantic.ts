import { tool } from "ai";
import { logError } from "@/lib/log";
import { searchProjectsBySimilarity } from "@/lib/redis/embeddings";
import {
  searchProjectsSemanticOutputSchema,
  searchProjectsSemanticSchema,
  type SearchProjectsSemanticInput,
  type SearchProjectsSemanticOutput,
} from "@/lib/tools/zod-schemas";

export async function searchProjectsSemantic(
  input: SearchProjectsSemanticInput
): Promise<SearchProjectsSemanticOutput> {
  try {
    const results = await searchProjectsBySimilarity(
      input.query,
      input.limit ?? 5
    );

    return {
      results,
      query: input.query,
      count: results.length,
    };
  } catch (error) {
    logError("tools:search-projects-semantic", error);
    throw new Error("Failed to search projects. Please try again.");
  }
}

export const searchProjectsSemanticTool = tool({
  name: "search_projects_semantic",
  description:
    "Semantic search across portfolio projects powered by embeddings (Upstash Redis).",
  inputSchema: searchProjectsSemanticSchema,
  outputSchema: searchProjectsSemanticOutputSchema,
  execute: async (input) => searchProjectsSemantic(input),
});
