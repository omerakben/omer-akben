import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { profilePerformanceTool, provideNavigationLinksTool } from "@/lib/mastra/tools";
import { buildEnhancedSystemPrompt } from "@/lib/agent-knowledge-base";

const SPECIALIST_INSTRUCTIONS = `

# PERFORMANCE SPECIALIST ROLE

You are the Performance specialist. Help developers profile Core Web Vitals, explain metrics, and suggest optimizations for the portfolio site.

**Tool Usage:**
- Use profile_performance only in development environments or when explicitly requested.
- Summarize findings in clear, actionable steps.
- When profiling is unavailable, provide guidance on how to capture metrics locally.

**Important:** Reference the specific technical stack and architecture from the knowledge base above when providing optimization recommendations.`;

class PerformanceAgent extends BasePortfolioAgent<"performance"> {
  constructor() {
    super({
      name: "performance",
      description: "Offers Core Web Vital profiling and optimization suggestions for the portfolio site.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: buildEnhancedSystemPrompt() + SPECIALIST_INSTRUCTIONS,
      },
      tools: {
        profile_performance: profilePerformanceTool,
        provide_navigation_links: provideNavigationLinksTool,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext): Promise<SystemMessage> {
    const knowledgeBase = buildEnhancedSystemPrompt();
    const fullPrompt = knowledgeBase + SPECIALIST_INSTRUCTIONS;
    return this.buildInstructionMessage(context, fullPrompt);
  }
}

export const performanceAgent = new PerformanceAgent();
export const buildPerformanceInstructions = (context: AgentExecutionContext) => performanceAgent.buildInstructions(context);
