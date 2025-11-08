/**
 * Action Mapper Module
 *
 * Maps follow-up action types to execution logic:
 * - download_resume → /api/tools/download-resume
 * - open_project → navigate to /projects/{slug}
 * - list_projects → /api/tools/list-projects
 * - search_projects → /api/tools/search-projects-semantic
 * - provide_nav → /api/tools/provide-navigation-links
 * - collect_contact → /api/tools/collect-contact
 * - none → no action (regular message)
 *
 * Design: Client-side execution with router navigation for page actions
 */

import type { ActionEnum } from "@/lib/schemas/followup-schema";

/**
 * Execute follow-up action based on type
 * Returns boolean indicating if action was executed (false for 'none')
 */
export async function executeFollowupAction(
  action: ActionEnum,
  args?: Record<string, unknown>,
  router?: { push: (url: string) => void }
): Promise<boolean> {
  try {
    switch (action) {
      case "download_resume": {
        const format = (args?.format as string) || "resume";
        await executeDownloadResume(format);
        return true;
      }

      case "open_project": {
        const slug = args?.slug as string;
        if (!slug) {
          console.error("[ActionMapper] Missing slug for open_project action");
          return false;
        }
        executeOpenProject(slug, router);
        return true;
      }

      case "list_projects": {
        const category = args?.category as string;
        await executeListProjects(category, router);
        return true;
      }

      case "search_projects": {
        const query = args?.query as string;
        if (!query) {
          console.error("[ActionMapper] Missing query for search_projects action");
          return false;
        }
        await executeSearchProjects(query, router);
        return true;
      }

      case "provide_nav": {
        await executeProvideNav(router);
        return true;
      }

      case "collect_contact": {
        // Contact collection is conversational - Ozzy asks for info in chat
        // No direct action needed, just send the follow-up message
        return false;
      }

      case "none": {
        // No action needed, just send message
        return false;
      }

      default: {
        console.error(`[ActionMapper] Unknown action type: ${action}`);
        return false;
      }
    }
  } catch (error) {
    console.error("[ActionMapper] Action execution failed:", {
      action,
      args,
      error: error instanceof Error ? error.message : error,
    });
    return false;
  }
}

/**
 * Download resume in specified format
 */
async function executeDownloadResume(format: string): Promise<void> {
  try {
    const response = await fetch("/api/tools/download-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format }),
    });

    if (!response.ok) {
      throw new Error(`Resume download failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.data?.url) {
      // Open download URL in new tab
      window.open(data.data.url, "_blank");
    } else {
      throw new Error(data.error || "Download URL not available");
    }
  } catch (error) {
    console.error("[ActionMapper] Resume download error:", error);
    throw error;
  }
}

/**
 * Navigate to project detail page
 */
function executeOpenProject(
  slug: string,
  router?: { push: (url: string) => void }
): void {
  const projectUrl = `/projects/${slug}`;

  if (router) {
    // Use Next.js router for client-side navigation
    router.push(projectUrl);
  } else {
    // Fallback to window.location
    window.location.href = projectUrl;
  }
}

/**
 * List projects with optional category filter
 */
async function executeListProjects(
  category?: string,
  router?: { push: (url: string) => void }
): Promise<void> {
  // Navigate to projects page with optional category filter
  const projectsUrl = category
    ? `/projects?category=${encodeURIComponent(category)}`
    : "/projects";

  if (router) {
    router.push(projectsUrl);
  } else {
    window.location.href = projectsUrl;
  }
}

/**
 * Search projects using semantic search
 */
async function executeSearchProjects(
  query: string,
  router?: { push: (url: string) => void }
): Promise<void> {
  // Navigate to projects page with search query
  const searchUrl = `/projects?search=${encodeURIComponent(query)}`;

  if (router) {
    router.push(searchUrl);
  } else {
    window.location.href = searchUrl;
  }
}

/**
 * Provide navigation links
 */
async function executeProvideNav(
  router?: { push: (url: string) => void }
): Promise<void> {
  // This action is typically conversational - Ozzy provides nav links in chat
  // Could optionally navigate to home page or show nav menu

  // Optional: Navigate to home page
  if (router) {
    router.push("/");
  }
}
