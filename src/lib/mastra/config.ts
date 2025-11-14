import { contactAgent } from "@/lib/mastra/agents/contact-agent";
import { coordinatorAgent } from "@/lib/mastra/agents/coordinator";
import { ozzyAgent } from "@/lib/mastra/agents/ozzy-agent";
import { Mastra } from "@mastra/core";

export const mastra = new Mastra({
  agents: {
    coordinator: coordinatorAgent,
    ozzy: ozzyAgent,
    ...(process.env.ENABLE_CONTACT_COLLECTION === "true"
      ? { contact: contactAgent }
      : {}),
  },
});
