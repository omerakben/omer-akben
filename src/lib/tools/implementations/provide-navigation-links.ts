import { tool } from "ai";
import {
  provideNavigationLinksInputSchema,
  provideNavigationLinksOutputSchema,
  type ProvideNavigationLinksInput,
  type ProvideNavigationLinksOutput,
} from "@/lib/tools/zod-schemas";

export function provideNavigationLinks(
  input: ProvideNavigationLinksInput
): ProvideNavigationLinksOutput {
  return { links: input.links };
}

export const provideNavigationLinksTool = tool({
  name: "provide_navigation_links",
  description:
    "Provide clickable navigation buttons for visitors to move between portfolio sections and relevant resources.",
  inputSchema: provideNavigationLinksInputSchema,
  outputSchema: provideNavigationLinksOutputSchema,
  execute: async (input) => provideNavigationLinks(input),
});
