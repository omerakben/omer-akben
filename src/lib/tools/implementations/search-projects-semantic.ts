import { tool } from "ai";

import {
  SearchProjectsSemanticInput,
  SearchProjectsSemanticResponse,
  createSuccessResponse,
  searchProjectsSemanticSchema,
  searchProjectsSemanticResponseSchema,
} from "@/lib/tools/zod-schemas";
import { logError } from "@/lib/log";
import { searchProjectsBySimilarity } from "@/lib/redis/embeddings";
import { searchProjectsLexical } from "@/lib/tools/implementations/search-projects-lexical";

export const searchProjectsSemantic = tool<
  SearchProjectsSemanticInput,
  SearchProjectsSemanticResponse
>({
  description:
    "Search portfolio projects using vector similarity for natural language queries.",
  inputSchema: searchProjectsSemanticSchema,
  outputSchema: searchProjectsSemanticResponseSchema,
  execute: async (input) => {
    const limit = input.limit ?? 5;

    try {
      const results = await searchProjectsBySimilarity(input.query, limit);
      if (results.length > 0) {
        return createSuccessResponse({
          results,
          query: input.query,
          count: results.length,
        });
      }
    } catch (error) {
      logError("tools.search-projects-semantic", error);
    }

    const lexical = searchProjectsLexical(input.query, limit);
    return createSuccessResponse({
      results: lexical,
      query: input.query,
      count: lexical.length,
    });
  },
});
