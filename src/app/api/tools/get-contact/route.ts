import { getContactInfo } from "@/data/facts";
import { NextResponse } from "next/server";

// Support both GET and POST for agent tool compatibility
export async function GET() {
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

export async function POST() {
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
