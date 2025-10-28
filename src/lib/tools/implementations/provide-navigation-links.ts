import { tool } from "ai";

import {
  ProvideNavigationLinksInput,
  ProvideNavigationLinksResponse,
  provideNavigationLinksInputSchema,
  provideNavigationLinksResponseSchema,
  createSuccessResponse,
} from "@/lib/tools/zod-schemas";

export const provideNavigationLinks = tool<
  ProvideNavigationLinksInput,
  ProvideNavigationLinksResponse
>({
  description:
    "Provide clickable navigation buttons for visitors to move between portfolio sections or external resources.",
  inputSchema: provideNavigationLinksInputSchema,
  outputSchema: provideNavigationLinksResponseSchema,
  execute: async (input) =>
    createSuccessResponse({
      links: input.links.map((link) => ({
        ...link,
        icon: link.icon,
      })),
    }),
});
