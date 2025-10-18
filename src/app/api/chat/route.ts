import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, UIMessage, tool } from "ai";
import { z } from "zod";
import { enhancedSystemPrompt } from "@/lib/agent-knowledge-base";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    system: enhancedSystemPrompt,
    temperature: 0.7,
    tools: {
      provide_navigation_links: tool({
        description:
          "Provide clickable navigation buttons for visitors to easily navigate to pages, projects, or external resources. Use this when mentioning projects, portfolio pages, GitHub repos, live demos, or any links that users should be able to click.",
        inputSchema: z.object({
          links: z.array(
            z.object({
              label: z.string(),
              href: z.string(),
              type: z.enum(["internal", "external"]),
            })
          ),
        }),
        execute: async ({ links }) => {
          return {
            success: true,
            data: {
              links,
            },
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
