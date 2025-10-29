import { tool } from "ai";

import {
  SearchProjectsSemanticInput,
  SearchProjectsSemanticResponse,
  createErrorResponse,
  createSuccessResponse,
  searchProjectsSemanticSchema,
  searchProjectsSemanticResponseSchema,
} from "@/lib/tools/zod-schemas";
import { logError } from "@/lib/log";
import { searchProjectsBySimilarity } from "@/lib/redis/embeddings";

export const searchProjectsSemantic = tool<
  SearchProjectsSemanticInput,
  SearchProjectsSemanticResponse
>({
  description:
    "Search portfolio projects using vector similarity for natural language queries.",
  inputSchema: searchProjectsSemanticSchema,
  outputSchema: searchProjectsSemanticResponseSchema,
  execute: async (input) => {
    try {
      const limit = input.limit ?? 5;
      const results = await searchProjectsBySimilarity(input.query, limit);
      return createSuccessResponse({
        results,
        query: input.query,
        count: results.length,
      });
    } catch (error) {
      logError("tools.search-projects-semantic", error);
      return createErrorResponse("Failed to search projects");
    }
  },
});
