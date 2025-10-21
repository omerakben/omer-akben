import { searchProjectsSemanticSchema } from "@/lib/agent-tools/schemas";
import { searchProjectsBySimilarity } from "@/lib/redis/embeddings";
import { NextResponse } from "next/server";
import { logError } from "@/lib/log";

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
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const limit = Number(searchParams.get("limit")) || 5;

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: query",
        },
        { status: 400 }
      );
    }

    const validation = searchProjectsSemanticSchema.safeParse({ query, limit });
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request parameters",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const results = await searchProjectsBySimilarity(
      validation.data.query,
      validation.data.limit
    );

    return NextResponse.json({
      success: true,
      data: {
        results,
        query: validation.data.query,
        count: results.length,
      },
    });
  } catch (error) {
    logError("search-projects-semantic:GET", error);
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
    logError("search-projects-semantic:POST", error);
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
