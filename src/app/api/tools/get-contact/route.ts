import { NextResponse } from "next/server";
import { getContactInfo } from "@/data/facts";

export const runtime = "edge";

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
