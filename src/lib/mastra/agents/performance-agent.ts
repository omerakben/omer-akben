import { buildPerformanceKnowledge } from "@/lib/agent-knowledge/builders/performance-agent";
import { MASTRA_PRIMARY_REASONING } from "@/lib/ai/model-config";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  profilePerformanceTool,
  provideNavigationLinksTool,
} from "@/lib/mastra/tools";
import type { SystemMessage } from "@mastra/core/llm";

// Modular knowledge builder provides shared knowledge + performance specialization
// Token budget: ~6,450 tokens (shared only - lightweight specialist)
const FULL_SYSTEM_PROMPT = buildPerformanceKnowledge();

class PerformanceAgent extends BasePortfolioAgent<"performance"> {
  constructor() {
    super({
      name: "performance",
      description:
        "Offers Core Web Vital profiling and optimization suggestions for the portfolio site.",
      model: MASTRA_PRIMARY_REASONING,
      instructions: {
        role: "system",
        content: FULL_SYSTEM_PROMPT,
      },
      tools: {
        profile_performance: profilePerformanceTool,
        provide_navigation_links: provideNavigationLinksTool,
      },
    });
  }

  async buildInstructions(
    context: AgentExecutionContext
  ): Promise<SystemMessage> {
    return this.buildInstructionMessage(context, FULL_SYSTEM_PROMPT);
  }
}

export const performanceAgent = new PerformanceAgent();
export const buildPerformanceInstructions = (context: AgentExecutionContext) =>
  performanceAgent.buildInstructions(context);
