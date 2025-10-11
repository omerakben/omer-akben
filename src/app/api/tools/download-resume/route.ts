import { NextRequest, NextResponse } from "next/server";
import { downloadResumeInputSchema } from "@/lib/agent-tools/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = downloadResumeInputSchema.parse(body);

    const filename = input.format === "full" ? "resume.pdf" : "resume-short.pdf";
    const url = `/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename,
        size: 0, // Would be actual file size in production
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
