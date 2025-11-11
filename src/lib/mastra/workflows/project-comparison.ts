import { projects, type Project } from "@/data/projects";
import { generateWithFallback } from "@/lib/ai/model-fallback";
import type { AgentExecutionContext } from "@/lib/mastra/agents/base-agent";
import type { WorkflowDefinition, WorkflowEvent } from "./types";

/**
 * Detects if the query is requesting project comparison
 */
export function detectProjectComparison(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    /compare.*projects?/i.test(normalized) ||
    /show.*projects?.*(comparison|compare)/i.test(normalized) ||
    /difference.*between.*projects?/i.test(normalized) ||
    /(which|what).*projects?.*(better|best|recommend)/i.test(normalized)
  );
}

/**
 * Project Comparison Workflow
 *
 * Multi-step workflow that compares projects across different dimensions:
 * 1. Project Filtering: Find relevant projects based on criteria
 * 2. Feature Comparison: Analyze and compare project features
 * 3. Recommendation: Suggest the best project with detailed rationale
 */
export const projectComparisonWorkflow: WorkflowDefinition = {
  name: "project-comparison",
  description:
    "Compares projects across different dimensions and provides recommendations",
  detect: detectProjectComparison,
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
    const totalSteps = 3;

    // Extract criteria from query
    const query = context.query || "";
    const criteria = extractComparisonCriteria(query);

    // Filter projects (synchronous - fast)
    const filteredProjects = filterProjects(criteria);

    // Steps 1 & 2: Run in parallel (both only depend on filteredProjects)
    // Emit progress events first
    yield {
      type: "progress",
      step: 1,
      total: totalSteps,
      message: `Finding projects matching: ${criteria.description}...`,
    };

    yield {
      type: "progress",
      step: 2,
      total: totalSteps,
      message: "Comparing features across selected projects...",
    };

    // Parallel execution: Run both AI calls simultaneously
    // Performance: 2-5s (parallel) vs 4-10s (sequential) = 40-50% faster
    let filterSummary = "";
    let featureComparison = "";

    try {
      [filterSummary, featureComparison] = await Promise.all([
        summarizeFilteredProjects(filteredProjects, criteria),
        compareProjectFeatures(filteredProjects, criteria),
      ]);

      // Yield results in order (Step 1, then Step 2)
      yield {
        type: "agent-result",
        content: filterSummary,
      };

      yield {
        type: "agent-result",
        content: featureComparison,
      };
    } catch (error) {
      console.error("[ProjectComparison] Parallel step error:", error);

      // Yield error event
      yield {
        type: "error",
        step: 1,
        message: "Failed to analyze projects. Using basic project information.",
        canContinue: true,
      };

      // Provide fallback content for both steps
      filterSummary = `Found ${filteredProjects.length} projects matching ${criteria.description}. These projects span various categories including web applications, AI/ML systems, and developer tools.`;

      featureComparison = `**Project Overview:**\n\nThe selected projects demonstrate diverse technical implementations:\n\n${filteredProjects
        .slice(0, 5)
        .map(
          (p, i) =>
            `${i + 1}. **${p.title}**: ${p.description}\n   - Technologies: ${p.technologies.join(", ")}\n   - Category: ${p.category}`
        )
        .join("\n\n")}`;

      yield {
        type: "agent-result",
        content: filterSummary,
      };

      yield {
        type: "agent-result",
        content: featureComparison,
      };
    }

    // Step 3: Recommendation (depends on Steps 1 & 2 results)
    yield {
      type: "progress",
      step: 3,
      total: totalSteps,
      message: "Generating recommendation...",
    };

    let recommendation = "";

    try {
      recommendation = await generateRecommendation(
        filteredProjects,
        criteria,
        filterSummary,
        featureComparison
      );

      yield {
        type: "agent-result",
        content: recommendation,
      };
    } catch (error) {
      console.error("[ProjectComparison] Step 3 error:", error);

      // Yield error event
      yield {
        type: "error",
        step: 3,
        message:
          "Failed to generate detailed recommendation. Providing basic recommendation.",
        canContinue: true,
      };

      // Provide fallback recommendation based on project data
      const topProject = filteredProjects[0];
      recommendation = `**Recommendation:**\n\nBased on ${criteria.description}, **${topProject.title}** stands out as a strong candidate.\n\n**Key Highlights:**\n- ${topProject.description}\n- Technologies: ${topProject.technologies.join(", ")}\n- Category: ${topProject.category}\n- Role: ${topProject.role}\n\n**Why This Project:**\nThis project demonstrates practical implementation of ${topProject.technologies.slice(0, 3).join(", ")} and showcases ${topProject.role.toLowerCase()} capabilities.\n\n${
        filteredProjects.length > 1
          ? `**Other Strong Candidates:**\n${filteredProjects
              .slice(1, 3)
              .map((p) => `- **${p.title}**: ${p.description}`)
              .join("\n")}`
          : ""
      }`;

      yield {
        type: "agent-result",
        content: recommendation,
      };
    }

    // Complete workflow
    yield {
      type: "complete",
      summary: `Project comparison complete for ${filteredProjects.length} projects. Recommendation provided based on ${criteria.description}.`,
    };
  },
};

