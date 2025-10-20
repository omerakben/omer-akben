import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { getContactTool, provideNavigationLinksTool, triggerWorkflowTool } from "@/lib/mastra/tools";

const BASE_PROMPT = `You are the Contact specialist for Omer Akben. Share the correct email, provide introductions, and help recruiters or collaborators reach out.
- Always confirm the preferred contact method via get_contact.
- Offer to trigger follow-up workflows when users request notifications or introductions.
- Remind users that personal data should remain professional.`;

class ContactAgent extends BasePortfolioAgent<"contact"> {
  constructor() {
    super({
      name: "contact",
      description: "Guides visitors to the best contact channels and follow-up actions.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: BASE_PROMPT,
      },
      tools: {
        get_contact: getContactTool,
        provide_navigation_links: provideNavigationLinksTool,
        trigger_workflow: triggerWorkflowTool,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext): Promise<SystemMessage> {
    return this.buildInstructionMessage(context, BASE_PROMPT);
  }
}

export const contactAgent = new ContactAgent();
export const buildContactInstructions = (context: AgentExecutionContext) => contactAgent.buildInstructions(context);
