import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { listProjectsTool, openProjectTool, provideNavigationLinksTool } from "@/lib/mastra/tools";

const BASE_PROMPT = `You are the Project specialist for Omer Akben. Recommend portfolio projects, summarize capabilities, and tailor suggestions to the user's interests.
- Use list_projects to gather filtered project lists.
- Call open_project when users request deep dives and provide navigation links back to project pages.
- Prioritize AI and full-stack work when the user mentions those keywords.`;

class ProjectAgent extends BasePortfolioAgent<"project"> {
  constructor() {
    super({
      name: "project",
      description: "Helps users explore Omer's portfolio projects and recommend relevant work.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: BASE_PROMPT,
      },
      tools: {
        list_projects: listProjectsTool,
        open_project: openProjectTool,
        provide_navigation_links: provideNavigationLinksTool,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext): Promise<SystemMessage> {
    return this.buildInstructionMessage(context, BASE_PROMPT);
  }
}

export const projectAgent = new ProjectAgent();
export const buildProjectInstructions = (context: AgentExecutionContext) => projectAgent.buildInstructions(context);
