import { buildProjectKnowledge } from "@/lib/agent-knowledge/builders/project-agent";
import { MASTRA_PRIMARY_REASONING } from "@/lib/ai/model-config";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  listProjectsTool,
  openProjectTool,
  provideNavigationLinksTool,
  searchProjectsSemanticTool,
} from "@/lib/mastra/tools";
import type { SystemMessage } from "@mastra/core/llm";

// Modular knowledge builder provides shared + projects domain knowledge
// Token budget: ~14,450 tokens (shared 6,450 + projects 8,000)
const FULL_SYSTEM_PROMPT = buildProjectKnowledge();

class ProjectAgent extends BasePortfolioAgent<"project"> {
  constructor() {
    super({
      name: "project",
      description:
        "Helps users explore Omer's portfolio projects and recommend relevant work.",
      model: MASTRA_PRIMARY_REASONING,
      instructions: {
        role: "system",
        content: FULL_SYSTEM_PROMPT,
      },
      tools: {
        search_projects_semantic: searchProjectsSemanticTool,
        list_projects: listProjectsTool,
        open_project: openProjectTool,
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

export const projectAgent = new ProjectAgent();
export const buildProjectInstructions = (context: AgentExecutionContext) =>
  projectAgent.buildInstructions(context);
