import { NextRequest, NextResponse } from "next/server";
import { downloadResumeInputSchema } from "@/lib/agent-tools/schemas";

export const runtime = "edge";

// File mapping for all resume formats
const FILE_MAP = {
  full: {
    filename: "Omer_Akben_Resume_2025-10.pdf",
    size: 450000, // ~450KB
    format: "pdf",
    googleDriveUrl: "https://drive.google.com/file/d/1FV1rouLFKtQ6o1Z5BKzXaEWBApEyZe7T/view?usp=sharing",
  },
  short: {
    filename: "Omer_Akben_Resume_1pg_2025-10.pdf",
    size: 180000, // ~180KB
    format: "pdf",
    googleDriveUrl: "https://drive.google.com/file/d/1cSN7PJzyyJnQHg9XzJAOWhsfgsqXNysC/view?usp=sharing",
  },
  "two-page": {
    filename: "Omer_Akben_Resume_2pg_2025-10.pdf",
    size: 320000, // ~320KB
    format: "pdf",
    googleDriveUrl: "https://drive.google.com/file/d/1XQQhMjBq5OL0PylySNMCTYLmTVZJR8L9/view?usp=sharing",
  },
  docx: {
    filename: "Omer_Akben_Resume_2025-10.docx",
    size: 85000, // ~85KB
    format: "docx",
    googleDriveUrl: "https://docs.google.com/document/d/1sRe9ST7fCa0-Wqc964ueqPkTS_eJCoaa/edit?usp=drive_link",
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
