import { NextRequest, NextResponse } from "next/server";
import { openProjectInputSchema } from "@/lib/agent-tools/schemas";
import { getProjectBySlug } from "@/data/projects";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = openProjectInputSchema.parse(body);

    const project = getProjectBySlug(input.slug);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: `Project with slug "${input.slug}" not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        project,
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
