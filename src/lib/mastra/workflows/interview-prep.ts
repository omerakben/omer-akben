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
      case "error":
        return `\n\n⚠️ **Step ${event.step} Error**: ${event.message}\n${event.canContinue ? "Continuing with next step...\n" : ""}\n`;
    }
  },

  async *execute(
    context: AgentExecutionContext
  ): AsyncGenerator<WorkflowEvent> {
    const workflowStartTime = Date.now();
    const totalSteps = 3;

    // Extract interview details from query (synchronous - fast)
    const extractStartTime = Date.now();
    const query = context.query || "";
    const interviewType = extractInterviewType(query);
    const company = extractCompany(query);
    const extractDuration = Date.now() - extractStartTime;

    console.log(
      `[InterviewPrep] Extracted interview details in ${extractDuration}ms (type: ${interviewType}, company: ${company || "not specified"})`
    );

    // Steps 1 & 2: Run in parallel (both only depend on interviewType + company)
    // Emit progress events first
    yield {
      type: "progress",
      step: 1,
      total: totalSteps,
      message: "Reviewing your resume and experience...",
    };

    yield {
      type: "progress",
      step: 2,
      total: totalSteps,
      message: "Assessing your technical skills from projects...",
    };

    // Parallel execution: Run both AI calls simultaneously
    // Performance: 2-5s (parallel) vs 4-10s (sequential) = 40-50% faster
    const parallelStartTime = Date.now();
    let resumeReview = "";
    let skillsAssessment = "";
    let parallelDuration = 0; // Declare outside try block for scope access

    try {
      [resumeReview, skillsAssessment] = await Promise.all([
        reviewResume(interviewType, company),
        assessSkills(interviewType, company),
      ]);
      parallelDuration = Date.now() - parallelStartTime;

      console.log(
        `[InterviewPrep] Parallel execution (Steps 1 & 2) completed in ${parallelDuration}ms`
      );

      // Yield results in order (Step 1, then Step 2)
      yield {
        type: "agent-result",
        content: resumeReview,
      };

      yield {
        type: "agent-result",
        content: skillsAssessment,
      };
    } catch (error) {
      console.error("[InterviewPrep] Parallel step error:", error);

      // Yield error event
      yield {
        type: "error",
        step: 1,
        message:
          "Failed to analyze resume and skills. Using fallback information.",
        canContinue: true,
      };

      // Provide fallback content for both steps
      resumeReview = `Based on ${facts.professional.yearsOfExperience} years of experience as a ${facts.personal.title}, focus on highlighting practical expertise in ${interviewType} technologies and real-world project experience.`;
      skillsAssessment = `Core technical skills demonstrated include full-stack development, AI integration, and production-grade system design. Prepare to discuss specific project implementations.`;

      yield {
        type: "agent-result",
        content: resumeReview,
      };

      yield {
        type: "agent-result",
        content: skillsAssessment,
      };
    }

    // Step 3: Practice Questions (depends on Steps 1 & 2 results)
    yield {
      type: "progress",
      step: 3,
      total: totalSteps,
      message: "Generating tailored practice questions...",
    };

    const step3StartTime = Date.now();
    let practiceQuestions = "";
    let step3Duration = 0; // Declare outside try block for scope access

    try {
      practiceQuestions = await generatePracticeQuestions(
        interviewType,
        company,
        resumeReview,
        skillsAssessment
      );
      step3Duration = Date.now() - step3StartTime;

      console.log(
        `[InterviewPrep] Step 3 (Practice Questions) completed in ${step3Duration}ms`
      );

      yield {
        type: "agent-result",
        content: practiceQuestions,
      };
    } catch (error) {
      console.error("[InterviewPrep] Step 3 error:", error);

      // Yield error event
      yield {
        type: "error",
        step: 3,
        message: "Failed to generate practice questions. Using generic questions.",
        canContinue: true,
      };

      // Provide fallback practice questions
      practiceQuestions = `**Practice Interview Questions for ${interviewType} Role:**

1. **Technical Expertise**: Walk me through your most complex ${interviewType} project. What challenges did you face and how did you overcome them?

2. **Problem-Solving**: Describe a time when you had to debug a difficult issue in production. What was your approach?

3. **System Design**: How would you architect a scalable system for [common use case in ${interviewType}]?

4. **Code Quality**: What are your practices for writing maintainable, testable code? Can you give examples from your projects?

5. **Collaboration**: Tell me about a time you had to explain technical concepts to non-technical stakeholders. How did you approach it?

These are general questions - review your specific projects and experiences to prepare detailed answers.`;

      yield {
        type: "agent-result",
        content: practiceQuestions,
      };
    }

    // Complete
    const totalDuration = Date.now() - workflowStartTime;
    console.log(
      `[InterviewPrep] Workflow completed in ${totalDuration}ms total ` +
        `(Extract: ${extractDuration}ms, Parallel Steps 1&2: ${parallelDuration}ms, Step 3: ${step3Duration}ms)`
    );

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
    component: "interview-prep-resume-review",
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
    component: "interview-prep-skills",
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
    component: "interview-prep-questions",
  });

  return result.text;
}
