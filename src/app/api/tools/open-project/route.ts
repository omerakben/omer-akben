import { getProjectBySlug } from "@/data/projects";
import { openProjectInputSchema } from "@/lib/agent-tools/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: slug",
        },
        { status: 400 }
      );
    }

    const input = openProjectInputSchema.parse({ slug });
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
