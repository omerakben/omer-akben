import { NextRequest, NextResponse } from "next/server";
import { getContactInfo } from "@/data/facts";

export async function POST(_request: NextRequest) {
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
