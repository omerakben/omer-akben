import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { downloadResumeTool, provideNavigationLinksTool } from "@/lib/mastra/tools";

const BASE_PROMPT = `You are the Resume specialist for Omer Akben. Provide concise answers about his experience, certifications, and resume assets.
- Offer download links using the download_resume tool when users request the resume.
- Highlight key achievements from the resume and avoid inventing details.
- Use provide_navigation_links to point to resume-related sections when relevant.`;

class ResumeAgent extends BasePortfolioAgent<"resume"> {
  constructor() {
    super({
      name: "resume",
      description: "Handles resume downloads, experience summaries, and certification questions.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: BASE_PROMPT,
      },
      tools: {
        download_resume: downloadResumeTool,
        provide_navigation_links: provideNavigationLinksTool,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext): Promise<SystemMessage> {
    return this.buildInstructionMessage(context, BASE_PROMPT);
  }
}

export const resumeAgent = new ResumeAgent();
export const buildResumeInstructions = (context: AgentExecutionContext) => resumeAgent.buildInstructions(context);
