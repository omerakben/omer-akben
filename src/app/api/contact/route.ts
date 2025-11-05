import { ContactEmail } from "@/lib/email/contact-email-template";
import { contactFormRateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Request validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message too long (max 5000 characters)"),
});

/**
 * POST /api/contact
 *
 * Send contact form email via Resend
 *
 * Rate Limit: 5 requests per 24 hours per IP
 *
 * @body { name, email, subject, message }
 * @returns { success: true }
 */
export async function POST(req: NextRequest) {
  try {
    // Check rate limit
    if (contactFormRateLimit) {
      const ip =
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "anonymous";
      const result = await contactFormRateLimit.limit(ip);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Too many contact form submissions. Please try again tomorrow or use email/LinkedIn directly.",
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": result.limit.toString(),
              "X-RateLimit-Remaining": result.remaining.toString(),
              "X-RateLimit-Reset": new Date(result.reset).toISOString(),
              "Retry-After": Math.ceil(
                (result.reset - Date.now()) / 1000
              ).toString(),
            },
          }
        );
      }
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const { name, email, subject, message } = validatedData;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Omer Akben Portfolio <contact@omerakben.com>",
      to: process.env.OMER_EMAIL || "me@omerakben.com",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      react: ContactEmail({ name, email, subject, message }),
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || "Invalid form data",
        },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    console.error("Contact API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
