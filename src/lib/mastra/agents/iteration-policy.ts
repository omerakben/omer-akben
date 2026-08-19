import { stripToolNarration } from "@/lib/chat/message-utils";

/**
 * Continue the Mastra loop only when this iteration produced no user-visible
 * text. Tool-only first steps (short "Tuel") still continue so
 * EnsureFinalResponseProcessor can force prose.
 *
 * Intro turns stream a full bio, then call provide_navigation_links. A second
 * LLM step rewrites that bio with a short CTA or "[Navigation buttons…]".
 */
export function shouldContinueAfterIteration(iterationText: string): boolean {
  return stripToolNarration(iterationText).length === 0;
}
