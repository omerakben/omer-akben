import { getMessageText } from "@/lib/chat/message-utils";
import { logError } from "@/lib/log";
import { coordinatorAgent } from "@/lib/mastra/agents/coordinator";
import { extractAndSaveFacts } from "@/lib/memory/fact-extractor";
import { RedisMemoryManager } from "@/lib/memory/redis-memory";
import { generateAndCacheFollowups } from "@/lib/followups/generate-and-cache";
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

const dynamicToolPartSchema = z.object({
  type: z.literal("dynamic-tool"),
  toolName: z.string(),
  toolCallId: z.string(),
  state: z.enum(["input-streaming", "input-available", "output-available", "output-error"]),
  input: z.unknown(),
  output: z.unknown().optional(),
});

const messagePartSchema = z.union([
  textPartSchema,
  toolCallPartSchema,
  dynamicToolPartSchema,
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
    const messages = await memoryManager.loadSTM(chatId);
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
    const history = await memoryManager.loadSTM(chatId);
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

    const response = stream.toUIMessageStreamResponse({
      onFinish: async ({ messages: final }) => {
        // Use final messages only if they're actually populated (not empty array)
        // Empty arrays from workflow finish chunks should fall back to original messages
        const finalMessages = (final && final.length > 0) ? final : messages;
        const effectiveUserId = userId ?? "anonymous";

        try {
          // Auto-inject navigation links if appropriate
          const lastMessage = finalMessages[finalMessages.length - 1];
          if (lastMessage) {
            injectNavigationLinksIfNeeded(lastMessage);
          }

          // Persist conversation memory, extract facts, and generate follow-ups in parallel
          await Promise.all([
            memoryManager.saveSTM(chatId, finalMessages),
            memoryManager.saveLTM(chatId, finalMessages),
            extractAndSaveFacts(effectiveUserId, finalMessages),
            generateAndCacheFollowups({
              threadId: chatId,
              userId: effectiveUserId,
              messages: finalMessages,
            }),
          ]);
        } catch (error) {
          logError("chat:onFinish", error);
        }
      },
    });

    return response;
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

const extractMessageText = getMessageText;

/**
 * Detects if the response text mentions navigable content that should include navigation links
 */
function shouldProvideNavigationLinks(text: string): boolean {
  const navigationKeywords = [
    /\bproject/i,
    /\bskills?\b/i,
    /\bportfolio\b/i,
    /\bjourney\b/i,
    /\bexperience\b/i,
    /\bwork\b/i,
    /\bcareer\b/i,
    /\bcontact/i,
    /\bresume\b/i,
    /\bCV\b/,
    /\bcertificate/i,
    /\bexplore/i,
    /\bcheck out\b/i,
    /\btake a look\b/i,
    /\bview\b/i,
    /\bsee\b/i,
  ];

  return navigationKeywords.some((pattern) => pattern.test(text));
}

/**
 * Generates navigation links based on the response content
 */
function generateNavigationLinks(text: string): Array<{
  label: string;
  href: string;
  type: "internal" | "external";
  icon?: string;
}> {
  const links: Array<{
    label: string;
    href: string;
    type: "internal" | "external";
    icon?: string;
  }> = [];

  // Detect project mentions
  if (/\bprojects?\b/i.test(text)) {
    links.push({
      label: "View Projects",
      href: "/projects",
      type: "internal",
      icon: "briefcase",
    });
  }

  // Detect skills mentions
  if (/\bskills?\b/i.test(text)) {
    links.push({
      label: "View Skills",
      href: "/skills",
      type: "internal",
      icon: "zap",
    });
  }

  // Detect journey/experience mentions
  if (/\b(journey|career|experience)\b/i.test(text)) {
    links.push({
      label: "Career Journey",
      href: "/journey",
      type: "internal",
      icon: "arrow-right",
    });
  }

  // Detect contact mentions
  if (/\bcontact\b/i.test(text)) {
    links.push({
      label: "Contact Me",
      href: "/contact",
      type: "internal",
      icon: "mail",
    });
  }

  // Detect resume mentions
  if (/\b(resume|cv)\b/i.test(text)) {
    links.push({
      label: "Download Resume",
      href: "/resume",
      type: "internal",
      icon: "file-text",
    });
  }

  // Remove duplicates by href
  const uniqueLinks = links.filter(
    (link, index, self) =>
      index === self.findIndex((l) => l.href === link.href)
  );

  return uniqueLinks;
}

/**
 * Injects navigation link tool call into assistant message if appropriate
 */
function injectNavigationLinksIfNeeded(message: UIMessage): void {
  try {
    if (message.role !== "assistant" || !message.parts) {
      return;
    }

    // Check if AI already provided navigation links (via tool call or text)
    const hasNavigationLinks = message.parts.some((part) => {
      if (!("type" in part) || typeof part.type !== "string") {
        return false;
      }

      // Check for direct tool-specific type
      if (part.type === "tool-provide_navigation_links") {
        return true;
      }

      // Check for tool-call with navigation tool name (AI-generated)
      if (part.type === "tool-call" && "toolName" in part) {
        const toolName = (part as { toolName?: string }).toolName;
        return toolName === "provide_navigation_links";
      }

      // Check for dynamic-tool or tool-result with navigation tool name
      if (
        (part.type === "dynamic-tool" || part.type === "tool-result") &&
        "toolName" in part
      ) {
        const toolName = (part as { toolName?: string }).toolName;
        return toolName === "provide_navigation_links";
      }

      return false;
    });

    if (hasNavigationLinks) {
      return; // Already has navigation links, don't inject
    }

    // Extract text content
    const textContent = message.parts
      .filter((part) => "type" in part && part.type === "text")
      .map((part) => ("text" in part ? part.text : ""))
      .join("");

    // Check if text already contains explicit navigation link references
    const hasTextNavigationLinks = /\b(Skills Page|Projects Page|Career Journey|Contact Me|Download Resume)\b/i.test(textContent);

    if (hasTextNavigationLinks) {
      return; // Text already has navigation references, don't inject
    }

    // Check if should provide navigation links
    if (!shouldProvideNavigationLinks(textContent)) {
      return;
    }

    // Generate navigation links
    const links = generateNavigationLinks(textContent);

    if (links.length === 0) {
      return;
    }

    // Inject tool result part
    const toolCallId = `nav-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    message.parts.push({
      type: "dynamic-tool",
      toolName: "provide_navigation_links",
      toolCallId,
      state: "output-available",
      input: {},
      output: {
        success: true,
        data: { links },
      },
    } as MessagePart);
  } catch (error) {
    // Log error but don't break the chat flow
    console.error("[injectNavigationLinksIfNeeded] Error:", error);
  }
}

type MessagePart = NonNullable<UIMessage["parts"]>[number];
