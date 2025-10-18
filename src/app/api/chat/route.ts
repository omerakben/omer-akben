import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, UIMessage } from "ai";
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
  });

  return result.toUIMessageStreamResponse();
}
