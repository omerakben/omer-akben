import { getContactInfo } from "@/data/facts";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Support both GET and POST for agent tool compatibility
export async function GET(_req: NextRequest) {
  try {
    const contact = getContactInfo();
    return NextResponse.json({
      success: true,
      data: {
        contact,
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

export async function POST(_req: NextRequest) {
  try {
    const contact = getContactInfo();
    return NextResponse.json({
      success: true,
      data: {
        contact,
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
