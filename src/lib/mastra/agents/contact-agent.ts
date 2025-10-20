import type { SystemMessage } from "@mastra/core/llm";
import { BasePortfolioAgent, type AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { getContactTool, provideNavigationLinksTool, triggerWorkflowTool } from "@/lib/mastra/tools";
import { buildEnhancedSystemPrompt } from "@/lib/agent-knowledge-base";

const SPECIALIST_INSTRUCTIONS = `

# CONTACT SPECIALIST ROLE

You are the Contact specialist. Share the correct email, provide introductions, and help recruiters or collaborators reach out.

**Tool Usage:**
- Always confirm the preferred contact method via get_contact.
- Offer to trigger follow-up workflows when users request notifications or introductions.

**Important:** Use the specific contact information from the knowledge base above. Remind users that personal data should remain professional.`;

class ContactAgent extends BasePortfolioAgent<"contact"> {
  constructor() {
    super({
      name: "contact",
      description: "Guides visitors to the best contact channels and follow-up actions.",
      model: "openai/gpt-4o-mini",
      instructions: {
        role: "system",
        content: buildEnhancedSystemPrompt() + SPECIALIST_INSTRUCTIONS,
      },
      tools: {
        get_contact: getContactTool,
        provide_navigation_links: provideNavigationLinksTool,
        trigger_workflow: triggerWorkflowTool,
      },
    });
  }

  async buildInstructions(context: AgentExecutionContext): Promise<SystemMessage> {
    const knowledgeBase = buildEnhancedSystemPrompt();
    const fullPrompt = knowledgeBase + SPECIALIST_INSTRUCTIONS;
    return this.buildInstructionMessage(context, fullPrompt);
  }
}

export const contactAgent = new ContactAgent();
export const buildContactInstructions = (context: AgentExecutionContext) => contactAgent.buildInstructions(context);
