import { downloadCertificateInputSchema } from "@/lib/agent-tools/schemas";
import { NextRequest, NextResponse } from "next/server";

// Certificate mapping for all certificate types
const CERTIFICATE_MAP = {
  aws: {
    filename: "Omer-Akben-AWS-Certificate.pdf",
    size: 250000, // ~250KB
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1wosKaBVPTEsShVnQQWpi28eB40XEHtOD/view?usp=sharing",
    certificateName: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    year: "2022",
  },
  nss: {
    filename: "Omer-Akben-NSS-Certificate.pdf",
    size: 200000, // ~200KB
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1vjwfgNY__4bb3yRa9Ic5LbS_O-fgeFbn/view?usp=sharing",
    certificateName: "Nashville Software School Graduate",
    issuer: "Nashville Software School",
    year: "2025",
  },
} as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: type",
        },
        { status: 400 }
      );
    }

    const input = downloadCertificateInputSchema.parse({ type });
    const certInfo =
      CERTIFICATE_MAP[input.type as keyof typeof CERTIFICATE_MAP];

    if (!certInfo) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid certificate type: ${input.type}`,
        },
        { status: 400 }
      );
    }

    const url = `/assets/${certInfo.filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename: certInfo.filename,
        size: certInfo.size,
        format: certInfo.format,
        googleDriveUrl: certInfo.googleDriveUrl,
        certificateName: certInfo.certificateName,
        issuer: certInfo.issuer,
        year: certInfo.year,
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
    const input = downloadCertificateInputSchema.parse(body);

    const certInfo = CERTIFICATE_MAP[input.type];
    if (!certInfo) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid certificate type: ${input.type}`,
        },
        { status: 400 }
      );
    }

    const url = `/assets/${certInfo.filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename: certInfo.filename,
        size: certInfo.size,
        format: certInfo.format,
        googleDriveUrl: certInfo.googleDriveUrl,
        certificateName: certInfo.certificateName,
        issuer: certInfo.issuer,
        year: certInfo.year,
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
