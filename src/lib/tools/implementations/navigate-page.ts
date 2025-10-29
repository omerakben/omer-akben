import { tool } from "ai";

import {
  NavigatePageInput,
  NavigatePageResponse,
  createErrorResponse,
  createSuccessResponse,
  navigatePageInputSchema,
  navigatePageResponseSchema,
} from "@/lib/tools/zod-schemas";

const ALLOWED_DOMAINS = ["omerakben.com", "localhost"] as const;

const isAllowedDomain = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

export const navigatePage = tool<NavigatePageInput, NavigatePageResponse>({
  description: "Navigate the visitor to an internal portfolio route.",
  inputSchema: navigatePageInputSchema,
  outputSchema: navigatePageResponseSchema,
  execute: async (input) => {
    if (!isAllowedDomain(input.url)) {
      return createErrorResponse(
        "Navigation restricted to the omerakben.com domain"
      );
    }

    const waitUntil = input.waitUntil ?? "load";
    return createSuccessResponse({
      url: input.url,
      waitUntil,
      message: `Navigating to ${input.url}`,
    });
  },
});
