import { NextRequest, NextResponse } from "next/server";
import { navigatePageSchema, pageMetadata, type PageKey } from "@/lib/agent-tools/navigation-schema";

export const maxDuration = 30;

/**
 * Navigate Page Tool
 *
 * Provides navigation suggestions to the AI agent.
 * The actual navigation happens client-side via the chat interface.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = navigatePageSchema.parse(body);

    const { page, slug, reason } = input;
    const metadata = pageMetadata[page as PageKey];

    // Validate project slug if required
    if ("requiresSlug" in metadata && metadata.requiresSlug && !slug) {
      return NextResponse.json({
        success: false,
        error: "Project slug is required for project-detail page",
      }, { status: 400 });
    }

    // Build the full path
    let fullPath: string = metadata.path;
    if (slug && page === "project-detail") {
      fullPath = fullPath.replace("[slug]", slug);
    }

    return NextResponse.json({
      success: true,
      data: {
        page,
        title: metadata.title,
        description: metadata.description,
        path: fullPath,
        reason,
        // Include navigation instruction for the agent
        instruction: `To help the user navigate, suggest: "You can view this at ${fullPath}"`,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}
