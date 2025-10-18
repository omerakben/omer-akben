import { NextRequest, NextResponse } from "next/server";
import { provideNavigationLinksInputSchema } from "@/lib/agent-tools/schemas";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { links } = provideNavigationLinksInputSchema.parse(body);

    // Validate and return the navigation links
    return NextResponse.json({
      success: true,
      data: {
        links,
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
