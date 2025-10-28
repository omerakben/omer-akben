import { resolveGetContact } from "@/lib/tools/implementations/get-contact";
import { NextResponse } from "next/server";

// Support both GET and POST for agent tool compatibility
export async function GET() {
  try {
    const data = await resolveGetContact({});
    return NextResponse.json({
      success: true,
      data,
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
    const data = await resolveGetContact({});
    return NextResponse.json({
      success: true,
      data,
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
