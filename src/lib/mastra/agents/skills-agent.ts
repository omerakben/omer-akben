import { buildSkillsKnowledge } from "@/lib/agent-knowledge/builders/skills-agent";
import { MASTRA_PRIMARY_NON_REASONING } from "@/lib/ai/model-config";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  listProjectsTool,
  provideNavigationLinksTool,
} from "@/lib/mastra/tools";
import type { SystemMessage } from "@mastra/core/llm";

// Modular knowledge builder provides shared knowledge + skills specialization
// Token budget: ~9,450 tokens (shared 6,450 + skills 3,000)
const FULL_SYSTEM_PROMPT = buildSkillsKnowledge();

class SkillsAgent extends BasePortfolioAgent<"skills"> {
  constructor() {
    super({
      name: "skills",
      description:
        "Answers questions about Omer's technical skills, proficiency levels, and expertise.",
      model: MASTRA_PRIMARY_NON_REASONING,
      instructions: {
        role: "system",
        content: FULL_SYSTEM_PROMPT,
      },
      tools: {
        provide_navigation_links: provideNavigationLinksTool,
        list_projects: listProjectsTool,
      },
    });
  }

  async buildInstructions(
    context: AgentExecutionContext
  ): Promise<SystemMessage> {
    return this.buildInstructionMessage(context, FULL_SYSTEM_PROMPT);
  }
}

export const skillsAgent = new SkillsAgent();
export const buildSkillsInstructions = (context: AgentExecutionContext) =>
  skillsAgent.buildInstructions(context);
