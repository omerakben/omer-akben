import { downloadResumeInputSchema } from "@/lib/agent-tools/schemas";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// File mapping for all resume formats
const FILE_MAP = {
  full: {
    filename: "Omer_Akben_Resume_2025-10.pdf",
    size: 450000, // ~450KB
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/14kf-JMInLElPHm5kZK20cIKq1Od6CN8r/view?usp=sharing",
  },
  short: {
    filename: "Omer_Akben_Resume_1pg_2025-10.pdf",
    size: 180000, // ~180KB
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1r0vqR3w11_CdIblnEpjFSMXan5n1fRgz/view?usp=sharing",
  },
  "three-page": {
    filename: "Omer_Akben_Resume_3pg_2025-10.pdf",
    size: 400000, // ~400KB (updated size for 3 pages)
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1uPiQseGg7Rk-wkCVf_16wUxjY4k1sOT8/view?usp=sharing",
  },
  docx: {
    filename: "Omer_Akben_Resume_2025-10.docx",
    size: 85000, // ~85KB
    format: "docx",
    googleDriveUrl:
      "https://docs.google.com/document/d/1ifrptY0myCerp5cQkX1sqEA9_jwI1gBftv2Mx4hygY4/edit?usp=sharing",
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
