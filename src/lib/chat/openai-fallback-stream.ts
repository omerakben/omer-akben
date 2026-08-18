import { FALLBACK_MODEL } from "@/lib/ai/model-config";
import { getMessageText } from "@/lib/chat/message-utils";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  type ModelMessage,
  type UIMessage,
} from "ai";

export function toModelMessages(messages: UIMessage[]): ModelMessage[] {
  return messages
    .filter(
      (message): message is UIMessage & { role: "user" | "assistant" | "system" } =>
        message.role === "user" ||
        message.role === "assistant" ||
        message.role === "system"
    )
    .map((message) => ({
      role: message.role,
      content: getMessageText(message),
    }))
    .filter((message) => message.content.trim().length > 0);
}

export async function streamChatWithOpenAIFallback(options: {
  messages: UIMessage[];
  system: string;
  onFinish: (messages: UIMessage[]) => Promise<void>;
}): Promise<Response> {
  const modelMessages = toModelMessages(options.messages);

  if (modelMessages.length === 0) {
    throw new Error("No message to send");
  }

  const result = streamText({
    model: openai(FALLBACK_MODEL),
    system: options.system,
    messages: modelMessages,
    temperature: 0.5,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: options.messages,
    onFinish: async ({ messages }) => {
      const effectiveMessages =
        messages && messages.length > 0 ? messages : options.messages;
      await options.onFinish(effectiveMessages);
    },
  });
}
