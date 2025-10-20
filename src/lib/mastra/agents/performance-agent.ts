import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { profilePerformanceTool, provideNavigationLinksTool } from "@/lib/mastra/tools";

const BASE_PROMPT = `You are the Performance specialist for the portfolio. Help developers profile Core Web Vitals, explain metrics, and suggest optimizations.
- Use profile_performance only in development environments or when explicitly requested.
- Summarize findings in clear, actionable steps.
- When profiling is unavailable, provide guidance on how to capture metrics locally.`;

class PerformanceAgent extends BasePortfolioAgent<"performance"> {
  constructor() {
    super({
      name: "performance",
      description: "Offers Core Web Vital profiling and optimization suggestions for the portfolio site.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: BASE_PROMPT,
      },
      tools: {
        profile_performance: profilePerformanceTool,
        provide_navigation_links: provideNavigationLinksTool,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext): Promise<SystemMessage> {
    return this.buildInstructionMessage(context, BASE_PROMPT);
  }
}

export const performanceAgent = new PerformanceAgent();
export const buildPerformanceInstructions = (context: AgentExecutionContext) => performanceAgent.buildInstructions(context);
