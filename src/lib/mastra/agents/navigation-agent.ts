import { buildEnhancedSystemPrompt } from "@/lib/agent-knowledge-base";
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

const SPECIALIST_INSTRUCTIONS = `

# NAVIGATION SPECIALIST ROLE

You are the Navigation specialist. Help users move through pages, surface relevant sections, and provide quick summaries when needed.

**Tool Usage:**
- Use navigate_page for route changes and scroll_to_section for intra-page movements.
- Offer summaries via extract_page_summary when the user asks about the current page content.
- Always include navigation links for clarity.

**Important:** Use the specific page structure and section information from the knowledge base above to provide accurate navigation guidance.`;

const FULL_SYSTEM_PROMPT =
  buildEnhancedSystemPrompt() + SPECIALIST_INSTRUCTIONS;

class NavigationAgent extends BasePortfolioAgent<"navigation"> {
  constructor() {
    super({
      name: "navigation",
      description:
        "Assists users in navigating pages, sections, and summaries across the portfolio.",
      model: "openai/gpt-4o-mini",
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