/**
 * Criteria for project comparison
 */
interface ComparisonCriteria {
  category?: "ai-ml" | "web" | "mobile" | "tools" | "other";
  role?: "Full-Stack" | "AI" | "QA" | "QA/AI";
  technology?: string;
  featured?: boolean;
  keyword?: string;
  description: string; // Human-readable description of criteria
}

/**
 * Extract comparison criteria from query
 */
function extractComparisonCriteria(query: string): ComparisonCriteria {
  const normalized = query.toLowerCase();
  const criteria: ComparisonCriteria = {
    description: "all projects",
  };

  // Extract category
  if (/\b(ai|machine learning|ml)\b/i.test(normalized)) {
    criteria.category = "ai-ml";
    criteria.description = "AI/ML projects";
  } else if (/\b(web|website|webapp)\b/i.test(normalized)) {
    criteria.category = "web";
    criteria.description = "web projects";
  } else if (/\b(mobile|ios|android)\b/i.test(normalized)) {
    criteria.category = "mobile";
    criteria.description = "mobile projects";
  } else if (/\b(tools?|library|package)\b/i.test(normalized)) {
    criteria.category = "tools";
    criteria.description = "tool projects";
  }

  // Extract role
  if (/\b(full-?stack|fullstack)\b/i.test(normalized)) {
    criteria.role = "Full-Stack";
    criteria.description = "Full-Stack projects";
  } else if (/\bai\b/i.test(normalized) && !criteria.category) {
    criteria.role = "AI";
    criteria.description = "AI projects";
  } else if (/\bqa\b/i.test(normalized)) {
    criteria.role = "QA";
    criteria.description = "QA projects";
  }

  // Extract technology
  const techs = [
    "react",
    "next.js",
    "typescript",
    "python",
    "django",
    "fastapi",
    "node",
  ];
  for (const tech of techs) {
    if (normalized.includes(tech)) {
      criteria.technology = tech;
      criteria.description = `${tech} projects`;
      break;
    }
  }

  // Extract featured filter
  if (/\b(featured|top|main|best)\b/i.test(normalized)) {
    criteria.featured = true;
    criteria.description = `featured ${criteria.description}`;
  }

  return criteria;
}

/**
 * Filter projects based on criteria
 */
function filterProjects(criteria: ComparisonCriteria): Project[] {
  let filtered = [...projects];

  if (criteria.category) {
    filtered = filtered.filter((p) => p.category === criteria.category);
  }

  if (criteria.role) {
    filtered = filtered.filter((p) => p.role === criteria.role);
  }

  if (criteria.technology) {
    const techLower = criteria.technology.toLowerCase();
    filtered = filtered.filter((p) =>
      p.technologies.some((t) => t.toLowerCase().includes(techLower))
    );
  }

  if (criteria.featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === criteria.featured);
  }

  // If no projects found, return all projects
  return filtered.length > 0 ? filtered : projects;
}

