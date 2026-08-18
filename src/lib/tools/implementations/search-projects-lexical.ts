import { projects, type Project } from "@/data/projects";

export type LexicalProjectHit = {
  slug: string;
  score: number;
  project: Partial<Project>;
};

function haystack(project: Project): string {
  return [
    project.slug,
    project.title,
    project.shortTitle ?? "",
    project.description,
    project.longDescription ?? "",
    project.technologies.join(" "),
    project.category,
  ]
    .join(" ")
    .toLowerCase();
}

function tokensFromQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 1);
}

/**
 * In-process corpus search. Used when vector search is unavailable so
 * short product-name queries (Tuel / TUEL) still return real projects.
 */
export function searchProjectsLexical(
  query: string,
  limit = 5
): LexicalProjectHit[] {
  const tokens = tokensFromQuery(query);
  if (tokens.length === 0) {
    return [];
  }

  return projects
    .map((project) => {
      const text = haystack(project);
      const score = tokens.reduce(
        (sum, token) => (text.includes(token) ? sum + 1 : sum),
        0
      );
      return { project, score };
    })
    .filter((hit) => hit.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ project, score }) => ({
      slug: project.slug,
      score,
      project: {
        slug: project.slug,
        title: project.title,
        description: project.description,
        category: project.category,
        role: project.role,
        technologies: project.technologies,
        featured: project.featured,
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
      },
    }));
}
