import { NextResponse } from "next/server";
import { searchProjectsBySimilarity } from "@/lib/redis/embeddings";
import { searchProjectsSemanticSchema } from "@/lib/agent-tools/schemas";

/**
 * POST /api/tools/search-projects-semantic
 *
 * Semantic search for projects using vector similarity
 * Uses OpenAI embeddings + Redis vector search
 *
 * Request body:
 * {
 *   "query": "Show me projects with machine learning",
 *   "limit": 5
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "results": [
 *       {
 *         "slug": "elon-ai-agent",
 *         "score": 0.92,
 *         "project": { ...project fields }
 *       }
 *     ],
 *     "query": "Show me projects with machine learning",
 *     "count": 3
 *   }
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request
    const validation = searchProjectsSemanticSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { query, limit = 5 } = validation.data;

    // Perform semantic search
    const results = await searchProjectsBySimilarity(query, limit);

    return NextResponse.json({
      success: true,
      data: {
        results,
        query,
        count: results.length,
      },
    });
  } catch (error) {
    console.error("[search-projects-semantic] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search projects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
