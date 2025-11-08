import { facts } from "@/data/facts";
import { getFeaturedProjects, type Project } from "@/data/projects";
import type { AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import { generateWithFallback } from "@/lib/ai/model-fallback";
import type { WorkflowDefinition, WorkflowEvent } from "./types";

/**
 * Detects if the query is requesting interview preparation help
 */
export function detectInterviewPrep(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    /interview\s+(prep|preparation|practice|help)/i.test(normalized) ||
    /prepare.*interview/i.test(normalized) ||
    /interview\s+question/i.test(normalized) ||
    /help.*prepare.*interview/i.test(normalized)
  );
}

/**
 * Interview Preparation Workflow
 *
 * Multi-step workflow that helps users prepare for technical interviews:
 * 1. Resume Review: Analyze candidate's experience and background
 * 2. Skills Assessment: Evaluate technical skills from projects
 * 3. Practice Questions: Generate tailored interview questions
 */
export const interviewPrepWorkflow: WorkflowDefinition = {
  name: "interview-prep",
  description:
    "Helps prepare for technical interviews with resume review, skills assessment, and practice questions",
  detect: detectInterviewPrep,
  steps: [], // Populated below
  formatEvent: (event: WorkflowEvent): string => {
    switch (event.type) {
      case "progress":
        return `\n**[Step ${event.step}/${event.total}]** ${event.message}\n\n`;
      case "content":
        return event.text;
      case "agent-result":
        return `\n${event.content}\n`;
      case "complete":
        return `\n\n---\n\n${event.summary}`;
    }
  },

  async *execute(
    context: AgentExecutionContext
  ): AsyncGenerator<WorkflowEvent> {
    const totalSteps = 3;

    // Extract interview details from query
    const query = context.query || "";
    const interviewType = extractInterviewType(query);
    const company = extractCompany(query);

    // Step 1: Resume Review
    yield {
      type: "progress",
      step: 1,
      total: totalSteps,
      message: "Reviewing your resume and experience...",
    };

    const resumeReview = await reviewResume(interviewType, company);
    yield {
      type: "agent-result",
      content: resumeReview,
    };

    // Step 2: Skills Assessment
    yield {
      type: "progress",
      step: 2,
      total: totalSteps,
      message: "Assessing your technical skills from projects...",
    };

    const skillsAssessment = await assessSkills(interviewType, company);
    yield {
      type: "agent-result",
      content: skillsAssessment,
    };

    // Step 3: Practice Questions
    yield {
      type: "progress",
      step: 3,
      total: totalSteps,
      message: "Generating tailored practice questions...",
    };

    const practiceQuestions = await generatePracticeQuestions(
      interviewType,
      company,
      resumeReview,
      skillsAssessment
    );
    yield {
      type: "agent-result",
      content: practiceQuestions,
    };

    // Complete
    yield {
      type: "complete",
      summary: `Interview preparation complete for ${interviewType || "technical"} ${company ? `at ${company}` : "interview"}. Good luck!`,
    };
  },
};

/**
 * Extract interview type from query (e.g., "React", "Python", "Full-stack")
 */
function extractInterviewType(query: string): string {
  const techs = [
    "react",
    "typescript",
    "python",
    "javascript",
    "node",
    "next.js",
    "full-stack",
    "frontend",
    "backend",
  ];
  const normalized = query.toLowerCase();

  for (const tech of techs) {
    if (normalized.includes(tech)) {
      return tech;
    }
  }

  return "technical";
}

/**
 * Extract company name from query
 */
function extractCompany(query: string): string | null {
  const companyMatch = query.match(
    /(?:at|for|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/
  );
  return companyMatch ? companyMatch[1] : null;
}

/**
 * Step 1: Review resume and experience
 */
async function reviewResume(
  interviewType: string,
  company: string | null
): Promise<string> {
  const resumeData = {
    name: facts.personal.fullName,
    title: facts.personal.title,
    experience: facts.professional.yearsOfExperience,
    education: facts.education[0]?.degree || "Not specified",
    certifications: facts.certifications?.map((c) => c.name) || [],
  };

  const prompt = `You are helping prepare for a ${interviewType} interview${company ? ` at ${company}` : ""}.

Resume Summary:
- Name: ${resumeData.name}
- Title: ${resumeData.title}
- Experience: ${resumeData.experience} years
- Education: ${resumeData.education}
- Certifications: ${resumeData.certifications?.join(", ") || "None"}

Analyze this resume and provide:
1. Key strengths relevant to ${interviewType} roles
2. Areas that align well with the interview requirements
3. Potential talking points to highlight

Keep the response concise (3-4 paragraphs).`;

  const result = await generateWithFallback({
    variant: "non-reasoning",
    prompt,
  });

  return result.text;
}

/**
 * Step 2: Assess skills from projects
 */
async function assessSkills(
  interviewType: string,
  company: string | null
): Promise<string> {
  const projects = getFeaturedProjects().slice(0, 5);
  const projectSummaries = projects.map((p: Project) => ({
    title: p.title,
    description: p.description,
    technologies: p.technologies,
  }));

  const prompt = `You are assessing technical skills for a ${interviewType} interview${company ? ` at ${company}` : ""}.

Recent Projects:
${projectSummaries
  .map(
    (
      p: { title: string; description: string; technologies: string[] },
      i: number
    ) => `${i + 1}. ${p.title}
   - ${p.description}
   - Technologies: ${p.technologies.join(", ")}`
  )
  .join("\n\n")}

Provide a skills assessment:
1. Core technical skills demonstrated
2. Depth of expertise (beginner/intermediate/advanced)
3. Relevant technologies for ${interviewType} roles
4. Projects that best showcase interview-relevant skills

Keep the response concise (3-4 paragraphs).`;

  const result = await generateWithFallback({
    variant: "non-reasoning",
    prompt,
  });

  return result.text;
}

/**
 * Step 3: Generate practice questions
 */
async function generatePracticeQuestions(
  interviewType: string,
  company: string | null,
  resumeReview: string,
  skillsAssessment: string
): Promise<string> {
  const prompt = `You are generating practice interview questions for a ${interviewType} interview${company ? ` at ${company}` : ""}.

Resume Review:
${resumeReview}

Skills Assessment:
${skillsAssessment}

Generate 5 tailored practice questions:
1. One question about technical expertise (based on skills assessment)
2. One behavioral question (based on experience)
3. One system design or architecture question (if applicable)
4. One question about a specific technology from the candidate's stack
5. One question about problem-solving or debugging

For each question, provide:
- The question
- Why this question is relevant
- Key points to cover in the answer

Format as a numbered list with clear structure.`;

  const result = await generateWithFallback({
    variant: "non-reasoning",
    prompt,
  });

  return result.text;
}
