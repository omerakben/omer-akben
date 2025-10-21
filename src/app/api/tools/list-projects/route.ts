import { projects } from "@/data/projects";
import { listProjectsInputSchema } from "@/lib/agent-tools/schemas";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Support both GET (with query params) and POST (with JSON body)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category =
      searchParams.get("category") || searchParams.get("tag") || undefined;
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    const input = listProjectsInputSchema.parse({
      category: category || "all",
      featured: featured ? featured === "true" : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    let filteredProjects = projects;

    // Apply category filter
    if (input.category && input.category !== "all") {
      filteredProjects = filteredProjects.filter(
        (p) => p.category === input.category
      );
    }

    // Apply featured filter
    if (input.featured !== undefined) {
      filteredProjects = filteredProjects.filter(
        (p) => p.featured === input.featured
      );
    }

    // Store total before applying limit
    const total = filteredProjects.length;

    // Apply limit
    if (input.limit) {
      filteredProjects = filteredProjects.slice(0, input.limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        projects: filteredProjects,
        total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Invalid request",
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = listProjectsInputSchema.parse(body);

    let filteredProjects = projects;

    // Apply category filter
    if (input.category && input.category !== "all") {
      filteredProjects = filteredProjects.filter(
        (p) => p.category === input.category
      );
    }

    // Apply featured filter
    if (input.featured !== undefined) {
      filteredProjects = filteredProjects.filter(
        (p) => p.featured === input.featured
      );
    }

    // Store total before applying limit
    const total = filteredProjects.length;

    // Apply limit
    if (input.limit) {
      filteredProjects = filteredProjects.slice(0, input.limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        projects: filteredProjects,
        total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Invalid request",
      },
      { status: 400 }
    );
  }
}
