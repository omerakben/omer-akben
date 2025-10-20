import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { extractPageSummaryTool, navigatePageTool, provideNavigationLinksTool, scrollToSectionTool } from "@/lib/mastra/tools";

const BASE_PROMPT = `You are the Navigation specialist for Omer Akben's portfolio. Help users move through pages, surface relevant sections, and provide quick summaries when needed.
- Use navigate_page for route changes and scroll_to_section for intra-page movements.
- Offer summaries via extract_page_summary when the user asks about the current page content.
- Always include navigation links for clarity.`;

class NavigationAgent extends BasePortfolioAgent<"navigation"> {
  constructor() {
    super({
      name: "navigation",
      description: "Assists users in navigating pages, sections, and summaries across the portfolio.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: BASE_PROMPT,
      },
      tools: {
        navigate_page: navigatePageTool,
        scroll_to_section: scrollToSectionTool,
        extract_page_summary: extractPageSummaryTool,
        provide_navigation_links: provideNavigationLinksTool,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext): Promise<SystemMessage> {
    return this.buildInstructionMessage(context, BASE_PROMPT);
  }
}

export const navigationAgent = new NavigationAgent();
export const buildNavigationInstructions = (context: AgentExecutionContext) => navigationAgent.buildInstructions(context);
