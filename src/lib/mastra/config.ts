import { Mastra } from "@mastra/core";
import { contactAgent } from "@/lib/mastra/agents/contact-agent";
import { coordinatorAgent } from "@/lib/mastra/agents/coordinator";
import { navigationAgent } from "@/lib/mastra/agents/navigation-agent";
import { performanceAgent } from "@/lib/mastra/agents/performance-agent";
import { projectAgent } from "@/lib/mastra/agents/project-agent";
import { resumeAgent } from "@/lib/mastra/agents/resume-agent";

export const mastra = new Mastra({
  agents: {
    coordinator: coordinatorAgent,
    resume: resumeAgent,
    project: projectAgent,
    contact: contactAgent,
    navigation: navigationAgent,
    performance: performanceAgent,
  },
});
