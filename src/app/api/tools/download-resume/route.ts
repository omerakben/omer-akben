import { logError } from "@/lib/log";
import { downloadResumeInputSchema } from "@/lib/tools/zod-schemas";
import { NextRequest, NextResponse } from "next/server";

// File mapping for resume format
const FILE_MAP = {
  resume: {
    filename: "Omer_Akben_Resume.pdf",
    size: 88320, // ~86.3KB (88KB)
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1_Q4LEz9emCn2FpR5Mbw9eSi62Rs1HOYw/view?usp=sharing",
  },
} as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "resume";

    const input = downloadResumeInputSchema.parse({ format });
    const fileInfo = FILE_MAP[input.format as keyof typeof FILE_MAP];

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
    logError("tools/download-resume:GET", error);
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
    logError("tools/download-resume:POST", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Invalid request",
      },
      { status: 400 }
    );
  }
}
