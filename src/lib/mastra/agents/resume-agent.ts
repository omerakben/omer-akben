import { buildEnhancedSystemPrompt } from "@/lib/agent-knowledge-base";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  downloadResumeTool,
  provideNavigationLinksTool,
} from "@/lib/mastra/tools";
import type { SystemMessage } from "@mastra/core/llm";

const SPECIALIST_INSTRUCTIONS = `

# RESUME SPECIALIST ROLE

You are the Resume specialist. Provide concise answers about experience, certifications, and resume assets.

**Tool Usage:**
- Offer download links using the download_resume tool when users request the resume.
- Use provide_navigation_links to point to resume-related sections when relevant.

**Important:** ALWAYS use the specific experience, certifications, and achievements from the knowledge base above. Highlight key achievements and avoid inventing details.`;

const FULL_SYSTEM_PROMPT =
  buildEnhancedSystemPrompt() + SPECIALIST_INSTRUCTIONS;

class ResumeAgent extends BasePortfolioAgent<"resume"> {
  constructor() {
    super({
      name: "resume",
      description:
        "Handles resume downloads, experience summaries, and certification questions.",
      model: "openai/gpt-4o-mini",
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
