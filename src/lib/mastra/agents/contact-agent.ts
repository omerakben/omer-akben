import { buildContactKnowledge } from "@/lib/agent-knowledge/builders/contact-agent";
import { MASTRA_PRIMARY_NON_REASONING } from "@/lib/ai/model-config";
import {
  BasePortfolioAgent,
  type AgentExecutionContext,
} from "@/lib/mastra/agents/base-agent";
import {
  collectContactTool,
  getContactTool,
  provideNavigationLinksTool,
  triggerWorkflowTool,
} from "@/lib/mastra/tools";
import type { SystemMessage } from "@mastra/core/llm";

// Modular knowledge builder provides shared knowledge + contact specialization
// Token budget: ~6,450 tokens (shared only - lightweight specialist)
const FULL_SYSTEM_PROMPT = buildContactKnowledge();

class ContactAgent extends BasePortfolioAgent<"contact"> {
  constructor() {
    super({
      name: "contact",
      description:
        "Guides visitors to the best contact channels and follow-up actions.",
      model: MASTRA_PRIMARY_NON_REASONING,
      instructions: {
        role: "system",
        content: FULL_SYSTEM_PROMPT,
      },
      tools: {
        collect_contact: collectContactTool,
        get_contact: getContactTool,
        provide_navigation_links: provideNavigationLinksTool,
        trigger_workflow: triggerWorkflowTool,
      },
    });
  }

  async buildInstructions(
    context: AgentExecutionContext
  ): Promise<SystemMessage> {
    return this.buildInstructionMessage(context, FULL_SYSTEM_PROMPT);
  }
}

export const contactAgent = new ContactAgent();
export const buildContactInstructions = (context: AgentExecutionContext) =>
  contactAgent.buildInstructions(context);
