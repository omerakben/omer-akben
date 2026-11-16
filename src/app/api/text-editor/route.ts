import { FALLBACK_MODEL, PRIMARY_NON_REASONING_MODEL } from "@/lib/ai/model-config";
import { textEditorRateLimit } from "@/lib/rate-limit";
import { buildEditingMessages } from "@/lib/text-editor/prompts";
import {
  textEditorRequestSchema,
  type TextEditorError,
  type TextEditorResponse,
} from "@/lib/text-editor/schemas";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";
import { ZodError } from "zod";

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

    // Read configuration at request time; prefer the same provider as Ozzy.
    const models = [
      ...(process.env.XAI_API_KEY ? [xai(PRIMARY_NON_REASONING_MODEL)] : []),
      ...(process.env.OPENAI_API_KEY ? [openai.chat(FALLBACK_MODEL)] : []),
    ];
    const messages = buildEditingMessages(text, operation, customPrompt);
    let editedText = "";

    for (const model of models) {
      try {
        const result = await generateText({
          model,
          messages,
          temperature: 0.3,
          maxOutputTokens: 1000,
          maxRetries: 0,
          abortSignal: AbortSignal.timeout(12_000),
        });
        editedText = result.text.trim();
        if (editedText) break;
      } catch {
        // Provider error bodies can contain credentials or submitted text.
        console.warn("Text editor provider unavailable; trying next configured provider.");
      }
    }

    if (!editedText) {
      return NextResponse.json(
        { success: false, error: "Text editing is temporarily unavailable." },
        { status: 503 }
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

    // Do not log raw errors: upstream errors may include sensitive data.
    console.error("Text Editor API request failed");
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
