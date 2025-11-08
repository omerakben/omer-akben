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
import { executeWorkflow, workflowRegistry } from "@/lib/mastra/workflows";
import type { SystemMessage } from "@mastra/core/llm";
import type { AISDKV5OutputStream } from "@mastra/core/stream";
import type { UIMessage } from "ai";

const BASE_PROMPT = `You are the coordinator for Omer Akben's multi-agent assistant. Your job is to classify intent and select the best specialist agent.
If the query is ambiguous, choose the safest agent that can help or ask a clarifying question.`;

type PortfolioIntent =
  | "resume"
  | "projects"
  | "contact"
  | "navigation"
  | "performance";

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
  if (/project|portfolio|work|case study|build/.test(normalized)) {
    return "projects";
  }
  if (
    process.env.ENABLE_CONTACT_COLLECTION === "true" &&
    /contact|email|reach|hire|connect/.test(normalized)
  ) {
    return "contact";
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
        content: BASE_PROMPT,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext) {
    return this.buildInstructionMessage(context, BASE_PROMPT);
  }

  async route(
    context: AgentExecutionContext
  ): Promise<AISDKV5OutputStream | null> {
    const query = extractLatestUserText(context.history);

    // Check for workflow match first (before single-agent routing)
    const workflow = workflowRegistry.detect(query);
    if (workflow) {
      return this.executeWorkflowStream(workflow, context);
    }

    // Fall back to single-agent routing
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

  /**
   * Execute a workflow and convert to AI SDK stream
   *
   * Note: This currently collects all workflow output before streaming.
   * Future optimization: Stream workflow events in real-time.
   */
  private async executeWorkflowStream(
    workflow: import("@/lib/mastra/workflows").WorkflowDefinition,
    context: AgentExecutionContext
  ): Promise<AISDKV5OutputStream> {
    // Collect workflow output
    let workflowOutput = "";
    for await (const chunk of executeWorkflow(workflow, context)) {
      workflowOutput += chunk;
    }

    // Create a user message requesting presentation of the workflow results
    const workflowMessages: UIMessage[] = [
      {
        id: `workflow-user-${Date.now()}`,
        role: "user" as const,
        parts: [
          {
            type: "text" as const,
            text: "Present the workflow results that follow.",
          },
        ],
      },
    ];

    // Use the coordinator agent to stream the workflow output
    // Pass workflow output as system instructions, not as a message
    // Note: Memory parameter removed to prevent Mastra's auto-injection of "prepare-memory-step"
    // which was causing intermittent "Invalid system message format" errors
    const stream = await this.stream(workflowMessages, {
      instructions: {
        role: "system",
        content: `Present the following pre-formatted workflow results exactly as provided, without modification or additional commentary:\n\n${workflowOutput}`,
      },
      // Memory removed - workflow results are pre-formatted and don't need memory context
      format: "aisdk" as const,
    });

    return stream as AISDKV5OutputStream;
  }
}

export const coordinatorAgent = new CoordinatorAgent();
export { classifyIntent };
