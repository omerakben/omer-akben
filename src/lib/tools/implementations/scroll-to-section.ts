import { tool } from "ai";
import {
  scrollToSectionInputSchema,
  scrollToSectionOutputSchema,
  type ScrollToSectionInput,
  type ScrollToSectionOutput,
} from "@/lib/tools/zod-schemas";

export function scrollToSection(
  input: ScrollToSectionInput
): ScrollToSectionOutput {
  const behavior = input.behavior ?? "smooth";
  return {
    selector: input.selector,
    behavior,
    message: `Scrolling to ${input.selector}`,
  };
}

export const scrollToSectionTool = tool({
  name: "scroll_to_section",
  description:
    "Create a scroll instruction for the current page based on a CSS selector or ARIA label.",
  inputSchema: scrollToSectionInputSchema,
  outputSchema: scrollToSectionOutputSchema,
  execute: async (input) => scrollToSection(input),
});
