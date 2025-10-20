import { createTool } from "@mastra/core";
import { z } from "zod";
import {
  extractPageSummaryInputSchema,
  navigatePageInputSchema,
  profilePerformanceInputSchema,
  scrollToSectionInputSchema,
  triggerWorkflowInputSchema,
} from "@/lib/agent-tools/schemas";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const fetchJson = async (path: string, body?: unknown) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
};

export const provideNavigationLinksTool = createTool({
  id: "provide_navigation_links",
  description:
    "Provide clickable navigation buttons for visitors to easily navigate to pages, projects, or external resources.",
  inputSchema: z.object({
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        type: z.enum(["internal", "external"]),
      })
    ),
  }),
  execute: async ({ context }) => {
    return {
      success: true,
      data: { links: context.links },
    };
  },
});

export const navigatePageTool = createTool({
  id: "navigate_page",
  description: "Navigate to a specific page on omerakben.com.",
  inputSchema: navigatePageInputSchema,
  execute: async ({ context }) => {
    return fetchJson("/api/tools/navigate-page", context);
  },
});

export const scrollToSectionTool = createTool({
  id: "scroll_to_section",
  description: "Scroll to a specific section on the current page using CSS selector or ARIA label.",
  inputSchema: scrollToSectionInputSchema,
  execute: async ({ context }) => {
    return {
      success: true,
      data: {
        selector: context.selector,
        behavior: context.behavior,
        message: `Scrolling to ${context.selector}`,
      },
    };
  },
});

export const extractPageSummaryTool = createTool({
  id: "extract_page_summary",
  description: "Extract and summarize the current page content.",
  inputSchema: extractPageSummaryInputSchema,
  execute: async ({ context }) => {
    return fetchJson("/api/tools/extract-summary", context);
  },
});

export const triggerWorkflowTool = createTool({
  id: "trigger_workflow",
  description: "Trigger a backend workflow for CRM updates, email notifications, or analytics events.",
  inputSchema: triggerWorkflowInputSchema,
  execute: async ({ context }) => {
    return fetchJson("/api/tools/trigger-workflow", context);
  },
});

export const profilePerformanceTool = createTool({
  id: "profile_performance",
  description: "Profile page performance with Chrome DevTools metrics (development only).",
  inputSchema: profilePerformanceInputSchema,
  execute: async ({ context }) => {
    return fetchJson("/api/tools/profile-performance", context);
  },
});

export const downloadResumeTool = createTool({
  id: "download_resume",
  description: "Download the latest version of Omer Akben's resume in the requested format.",
  inputSchema: z.object({
    format: z.enum(["pdf", "docx"]).default("pdf"),
  }),
  execute: async ({ context }) => {
    const params = new URLSearchParams({ format: context.format });
    const response = await fetch(`${BASE_URL}/api/tools/download-resume?${params.toString()}`);
    return response.json();
  },
});

export const listProjectsTool = createTool({
  id: "list_projects",
  description: "List portfolio projects with optional tag filters.",
  inputSchema: z.object({
    tag: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const query = context.tag ? `?tag=${encodeURIComponent(context.tag)}` : "";
    const response = await fetch(`${BASE_URL}/api/tools/list-projects${query}`);
    return response.json();
  },
});

export const openProjectTool = createTool({
  id: "open_project",
  description: "Open a specific project page by slug.",
  inputSchema: z.object({
    slug: z.string(),
  }),
  execute: async ({ context }) => {
    const params = new URLSearchParams({ slug: context.slug });
    const response = await fetch(`${BASE_URL}/api/tools/open-project?${params.toString()}`);
    return response.json();
  },
});

export const getContactTool = createTool({
  id: "get_contact",
  description: "Retrieve the best contact information for Omer Akben.",
  execute: async () => {
    const response = await fetch(`${BASE_URL}/api/tools/get-contact`);
    return response.json();
  },
});
