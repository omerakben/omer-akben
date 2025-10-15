import { downloadResumeInputSchema } from "@/lib/agent-tools/schemas";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// File mapping for resume formats
// Only PDF versions are available for visitors
const FILE_MAP = {
  resume: {
    filename: "Omer_Akben_Resume_3pg_2025-10.pdf",
    size: 128000, // ~128KB
    format: "pdf",
    description: "Standard 3-page resume",
    googleDriveUrl:
      "https://drive.google.com/file/d/1uPiQseGg7Rk-wkCVf_16wUxjY4k1sOT8/view?usp=sharing",
  },
  extended: {
    filename: "Omer_Akben_Resume_2025-10.pdf",
    size: 131000, // ~131KB
    format: "pdf",
    description: "Extended resume with full details",
    googleDriveUrl:
      "https://drive.google.com/file/d/14kf-JMInLElPHm5kZK20cIKq1Od6CN8r/view?usp=sharing",
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = downloadResumeInputSchema.parse(body);

    const fileInfo = FILE_MAP[input.format];
    if (!fileInfo) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid format: ${input.format}`,
        },
        { status: 400 }
      );
    }

    const url = `/assets/${fileInfo.filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename: fileInfo.filename,
        size: fileInfo.size,
        format: fileInfo.format,
        googleDriveUrl: fileInfo.googleDriveUrl,
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
