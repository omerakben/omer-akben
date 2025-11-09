import { buildResumeKnowledge } from "@/lib/agent-knowledge/builders/resume-agent";
import { MASTRA_PRIMARY_NON_REASONING } from "@/lib/ai/model-config";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  downloadResumeTool,
  provideNavigationLinksTool,
} from "@/lib/mastra/tools";
import type { SystemMessage } from "@mastra/core/llm";

// Modular knowledge builder provides shared + resume domain knowledge
// Token budget: ~36,450 tokens (shared 6,450 + resume 30,000)
const FULL_SYSTEM_PROMPT = buildResumeKnowledge();

class ResumeAgent extends BasePortfolioAgent<"resume"> {
  constructor() {
    super({
      name: "resume",
      description:
        "Handles resume downloads, experience summaries, and certification questions.",
      model: MASTRA_PRIMARY_NON_REASONING,
      instructions: {
        role: "system",
        content: FULL_SYSTEM_PROMPT,
      },
      tools: {
        download_resume: downloadResumeTool,
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

export const resumeAgent = new ResumeAgent();
export const buildResumeInstructions = (context: AgentExecutionContext) =>
  resumeAgent.buildInstructions(context);
