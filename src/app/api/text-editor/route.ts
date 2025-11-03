import { textEditorRateLimit } from "@/lib/rate-limit";
import { buildEditingMessages } from "@/lib/text-editor/prompts";
import {
  textEditorRequestSchema,
  type TextEditorError,
  type TextEditorResponse,
} from "@/lib/text-editor/schemas";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ZodError } from "zod";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/text-editor
 *
 * AI-powered text editing endpoint
 * Operations: fix_grammar, shorten, lengthen, friendly, professional, concise, custom
 *
 * Rate Limit: 10 requests per minute
 *
 * @body { text: string, operation: TextEditorOperation, customPrompt?: string }
 * @returns { success: true, data: { original, edited, operation } }
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<TextEditorResponse | TextEditorError>> {
  try {
    // Check rate limit
    if (textEditorRateLimit) {
      const ip =
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "anonymous";
      const result = await textEditorRateLimit.limit(ip);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again in a minute.",
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": result.limit.toString(),
              "X-RateLimit-Remaining": result.remaining.toString(),
              "X-RateLimit-Reset": new Date(result.reset).toISOString(),
            },
          }
        );
      }
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = textEditorRequestSchema.parse(body);

    const { text, operation, customPrompt } = validatedData;

    // Validate custom prompt for custom operation
    if (operation === "custom" && !customPrompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Custom prompt is required for custom operation",
        },
        { status: 400 }
      );
    }

    // Build messages for OpenAI
    const messages = buildEditingMessages(text, operation, customPrompt);

    // Call OpenAI API (non-streaming for atomic results)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3, // Consistent, predictable edits
      max_tokens: 1000, // Sufficient for edited text
    });

    // Extract edited text
    const editedText = completion.choices[0]?.message?.content?.trim();

    if (!editedText) {
      return NextResponse.json(
        {
          success: false,
          error: "No response generated from AI model",
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        original: text,
        edited: editedText,
        operation,
      },
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || "Invalid request data",
        },
        { status: 400 }
      );
    }

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", error.message);
      return NextResponse.json(
        {
          success: false,
          error: "AI service error. Please try again.",
        },
        { status: 500 }
      );
    }

    // Handle unexpected errors
    console.error("Text Editor API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
