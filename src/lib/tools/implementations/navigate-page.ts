import { tool } from "ai";
import {
  navigatePageInputSchema,
  navigatePageOutputSchema,
  type NavigatePageInput,
  type NavigatePageOutput,
} from "@/lib/tools/zod-schemas";

const ALLOWED_DOMAINS = ["omerakben.com", "localhost"] as const;

function isAllowedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch (error) {
    return false;
  }
}

export function navigatePage(
  input: NavigatePageInput
): NavigatePageOutput {
  const waitUntil = input.waitUntil ?? "load";

  if (!isAllowedDomain(input.url)) {
    throw new Error("Navigation restricted to omerakben.com domain");
  }

  return {
    url: input.url,
    waitUntil,
    message: `Navigating to ${input.url}`,
  };
}

export const navigatePageTool = tool({
  name: "navigate_page",
  description: "Generate a navigation instruction for supported portfolio URLs.",
  inputSchema: navigatePageInputSchema,
  outputSchema: navigatePageOutputSchema,
  execute: async (input) => navigatePage(input),
});
