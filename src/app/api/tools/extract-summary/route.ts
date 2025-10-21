import { extractPageSummaryInputSchema } from "@/lib/agent-tools/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const maxLength = Number(searchParams.get("maxLength")) || 100;

    const { maxLength: validatedMaxLength } =
      extractPageSummaryInputSchema.parse({ maxLength });

    const mockSummary =
      "This page showcases portfolio projects and technical skills. Recent work includes AI/ML solutions, full-stack web applications, and developer tools. Key technologies include Next.js, React, TypeScript, Python, and cloud platforms.";

    const wordCount = mockSummary.split(" ").length;

    return NextResponse.json({
      success: true,
      data: {
        summary: mockSummary.split(" ").slice(0, validatedMaxLength).join(" "),
        wordCount: Math.min(wordCount, validatedMaxLength),
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { maxLength } = extractPageSummaryInputSchema.parse(body);

    // For MVP, return mock summary
    // Future: Integrate Playwright MCP to extract and summarize page content
    const mockSummary =
      "This page showcases portfolio projects and technical skills. Recent work includes AI/ML solutions, full-stack web applications, and developer tools. Key technologies include Next.js, React, TypeScript, Python, and cloud platforms.";

    const wordCount = mockSummary.split(" ").length;

    return NextResponse.json({
      success: true,
      data: {
        summary: mockSummary.split(" ").slice(0, maxLength).join(" "),
        wordCount: Math.min(wordCount, maxLength),
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
