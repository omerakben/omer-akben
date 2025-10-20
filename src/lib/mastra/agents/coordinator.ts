import type { AISDKV5OutputStream } from "@mastra/core/stream";
import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { contactAgent, buildContactInstructions } from "@/lib/mastra/agents/contact-agent";
import { navigationAgent, buildNavigationInstructions } from "@/lib/mastra/agents/navigation-agent";
import { performanceAgent, buildPerformanceInstructions } from "@/lib/mastra/agents/performance-agent";
import { projectAgent, buildProjectInstructions } from "@/lib/mastra/agents/project-agent";
import { resumeAgent, buildResumeInstructions } from "@/lib/mastra/agents/resume-agent";
import type { UIMessage } from "ai";

const BASE_PROMPT = `You are the coordinator for Omer Akben's multi-agent assistant. Your job is to classify intent and select the best specialist agent.
If the query is ambiguous, choose the safest agent that can help or ask a clarifying question.`;

type PortfolioIntent = "resume" | "projects" | "contact" | "navigation" | "performance";

type AgentRoute = {
  agent: BasePortfolioAgent;
  instructions: (context: AgentExecutionContext) => Promise<SystemMessage>;
};

const ROUTES: Record<PortfolioIntent, AgentRoute> = {
  resume: { agent: resumeAgent, instructions: buildResumeInstructions },
  projects: { agent: projectAgent, instructions: buildProjectInstructions },
  contact: { agent: contactAgent, instructions: buildContactInstructions },
  navigation: { agent: navigationAgent, instructions: buildNavigationInstructions },
  performance: { agent: performanceAgent, instructions: buildPerformanceInstructions },
};

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

function classifyIntent(query: string): PortfolioIntent {
  const normalized = query.toLowerCase();
  if (/resume|cv|experience|certification/.test(normalized)) {
    return "resume";
  }
  if (/project|portfolio|work|case study|build/.test(normalized)) {
    return "projects";
  }
  if (/contact|email|reach|hire|connect/.test(normalized)) {
    return "contact";
  }
  if (/navigate|section|scroll|where is|go to|show me the page/.test(normalized)) {
    return "navigation";
  }
  if (/performance|lcp|cls|ttfb|metrics|optimi(s|z)e/.test(normalized)) {
    return "performance";
  }
  return "projects";
}

class CoordinatorAgent extends BasePortfolioAgent<"coordinator"> {
  constructor() {
    super({
      name: "coordinator",
      description: "Routes chat queries to the correct specialist agent and orchestrates responses.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: BASE_PROMPT,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext) {
    return this.buildInstructionMessage(context, BASE_PROMPT);
  }

  async route(context: AgentExecutionContext): Promise<AISDKV5OutputStream | null> {
    const query = extractLatestUserText(context.history);
    const intent = classifyIntent(query);
    const route = ROUTES[intent];

    if (!route) {
      return null;
    }

    const instructions = await route.instructions(context);
    const stream = await route.agent.stream(context.history, {
      instructions,
      memory: {
        thread: { id: context.threadId },
        resource: "portfolio-chat",
      },
      format: "aisdk" as const,
    });

    return stream as AISDKV5OutputStream;
  }
}

export const coordinatorAgent = new CoordinatorAgent();
export { classifyIntent };
