import { NextRequest, NextResponse } from "next/server";
import { listProjectsInputSchema } from "@/lib/agent-tools/schemas";
import { projects } from "@/data/projects";

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

    // Apply limit
    if (input.limit) {
      filteredProjects = filteredProjects.slice(0, input.limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        projects: filteredProjects,
        total: filteredProjects.length,
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
