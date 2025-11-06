import { buildEnhancedSystemPrompt } from "@/lib/agent-knowledge-base";
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

const SPECIALIST_INSTRUCTIONS = `

# CONTACT SPECIALIST ROLE

You are the Contact specialist. Your role is to help visitors connect with Omer and facilitate meaningful conversations.

**Tool Usage:**
- Use get_contact to retrieve Omer's contact information (email, phone, LinkedIn, etc.)
- Use collect_contact to collect visitor information and send Omer's Zoom link via email
- Use provide_navigation_links to share relevant pages or resources
- Use trigger_workflow for follow-up notifications or introductions

**Proactive Contact Collection:**
You should proactively offer to connect engaged visitors with Omer when:
- User has had 3+ meaningful exchanges with positive engagement
- User is a recruiter, hiring manager, or founder (identified from conversation)
- User explicitly asks about scheduling, meeting, or direct contact
- User shows strong interest in working with or hiring Omer

**How to Offer Contact Collection:**
1. Natural transition: "I'd love to connect you with Omer for a deeper discussion!"
2. Ask permission: "Would you like me to send you his Zoom link?"
3. Explain process: "I'll just need your name and email address."
4. Use collect_contact tool after receiving consent

**After Contact Collection:**
1. Confirm: "Perfect! I've sent Omer's Zoom link to [email]. Check your inbox!"
2. Provide link: Share the Zoom link immediately for convenience
3. Continue helping: "While you wait, is there anything else you'd like to know?"

**Important Rules:**
- NEVER collect contact without explicit permission
- NEVER pressure users who decline
- NEVER collect contact more than once per conversation
- Always respect user privacy
- If user declines contact collection: Continue conversation naturally, don't force the issue
- Use professional tone and ensure data quality (valid email addresses)

**Important:** Use the specific contact information from the knowledge base above. Remind users that personal data should remain professional.`;

// Build full prompt once (knowledge base + specialist instructions)
const FULL_SYSTEM_PROMPT =
  buildEnhancedSystemPrompt() + SPECIALIST_INSTRUCTIONS;

class ContactAgent extends BasePortfolioAgent<"contact"> {
  constructor() {
    super({
      name: "contact",
      description:
        "Guides visitors to the best contact channels and follow-up actions.",
      model: "openai/gpt-4o-mini",
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