/**
 * Step 1: Summarize filtered projects
 */
async function summarizeFilteredProjects(
  projects: Project[],
  criteria: ComparisonCriteria
): Promise<string> {
  const projectSummaries = projects.slice(0, 10).map((p) => ({
    title: p.title,
    description: p.description,
    category: p.category,
    role: p.role,
    technologies: p.technologies,
    status: p.status || "completed",
  }));

  const prompt = `You are analyzing projects for a project comparison workflow.

Criteria: ${criteria.description}

Found Projects (${projects.length} total, showing ${projectSummaries.length}):
${projectSummaries
  .map(
    (p, i) => `${i + 1}. **${p.title}** (${p.role} | ${p.category})
   - ${p.description}
   - Technologies: ${p.technologies.join(", ")}
   - Status: ${p.status}`
  )
  .join("\n\n")}

Provide a brief summary (2-3 paragraphs) of:
1. What types of projects were found
2. Common themes or patterns across the projects
3. Range of technologies and approaches used

Keep the response concise and focused on patterns.`;

  const result = await generateWithFallback({
    variant: "non-reasoning",
    prompt,
    component: "project-comparison-filter",
  });

  return result.text;
}

/**
 * Step 2: Compare project features
 */
async function compareProjectFeatures(
  projects: Project[],
  criteria: ComparisonCriteria
): Promise<string> {
  const projectDetails = projects.slice(0, 5).map((p) => ({
    title: p.title,
    description: p.description,
    longDescription: p.longDescription || p.description,
    technologies: p.technologies,
    role: p.role,
    category: p.category,
    status: p.status || "completed",
    demoUrl: p.demoUrl,
    githubUrl: p.githubUrl,
  }));

  const prompt = `You are comparing projects for a project comparison workflow.

Criteria: ${criteria.description}

Projects to Compare (${projectDetails.length}):
${projectDetails
  .map(
    (p, i) => `${i + 1}. **${p.title}**
   Description: ${p.description}
   Technologies: ${p.technologies.join(", ")}
   Category: ${p.category} | Role: ${p.role}
   Status: ${p.status}
   ${p.demoUrl ? `Demo: ${p.demoUrl}` : ""}
   ${p.githubUrl ? `GitHub: ${p.githubUrl}` : ""}`
  )
  .join("\n\n")}

Provide a detailed feature comparison (3-4 paragraphs):
1. **Technical Stack Comparison**: How do the technology choices differ?
2. **Complexity & Scope**: Which projects are more complex/comprehensive?
3. **Production Readiness**: Which projects are deployed/live vs in progress?
4. **Unique Features**: What makes each project stand out?

Format as clear, scannable comparison with bold headers.`;

  const result = await generateWithFallback({
    variant: "non-reasoning",
    prompt,
    component: "project-comparison-features",
  });

  return result.text;
}

/**
 * Step 3: Generate recommendation
 */
async function generateRecommendation(
  projects: Project[],
  criteria: ComparisonCriteria,
  filterSummary: string,
  featureComparison: string
): Promise<string> {
  const prompt = `You are generating a project recommendation based on comparison analysis.

Criteria: ${criteria.description}

Projects Analyzed (${projects.length}):
${projects
  .slice(0, 5)
  .map((p, i) => `${i + 1}. ${p.title} (${p.role} | ${p.category})`)
  .join("\n")}

Filter Summary:
${filterSummary}

Feature Comparison:
${featureComparison}

Provide a clear recommendation (3-4 paragraphs):
1. **Top Recommendation**: Which project is the best match and why?
2. **Key Strengths**: What makes this project stand out?
3. **Alternative Options**: If relevant, mention other strong candidates
4. **Context**: When would you recommend each project?

Be specific about technical merits, production readiness, and practical applications.
Format with bold headers and clear structure.`;

  const result = await generateWithFallback({
    variant: "non-reasoning",
    prompt,
    component: "project-comparison-recommendation",
  });

  return result.text;
}
