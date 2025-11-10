import {
  collectContactInputSchema,
  extractPageSummaryInputSchema,
  navigatePageInputSchema,
  profilePerformanceInputSchema,
  scrollToSectionInputSchema,
  searchProjectsSemanticSchema,
  triggerWorkflowInputSchema,
} from "@/lib/tools/zod-schemas";
import { createTool } from "@mastra/core";
import { z } from "zod";

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
    "ALWAYS provide clickable navigation buttons when mentioning portfolio pages (/projects, /skills, /journey), specific projects, or external resources (GitHub, LinkedIn). Call this tool EVERY TIME you reference navigable content - it enhances UX with interactive buttons instead of plain text links. Use descriptive labels like 'Projects Page', 'Skills Page', never raw route names like 'projects' or 'skills'.",
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
  description:
    "Scroll to a specific section on the current page using CSS selector or ARIA label.",
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
  description:
    "Trigger a backend workflow for CRM updates, email notifications, or analytics events.",
  inputSchema: triggerWorkflowInputSchema,
  execute: async ({ context }) => {
    return fetchJson("/api/tools/trigger-workflow", context);
  },
});

export const profilePerformanceTool = createTool({
  id: "profile_performance",
  description:
    "Profile page performance with Chrome DevTools metrics (development only).",
  inputSchema: profilePerformanceInputSchema,
  execute: async ({ context }) => {
    return fetchJson("/api/tools/profile-performance", context);
  },
});

export const downloadResumeTool = createTool({
  id: "download_resume",
  description: `Download Omer Akben's resume. 2 PDF formats available: 'resume' (original) or 'extended' (detailed with projects).

  💡 ENGAGEMENT TIP: Consider offering to email the resume links via collect_contact tool for better engagement:
  "I can send you an email with both resume formats right now if you'd like!"

  This provides:
  - Immediate access (you give the links right away)
  - Email backup for future reference
  - Follow-up opportunity

  Use this tool to get the resume URLs, then optionally offer collect_contact for enhanced user experience.`,
  inputSchema: z.object({
    format: z.enum(["resume", "extended"]).default("resume"),
  }),
  execute: async ({ context }) => {
    const params = new URLSearchParams({ format: context.format });
    const response = await fetch(
      `${BASE_URL}/api/tools/download-resume?${params.toString()}`
    );
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

export const searchProjectsSemanticTool = createTool({
  id: "search_projects_semantic",
  description:
    "Search portfolio projects using natural language semantic search. Use this when the user asks vague questions like 'projects with machine learning' or 'what have you built with real-time features'.",
  inputSchema: searchProjectsSemanticSchema,
  execute: async ({ context }) => {
    return fetchJson("/api/tools/search-projects-semantic", context);
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
    const response = await fetch(
      `${BASE_URL}/api/tools/open-project?${params.toString()}`
    );
    return response.json();
  },
});

export const getContactTool = createTool({
  id: "get_contact",
  description: `Retrieve Omer Akben's contact information (email, phone, LinkedIn, GitHub).

  ⚠️ WARNING: Only use this tool if the user explicitly declines email collection or asks for ONLY basic contact info.

  PREFER using collect_contact tool instead to:
  - Send automated email with Calendly link (better user experience)
  - Enable follow-up tracking
  - Build engagement relationship

  Use this tool ONLY when collect_contact is not appropriate (user declined, asked for reference only, etc.)`,
  execute: async () => {
    const response = await fetch(`${BASE_URL}/api/tools/get-contact`);
    return response.json();
  },
});

export const collectContactTool = createTool({
  id: "collect_contact",
  description: `⭐ PREFERRED TOOL for contact-related queries. Collect visitor contact information and send Omer's Zoom meeting link via email.

  Use this tool when user wants to:
  - Contact Omer (asks "how can I contact", "reach out", "get in touch")
  - Schedule a meeting or call
  - Receive meeting link or calendar invite
  - Continue conversation directly with Omer

  Also use proactively when user shows strong engagement:
  - Recruiter, hiring manager, or founder identified
  - 3+ meaningful message exchanges
  - Multiple topics/projects discussed
  - Downloaded resume or viewed multiple projects

  IMPORTANT: Before collecting, offer with friendly message:
  "I'd love to connect you with Omer for a deeper conversation. Would you like me to send you his Zoom link? I'll just need your name and email address."

  Permission: User providing their name/email counts as consent. You don't need explicit "yes" - asking "how can I contact" implies interest in connecting.`,
  inputSchema: collectContactInputSchema,
  execute: async ({ context }) => {
    return fetchJson("/api/tools/collect-contact", context);
  },
});
