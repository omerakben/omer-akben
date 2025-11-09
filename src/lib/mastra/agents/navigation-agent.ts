import { buildNavigationKnowledge } from "@/lib/agent-knowledge/builders/navigation-agent";
import { MASTRA_PRIMARY_NON_REASONING } from "@/lib/ai/model-config";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  extractPageSummaryTool,
  navigatePageTool,
  provideNavigationLinksTool,
  scrollToSectionTool,
} from "@/lib/mastra/tools";
import type { SystemMessage } from "@mastra/core/llm";

// Modular knowledge builder provides shared knowledge + navigation specialization
// Token budget: ~6,450 tokens (shared only - lightweight specialist)
const FULL_SYSTEM_PROMPT = buildNavigationKnowledge();

class NavigationAgent extends BasePortfolioAgent<"navigation"> {
  constructor() {
    super({
      name: "navigation",
      description:
        "Assists users in navigating pages, sections, and summaries across the portfolio.",
      model: MASTRA_PRIMARY_NON_REASONING,
      instructions: {
        role: "system",
        content: FULL_SYSTEM_PROMPT,
      },
      tools: {
        navigate_page: navigatePageTool,
        scroll_to_section: scrollToSectionTool,
        extract_page_summary: extractPageSummaryTool,
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

export const navigationAgent = new NavigationAgent();
export const buildNavigationInstructions = (context: AgentExecutionContext) =>
  navigationAgent.buildInstructions(context);
