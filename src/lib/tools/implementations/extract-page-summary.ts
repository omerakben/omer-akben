import { tool } from "ai";
import {
  extractPageSummaryInputSchema,
  extractPageSummaryOutputSchema,
  type ExtractPageSummaryInput,
  type ExtractPageSummaryOutput,
} from "@/lib/tools/zod-schemas";

const MOCK_SUMMARY =
  "This page showcases portfolio projects and technical skills. Recent work includes AI/ML solutions, full-stack web applications, and developer tools. Key technologies include Next.js, React, TypeScript, Python, and cloud platforms.";

export function extractPageSummary(
  input: ExtractPageSummaryInput
): ExtractPageSummaryOutput {
  const maxLength = input.maxLength ?? 200;
  const words = MOCK_SUMMARY.split(" ");
  const summary = words.slice(0, maxLength).join(" ");

  return {
    summary,
    wordCount: Math.min(words.length, maxLength),
  };
}

export const extractPageSummaryTool = tool({
  name: "extract_page_summary",
  description:
    "Summarize the current page content using cached portfolio knowledge (no live crawling).",
  inputSchema: extractPageSummaryInputSchema,
  outputSchema: extractPageSummaryOutputSchema,
  execute: async (input) => extractPageSummary(input),
});
