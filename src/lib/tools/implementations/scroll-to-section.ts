import { tool } from "ai";

import {
  ScrollToSectionInput,
  ScrollToSectionResponse,
  createSuccessResponse,
  scrollToSectionInputSchema,
  scrollToSectionResponseSchema,
} from "@/lib/tools/zod-schemas";

export const scrollToSection = tool<
  ScrollToSectionInput,
  ScrollToSectionResponse
>({
  description:
    "Scroll the current page to a relevant section using CSS selectors or ARIA labels.",
  inputSchema: scrollToSectionInputSchema,
  outputSchema: scrollToSectionResponseSchema,
  execute: async (input) =>
    createSuccessResponse({
      selector: input.selector,
      behavior: input.behavior ?? "smooth",
      message: `Scrolling to ${input.selector}`,
    }),
});
