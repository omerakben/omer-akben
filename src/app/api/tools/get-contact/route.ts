import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        contact: {
          email: "hello@omerakben.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          linkedin: "https://linkedin.com/in/omerakben",
          github: "https://github.com/omerakben",
          twitter: "https://twitter.com/omerakben",
        },
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
