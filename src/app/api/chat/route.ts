import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, UIMessage, tool } from "ai";
import { RedisSaver } from "@langchain/langgraph-checkpoint-redis";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { enhancedSystemPrompt } from "@/lib/agent-knowledge-base";
import {
  navigatePageInputSchema,
  scrollToSectionInputSchema,
  extractPageSummaryInputSchema,
  triggerWorkflowInputSchema,
  profilePerformanceInputSchema,
} from "@/lib/agent-tools/schemas";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const checkpointer = new RedisSaver(redis);

async function loadHistory(chatId: string) {
  const checkpoint = await checkpointer.get({
    configurable: { thread_id: chatId },
  });

  return (checkpoint?.channel_values?.messages as UIMessage[] | undefined) ?? [];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId");

  if (!chatId) {
    return new Response(JSON.stringify({ error: "chatId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const messages = await loadHistory(chatId);
    return Response.json({ messages });
  } catch (error) {
    console.error("[ChatRoute] Failed to load history", error);
    return new Response(JSON.stringify({ error: "Failed to load history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { chatId, message } = body as { chatId?: string; message?: UIMessage };

  if (!chatId || !message) {
    return new Response(JSON.stringify({ error: "chatId and message are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const history = await loadHistory(chatId);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: convertToModelMessages([...history, message]),
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
        navigate_page: tool({
          description:
            "Navigate to a specific page on omerakben.com. Use this when user explicitly requests to navigate or when context requires page transition.",
          inputSchema: navigatePageInputSchema,
          execute: async ({ url, waitUntil }) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/tools/navigate-page`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, waitUntil }),
              }
            );
            return response.json();
          },
        }),
        scroll_to_section: tool({
          description:
            "Scroll to a specific section on the current page using CSS selector or ARIA label. Useful for navigating within long pages.",
          inputSchema: scrollToSectionInputSchema,
          execute: async ({ selector, behavior }) => {
            return {
              success: true,
              data: {
                selector,
                behavior,
                message: `Scrolling to ${selector}`,
              },
            };
          },
        }),
        extract_page_summary: tool({
          description:
            "Extract and summarize the current page content. Use this when user asks 'what is this page about' or needs page overview.",
          inputSchema: extractPageSummaryInputSchema,
          execute: async ({ maxLength }) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/tools/extract-summary`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ maxLength }),
              }
            );
            return response.json();
          },
        }),
        trigger_workflow: tool({
          description:
            "Trigger a backend workflow for CRM updates, email notifications, or analytics events. Use when user submits contact form or requests automated actions.",
          inputSchema: triggerWorkflowInputSchema,
          execute: async ({ workflowId, payload, waitForResult }) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/tools/trigger-workflow`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workflowId, payload, waitForResult }),
              }
            );
            return response.json();
          },
        }),
        ...(process.env.NODE_ENV === "development" && {
          profile_performance: tool({
            description:
              "Profile page performance with Chrome DevTools metrics (LCP, FID, CLS, TTFB). Only available in development mode for debugging.",
            inputSchema: profilePerformanceInputSchema,
            execute: async ({ duration, includeScreenshots }) => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/tools/profile-performance`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ duration, includeScreenshots }),
                }
              );
              return response.json();
            },
          }),
        }),
      },
    });

    result.onFinish(async ({ messages }) => {
      try {
        await checkpointer.put(
          { configurable: { thread_id: chatId } },
          { messages },
          {}
        );
      } catch (error) {
        console.error("[ChatRoute] Failed to persist messages", error);
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[ChatRoute] Failed to process chat request", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
