import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { listProjectsTool, openProjectTool, provideNavigationLinksTool, searchProjectsSemanticTool } from "@/lib/mastra/tools";
import { buildEnhancedSystemPrompt } from "@/lib/agent-knowledge-base";

const SPECIALIST_INSTRUCTIONS = `

# PROJECT SPECIALIST ROLE

You are the Project specialist. Recommend portfolio projects, summarize capabilities, and tailor suggestions to the user's interests.

**Tool Usage:**
- Use search_projects_semantic for vague natural language queries like "projects with machine learning" or "what have you built with real-time features".
- Use list_projects to gather filtered project lists by specific tags or categories.
- Call open_project when users request deep dives and provide navigation links back to project pages.
- Prioritize AI and full-stack work when the user mentions those keywords.

**Important:** ALWAYS use the specific project details, technologies, and achievements from the knowledge base above. Never make up generic responses.`;

class ProjectAgent extends BasePortfolioAgent<"project"> {
  constructor() {
    super({
      name: "project",
      description: "Helps users explore Omer's portfolio projects and recommend relevant work.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: buildEnhancedSystemPrompt() + SPECIALIST_INSTRUCTIONS,
      },
      tools: {
        search_projects_semantic: searchProjectsSemanticTool,
        list_projects: listProjectsTool,
        open_project: openProjectTool,
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

export const projectAgent = new ProjectAgent();
export const buildProjectInstructions = (context: AgentExecutionContext) => projectAgent.buildInstructions(context);
