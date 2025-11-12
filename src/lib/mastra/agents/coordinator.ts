import { buildCoordinatorKnowledge } from "@/lib/agent-knowledge/builders/coordinator-agent";
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
  buildNavigationInstructions,
  navigationAgent,
} from "@/lib/mastra/agents/navigation-agent";
import {
  buildPerformanceInstructions,
  performanceAgent,
} from "@/lib/mastra/agents/performance-agent";
import {
  buildProjectInstructions,
  projectAgent,
} from "@/lib/mastra/agents/project-agent";
import {
  buildResumeInstructions,
  resumeAgent,
} from "@/lib/mastra/agents/resume-agent";
import {
  buildSkillsInstructions,
  skillsAgent,
} from "@/lib/mastra/agents/skills-agent";
import { workflowRegistry } from "@/lib/mastra/workflows";
import { createWorkflowAISDKStream } from "@/lib/mastra/workflows/streaming-bridge";
import type { SystemMessage } from "@mastra/core/llm";
import type { AISDKV5OutputStream } from "@mastra/core/stream";
import type { UIMessage } from "ai";

// Modular knowledge builder provides shared + ALL domain knowledge
// Token budget: ~47,450 tokens (comprehensive for workflow presentations)
const FULL_SYSTEM_PROMPT = buildCoordinatorKnowledge();

type PortfolioIntent =
  | "resume"
  | "projects"
  | "contact"
  | "navigation"
  | "performance"
  | "skills";

type AgentRoute = {
  agent: BasePortfolioAgent;
  instructions: (context: AgentExecutionContext) => Promise<SystemMessage>;
};

const baseRoutes: Record<Exclude<PortfolioIntent, "contact">, AgentRoute> = {
  resume: { agent: resumeAgent, instructions: buildResumeInstructions },
  projects: { agent: projectAgent, instructions: buildProjectInstructions },
  navigation: {
    agent: navigationAgent,
    instructions: buildNavigationInstructions,
  },
  performance: {
    agent: performanceAgent,
    instructions: buildPerformanceInstructions,
  },
  skills: { agent: skillsAgent, instructions: buildSkillsInstructions },
};

const ROUTES: Record<PortfolioIntent, AgentRoute> =
  process.env.ENABLE_CONTACT_COLLECTION === "true"
    ? {
        ...baseRoutes,
        contact: { agent: contactAgent, instructions: buildContactInstructions },
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

function classifyIntent(query: string): PortfolioIntent {
  const normalized = query.toLowerCase();
  if (/resume|cv|experience|certification/.test(normalized)) {
    return "resume";
  }

  const contactRegex =
    /contact|email|reach|hire|connect|schedule|meeting|zoom|call|calendly|book|intro call|follow up|talk with|chat with/;
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
  const overviewPattern =
    /skill|stack|tech|technology|expertise|strength|specialize|what do you do|tell me about (yourself|you)|who\s*(are|r)\s*(you|u)|who is omer|background|bio|profile|introduce|introduction|summary of experience|about you|hi\b|hello\b|hey\b/;
  if (overviewPattern.test(normalized)) {
    return "skills";
  }
  if (/project|portfolio|work|case study|build/.test(normalized)) {
    return "projects";
  }
  if (
    /navigate|section|scroll|where is|go to|show me the page/.test(normalized)
  ) {
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
      description:
        "Routes chat queries to the correct specialist agent and orchestrates responses.",
      model: MASTRA_PRIMARY_REASONING,
      instructions: {
        role: "system",
        content: FULL_SYSTEM_PROMPT,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext) {
    return this.buildInstructionMessage(context, FULL_SYSTEM_PROMPT);
  }

  async route(
    context: AgentExecutionContext
  ): Promise<AISDKV5OutputStream | null> {
    const query = extractLatestUserText(context.history);
    console.error("[Coordinator] Query:", query);

    // Check for workflow match first (before single-agent routing)
    const workflow = workflowRegistry.detect(query);
    console.error("[Coordinator] Workflow detected:", workflow?.name || "none");

    if (workflow) {
      console.error("[Coordinator] Executing WORKFLOW stream for:", workflow.name);
      const workflowStream = this.executeWorkflowStream(workflow, context);
      console.error("[Coordinator] Workflow stream created, type:", typeof workflowStream);
      console.error("[Coordinator] Has toUIMessageStreamResponse:", !!workflowStream?.toUIMessageStreamResponse);
      return workflowStream;
    }

    // Fall back to single-agent routing
    const intent = classifyIntent(query);
    console.error("[Coordinator] Executing AGENT stream for intent:", intent);
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

    console.error("[Coordinator] Agent stream created, type:", typeof stream);
    console.error("[Coordinator] Has toUIMessageStreamResponse:", !!stream?.toUIMessageStreamResponse);
    return stream as AISDKV5OutputStream;
  }

  /**
   * Execute a workflow and stream results in real-time
   *
   * Uses streaming bridge to convert workflow events to AI SDK stream immediately,
   * eliminating 15-30s buffering delay and 30s timeout risk.
   */
  private executeWorkflowStream(
    workflow: import("@/lib/mastra/workflows").WorkflowDefinition,
    context: AgentExecutionContext
  ): AISDKV5OutputStream {
    // Stream workflow events in real-time using streaming bridge
    return createWorkflowAISDKStream(workflow, context) as AISDKV5OutputStream;
  }
}

export const coordinatorAgent = new CoordinatorAgent();
export { classifyIntent };
