/**
 * Dynamic Project Query Helpers
 *
 * Industry Best Practice (2025): Avoid hardcoded Q&A samples for frequently updated data.
 * This module provides runtime data retrieval functions to ensure AI Ozzy's knowledge
 * base always reflects the current state of the project portfolio.
 *
 * Architecture: Hybrid template approach
 * - Static context for LLM understanding
 * - Dynamic data queries for volatile project details
 * - Single source of truth: @/data/projects
 */

import { projects, getProjectBySlug, type Project } from '@/data/projects';

/**
 * Get all featured projects sorted by display order
 * Used for: "What are your best projects?" responses
 */
export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
}

/**
 * Get all live production projects with demo URLs
 * Used for: "Do you have live demos?" responses
 */
export function getLiveProductionProjects(): Project[] {
  return projects.filter(
    (p) =>
      p.status === 'completed' &&
      p.demoUrl &&
      !p.demoUrl.includes('TEMPORARILY DISABLED')
  );
}

/**
 * Get all Elon University projects for cross-referencing
 * Used for: IP acknowledgment and cross-linking responses
 */
export function getElonUniversityProjects(): Project[] {
  const elonSlugs = [
    'elon-ai-agent',
    'elongpt',
    'elon-ai-toolbox',
    'lsb-ai-studio',
  ];
  return projects.filter((p) => elonSlugs.includes(p.slug));
}

/**
 * Get all Tuel framework projects for cross-referencing
 * Used for: Related projects suggestions
 */
export function getTuelProjects(): Project[] {
  const tuelSlugs = [
    'tuel-animation-library',
    'tuel-chatbot',
    'tuel-selenium-webdriver-restsharp',
  ];
  return projects.filter((p) => tuelSlugs.includes(p.slug));
}

/**
 * Get projects by category
 * Used for: "Show me AI projects", "Show me full-stack projects" responses
 */
export function getProjectsByCategory(category: string): Project[] {
  return projects.filter((p) => p.category === category);
}

/**
 * Get unique technology stack across all projects
 * Used for: "What technologies do you use?" responses
 */
export function getProjectTechStack(): string[] {
  const allTech = projects.flatMap((p) => p.technologies);
  return [...new Set(allTech)].sort();
}

/**
 * Get temporarily disabled projects (no demos/repos available)
 * Used for: Filtering out unavailable project links
 */
export function getTemporarilyDisabledProjects(): Project[] {
  return projects.filter(
    (p) =>
      p.demoUrl?.includes('TEMPORARILY DISABLED') ||
      p.githubUrl?.includes('TEMPORARILY DISABLED') ||
      (!p.demoUrl && !p.githubUrl && p.status !== 'completed')
  );
}

/**
 * Get projects with screenshots available
 * Used for: Proactive screenshot offering in responses
 */
export function getProjectsWithScreenshots(): Array<{
  title: string;
  image: string;
  slug: string;
}> {
  return projects
    .filter((p) => p.image)
    .map((p) => ({
      title: p.title,
      image: p.image!,
      slug: p.slug,
    }));
}

/**
 * Get related projects based on project relationships
 * Used for: Cross-linking and "You might also like..." suggestions
 *
 * @param projectSlug - The current project's slug
 * @returns Array of related projects (excluding the current one)
 */
export function getRelatedProjects(projectSlug: string): Project[] {
  const elonSlugs = [
    'elon-ai-agent',
    'elongpt',
    'elon-ai-toolbox',
    'lsb-ai-studio',
  ];
  const tuelSlugs = [
    'tuel-animation-library',
    'tuel-chatbot',
    'tuel-selenium-webdriver-restsharp',
  ];

  // If it's an Elon project, return other Elon projects
  if (elonSlugs.includes(projectSlug)) {
    return projects.filter(
      (p) => elonSlugs.includes(p.slug) && p.slug !== projectSlug
    );
  }

  // If it's a Tuel project, return other Tuel projects
  if (tuelSlugs.includes(projectSlug)) {
    return projects.filter(
      (p) => tuelSlugs.includes(p.slug) && p.slug !== projectSlug
    );
  }

  // For other projects, return projects in same category
  const project = getProjectBySlug(projectSlug);
  if (!project) return [];

  return projects.filter(
    (p) => p.category === project.category && p.slug !== projectSlug
  );
}

/**
 * Format project list for AI responses
 * Used for: Consistent project list formatting in knowledge base
 *
 * @param projectList - Array of projects to format
 * @param includeScreenshotTag - Whether to add [Screenshot Available] tag
 * @returns Formatted markdown list
 */
export function formatProjectList(
  projectList: Project[],
  includeScreenshotTag = false
): string {
  return projectList
    .map((p) => {
      const screenshotTag = includeScreenshotTag && p.image ? ' [Screenshot Available]' : '';
      const statusBadge = p.status === 'completed' && p.demoUrl ? ' • LIVE' : '';
      return `- **${p.title}** (${p.category})${statusBadge}: ${p.description}${screenshotTag}`;
    })
    .join('\n');
}

/**
 * Get project statistics for status page
 * Used for: Dynamic metrics in status dashboard
 */
export function getProjectStatistics() {
  const featured = getFeaturedProjects();
  const live = getLiveProductionProjects();
  const withScreenshots = getProjectsWithScreenshots();
  const disabled = getTemporarilyDisabledProjects();
  const publicRepos = projects.filter(
    (p) => p.githubUrl && !p.githubUrl.includes('TEMPORARILY DISABLED')
  );
  const aiProjects = getProjectsByCategory('ai-ml');

  return {
    total: projects.length,
    featured: featured.length,
    liveProduction: live.length,
    withScreenshots: withScreenshots.length,
    temporarilyDisabled: disabled.length,
    publicGitHubRepos: publicRepos.length,
    aiMlProjects: aiProjects.length,
    categories: [...new Set(projects.map((p) => p.category))],
    technologies: getProjectTechStack(),
  };
}

/**
 * Check if a project is an Elon University property
 * Used for: IP acknowledgment logic
 */
export function isElonUniversityProject(projectSlug: string): boolean {
  const elonSlugs = [
    'elon-ai-agent',
    'elongpt',
    'elon-ai-toolbox',
    'lsb-ai-studio',
  ];
  return elonSlugs.includes(projectSlug);
}

/**
 * Get Elon University project context for IP acknowledgment
 * Used for: Adding IP context to Elon project discussions
 */
export function getElonUniversityContext(): string {
  const elonProjects = getElonUniversityProjects();

  return `Four projects were developed for Elon University and are university intellectual property:

${formatProjectList(elonProjects, true)}

**Important Context:**
- Source code in private repositories (institutional property)
- All 4 projects cross-reference each other on portfolio pages
- Professional IP acknowledgment sections on all 4 project pages
- Detailed case studies available with screenshots

**When discussing any Elon project:**
- Mention it's part of Elon's AI initiative
- Reference the other ${elonProjects.length - 1} related projects
- Explain private repo status (institutional purposes)
- Offer to show detailed case studies`;
}
