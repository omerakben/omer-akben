import { tool } from "ai";

import {
  ExtractPageSummaryInput,
  ExtractPageSummaryResponse,
  createSuccessResponse,
  extractPageSummaryInputSchema,
  extractPageSummaryResponseSchema,
} from "@/lib/tools/zod-schemas";

const MOCK_SUMMARY =
  "This page showcases portfolio projects and technical skills. Recent work includes AI/ML solutions, full-stack web applications, and developer tools. Key technologies include Next.js, React, TypeScript, Python, and cloud platforms.";

export const extractPageSummary = tool<
  ExtractPageSummaryInput,
  ExtractPageSummaryResponse
>({
  description: "Summarize the active page content for quick recaps.",
  inputSchema: extractPageSummaryInputSchema,
  outputSchema: extractPageSummaryResponseSchema,
  execute: async (input) => {
    const words = MOCK_SUMMARY.split(" ");
    const limit = input.maxLength ?? 200;
    const summary = words.slice(0, limit).join(" ");
    return createSuccessResponse({
      summary,
      wordCount: Math.min(words.length, limit),
    });
  },
});
