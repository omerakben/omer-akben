import { provideNavigationLinksInputSchema } from "@/lib/agent-tools/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const linksParam = searchParams.get("links");

    if (!linksParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: links",
        },
        { status: 400 }
      );
    }

    // Parse the links array from JSON string
    const links = JSON.parse(linksParam);
    const { links: validatedLinks } = provideNavigationLinksInputSchema.parse({
      links,
    });

    return NextResponse.json({
      success: true,
      data: {
        links: validatedLinks,
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
