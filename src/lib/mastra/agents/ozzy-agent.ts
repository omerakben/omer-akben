import { buildOzzyKnowledge } from "@/lib/agent-knowledge/builders/ozzy-agent";
import {
  MASTRA_PRIMARY_REASONING,
  MASTRA_PRIMARY_NON_REASONING,
} from "@/lib/ai/model-config";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  downloadResumeTool,
  extractPageSummaryTool,
  listProjectsTool,
  navigatePageTool,
  openProjectTool,
  profilePerformanceTool,
  provideNavigationLinksTool,
  scrollToSectionTool,
  searchProjectsSemanticTool,
} from "@/lib/mastra/tools";
import type { SystemMessage } from "@mastra/core/llm";

// Unified knowledge builder consolidates 5 specialized agents into one
// Token budget: ~53,000 tokens (shared 6.5K + resume 30K + projects 8K + skills 3K + nav 2.5K + perf 3K)
const FULL_SYSTEM_PROMPT = buildOzzyKnowledge();

class OzzyAgent extends BasePortfolioAgent<"ozzy"> {
  constructor() {
    super({
      id: "ozzy",
      name: "ozzy",
      description:
        "Unified AI assistant with comprehensive knowledge across resume, projects, skills, navigation, and performance domains. Handles all portfolio-related queries except contact collection.",
      model: MASTRA_PRIMARY_REASONING,
      instructions: {
        role: "system",
        content: FULL_SYSTEM_PROMPT,
      },
      tools: {
        // Projects domain tools
        search_projects_semantic: searchProjectsSemanticTool,
        list_projects: listProjectsTool,
        open_project: openProjectTool,

        // Resume domain tools
        download_resume: downloadResumeTool,

        // Navigation domain tools
        navigate_page: navigatePageTool,
        scroll_to_section: scrollToSectionTool,
        extract_page_summary: extractPageSummaryTool,

        // Performance domain tools
        profile_performance: profilePerformanceTool,

        // Universal tool (always available)
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

// Export reasoning agent (for complex queries requiring deep analysis)
export const ozzyAgent = new OzzyAgent();

// Export fast agent (for simple factual lookups - 70-85% faster)
export const ozzyFastAgent = new (class extends OzzyAgent {
  constructor() {
    super();
    // Override model to use non-reasoning variant
    this.model = MASTRA_PRIMARY_NON_REASONING;
  }
})();

export const buildOzzyInstructions = (context: AgentExecutionContext) =>
  ozzyAgent.buildInstructions(context);

// Export classifier for coordinator to use
export { classifyQuery } from "@/lib/ai/query-classifier";
