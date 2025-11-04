import { logError } from "@/lib/log";
import { coordinatorAgent } from "@/lib/mastra/agents/coordinator";
import { loadThreadMessages } from "@/lib/mastra/memory/checkpointer";
import { extractAndSaveFacts } from "@/lib/memory/fact-extractor";
import { RedisMemoryManager } from "@/lib/memory/redis-memory";
import type { UIMessage } from "ai";
import { z } from "zod";

export const maxDuration = 30;

// Define specific schemas for message parts
const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const toolCallPartSchema = z.object({
  type: z.literal("tool-call"),
  toolCallId: z.string(),
  toolName: z.string(),
  args: z.record(z.string(), z.unknown()),
});

const toolResultPartSchema = z.object({
  type: z.literal("tool-result"),
  toolCallId: z.string(),
  toolName: z.string(),
  result: z.unknown(),
});

const messagePartSchema = z.union([
  textPartSchema,
  toolCallPartSchema,
  toolResultPartSchema,
]);

const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system", "tool"]),
  parts: z.array(messagePartSchema).optional(),
  content: z.union([z.string(), z.array(messagePartSchema)]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const requestSchema = z.object({
  chatId: z.string(),
  message: messageSchema,
  userId: z.string().optional(),
});

const memoryManager = new RedisMemoryManager();

function ensureJsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId");

  if (!chatId) {
    return ensureJsonResponse({ error: "chatId is required" }, 400);
  }

  try {
    const messages = await loadThreadMessages(chatId);
    return ensureJsonResponse({ messages });
  } catch (error) {
    logError("chat:GET", error);
    return ensureJsonResponse({ error: "Failed to load history" }, 500);
  }
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return ensureJsonResponse({ error: "Invalid JSON payload" }, 400);
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return ensureJsonResponse(
      { error: "chatId and message are required" },
      400
    );
  }

  const { chatId, message, userId } = parsed.data;

  try {
    const history = await loadThreadMessages(chatId);
    const userMessage = normalizeToUIMessage(message);
    const messages: UIMessage[] = [...history, userMessage];
    const query = extractMessageText(userMessage);

    const stream = await coordinatorAgent.route({
      query,
      threadId: chatId,
      userId: userId ?? "anonymous",
      history: messages,
    });

    if (!stream) {
      return ensureJsonResponse({ error: "Coordinator unavailable" }, 500);
    }

    return stream.toUIMessageStreamResponse({
      onFinish: async ({ messages: final }) => {
        const finalMessages = final ?? messages;
        const effectiveUserId = userId ?? "anonymous";

        try {
          // Persist conversation memory and extract user facts in parallel
          await Promise.all([
            memoryManager.saveSTM(chatId, finalMessages),
            memoryManager.saveLTM(chatId, finalMessages),
            extractAndSaveFacts(effectiveUserId, finalMessages),
          ]);
        } catch (error) {
          logError("chat:onFinish", error);
        }
      },
    });
  } catch (error) {
    logError("chat:POST", error);
    return ensureJsonResponse({ error: "Failed to process chat request" }, 500);
  }
}

function normalizeToUIMessage(raw: z.infer<typeof messageSchema>): UIMessage {
  if (Array.isArray(raw.parts) && raw.parts.length > 0) {
    return raw as unknown as UIMessage;
  }

  const text = typeof raw.content === "string" ? raw.content : "";
  const role = raw.role === "tool" ? "assistant" : raw.role;

  return {
    id: raw.id,
    role,
    parts: text ? [{ type: "text", text }] : [],
    metadata: raw.metadata,
  } as UIMessage;
}

function extractMessageText(message: UIMessage): string {
  const textParts = message.parts
    .filter(
      (part): part is { type: "text"; text: string } =>
        part.type === "text" && "text" in part
    )
    .map((part) => part.text.trim())
    .filter(Boolean);

  if (textParts.length > 0) {
    return textParts.join("\n");
  }

  if (
    typeof (message as unknown as { content?: unknown }).content === "string"
  ) {
    return ((message as unknown as { content?: string }).content ?? "").trim();
  }

  return "";
}
