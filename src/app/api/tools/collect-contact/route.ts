import { collectContact } from "@/lib/tools/implementations/collect-contact";
import { NextResponse } from "next/server";

/**
 * Collect Contact API Route
 *
 * Handles contact information collection for visitors interested in connecting with Omer.
 * Protected by feature flag: ENABLE_CONTACT_COLLECTION
 *
 * POST /api/tools/collect-contact
 * Body: { name, email, purpose, company?, notes?, preferredTime? }
 *
 * Features:
 * - Email validation (format + disposable domain detection)
 * - Rate limiting (1 per email/IP per 24h via Redis)
 * - Redis persistence (7-day TTL with PII redaction)
 * - Zoom link email delivery via Resend
 */
export async function POST(req: Request) {
  // Feature flag check
  if (process.env.ENABLE_CONTACT_COLLECTION !== "true") {
    return NextResponse.json(
      {
        success: false,
        error: "Contact collection is currently disabled",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();

    // Execute the collect_contact tool
    // Note: Not providing toolCallId so rate limiting uses email-based keys
    const result = await collectContact.execute!(body, {
      messages: [],
    } as any);

    // Check if result has success property and handle accordingly
    if (typeof result === "object" && result !== null && "success" in result) {
      const response = result as { success: boolean; error?: string };
      if (!response.success) {
        return NextResponse.json(result, { status: 400 });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[collect-contact] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Contact collection failed",
      },
      { status: 500 }
    );
  }
}

// Support GET for health check
export async function GET() {
  if (process.env.ENABLE_CONTACT_COLLECTION !== "true") {
    return NextResponse.json({
      available: false,
      reason: "Feature disabled",
    });
  }

  return NextResponse.json({
    available: true,
    endpoint: "/api/tools/collect-contact",
    method: "POST",
    requiredFields: ["name", "email", "purpose"],
    optionalFields: ["company", "notes", "preferredTime"],
  });
}
