import { MASTRA_PRIMARY_REASONING } from "@/lib/ai/model-config";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  buildContactInstructions,
  contactAgent,
} from "@/lib/mastra/agents/contact-agent";
import {
  buildOzzyInstructions,
  ozzyAgent,
  ozzyFastAgent,
  classifyQuery,
} from "@/lib/mastra/agents/ozzy-agent";
import type { SystemMessage } from "@mastra/core/llm";
import type { AISDKV5OutputStream } from "@mastra/core/stream";
import type { UIMessage } from "ai";

// Pure regex routing - no LLM knowledge base needed (~5ms latency)
type PortfolioIntent = "ozzy" | "contact";

type AgentRoute = {
  agent: BasePortfolioAgent;
  instructions: (context: AgentExecutionContext) => Promise<SystemMessage>;
};

const baseRoutes: Record<Exclude<PortfolioIntent, "contact">, AgentRoute> = {
  ozzy: { agent: ozzyAgent, instructions: buildOzzyInstructions },
};

const ROUTES: Record<PortfolioIntent, AgentRoute> =
  process.env.ENABLE_CONTACT_COLLECTION === "true"
    ? {
        ...baseRoutes,
        contact: {
          agent: contactAgent,
          instructions: buildContactInstructions,
        },
      }
    : (baseRoutes as Record<PortfolioIntent, AgentRoute>);

function extractLatestUserText(messages: UIMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "user") {
      continue;
    }
    const textPart = message.parts.find((part) => part.type === "text");
    if (textPart && "text" in textPart) {
      return textPart.text;
    }
  }
  return "";
}

/**
 * Classify user intent into routing categories
 *
 * Pure regex-based routing (~5ms latency) - no LLM reasoning needed
 *
 * Routes:
 * - "contact" → Contact Agent (contact collection, email, scheduling)
 * - "ozzy" → OZZY Unified Agent (everything else: resume, projects, skills, navigation, performance)
 */
function classifyIntent(query: string): PortfolioIntent {
  const normalized = query.toLowerCase();

  // Contact patterns: explicit contact requests, email addresses, name introductions
  const contactRegex =
    /\b(contact|email|hire|connect|schedule|meeting|zoom|call|calendly|book|intro call|follow up|talk with|chat with|reach out)\b/;
  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  const nameIntroRegex = /\b(my name is|this is)\b/;

  if (
    process.env.ENABLE_CONTACT_COLLECTION === "true" &&
    (contactRegex.test(normalized) ||
      emailRegex.test(query) ||
      nameIntroRegex.test(normalized))
  ) {
    return "contact";
  }

  // Default to OZZY for all other queries
  // OZZY handles: resume, projects, skills, navigation, performance
  return "ozzy";
}

class CoordinatorAgent extends BasePortfolioAgent<"coordinator"> {
  constructor() {
    super({
      name: "coordinator",
      description:
        "Routes chat queries to the correct specialist agent (OZZY or Contact) using pure regex routing (~5ms latency).",
      model: MASTRA_PRIMARY_REASONING, // Unused - coordinator uses regex routing, not LLM reasoning
      instructions: {
        role: "system",
        content: "Pure regex router - no instructions needed",
      },
    });
  }

  async route(
    context: AgentExecutionContext
  ): Promise<AISDKV5OutputStream | null> {
    const query = extractLatestUserText(context.history);
    console.error("[Coordinator] Query:", query);

    // Route to agent based on intent
    const intent = classifyIntent(query);
    console.error("[Coordinator] Intent:", intent);

    let route = ROUTES[intent];
    if (!route) {
      return null;
    }

    // For OZZY queries, also classify complexity to select appropriate model
    if (intent === "ozzy") {
      const complexity = classifyQuery(query);
      console.error("[Coordinator] Complexity:", complexity);

      // Simple queries (factual lookups) → ozzyFastAgent (70-85% faster)
      // Complex queries (reasoning/analysis) → ozzyAgent (better quality)
      if (complexity === "simple") {
        route = { agent: ozzyFastAgent, instructions: buildOzzyInstructions };
        console.error("[Coordinator] Using ozzyFastAgent (non-reasoning model)");
      } else {
        console.error("[Coordinator] Using ozzyAgent (reasoning model)");
      }
    }

    const instructions = await route.instructions(context);
    const stream = await route.agent.stream(context.history, {
      instructions,
      memory: {
        thread: { id: context.threadId },
        resource: "portfolio-chat",
      },
      format: "aisdk" as const,
      maxSteps: 1, // Prevent duplicate responses - agent should complete in single step
    });

    console.error("[Coordinator] Agent stream created, type:", typeof stream);
    console.error(
      "[Coordinator] Has toUIMessageStreamResponse:",
      !!stream?.toUIMessageStreamResponse
    );
    return stream as AISDKV5OutputStream;
  }
}

export const coordinatorAgent = new CoordinatorAgent();
export { classifyIntent };
