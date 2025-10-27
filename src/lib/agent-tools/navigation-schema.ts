import { z } from "zod";

/**
 * Navigation Tool Schema
 * Allows AI agent to suggest navigation to relevant pages
 */

export const navigatePageSchema = z.object({
  page: z
    .enum([
      "home",
      "projects",
      "project-detail",
      "skills",
      "journey",
      "credentials",
      "contact",
      "recruiter",
      "chat",
    ])
    .describe("The page to navigate to"),

  slug: z
    .string()
    .optional()
    .describe(
      "Project slug for project-detail page (e.g., 'north-glass', 'elon-ai-agent')"
    ),

  reason: z
    .string()
    .describe(
      "Brief explanation of why this page is relevant to the user's query"
    ),
});

export type NavigatePageInput = z.infer<typeof navigatePageSchema>;

/**
 * Page metadata for agent context
 */
export const pageMetadata = {
  home: {
    path: "/",
    title: "Home",
    description:
      "Hero section with introduction and featured projects overview",
  },
  projects: {
    path: "/projects",
    title: "Projects",
    description:
      "Complete portfolio of 9 projects across AI/ML, web development, and automation",
  },
  "project-detail": {
    path: "/projects/[slug]",
    title: "Project Detail",
    description:
      "Detailed view of specific project with full description, tech stack, and links",
    requiresSlug: true,
  },
  skills: {
    path: "/skills",
    title: "Skills & Expertise",
    description:
      "Comprehensive skill matrix organized by category (languages, frameworks, AI/ML, cloud, tools)",
  },
  journey: {
    path: "/journey",
    title: "Career Journey",
    description: "Professional timeline with key milestones and experiences",
  },
  credentials: {
    path: "/credentials",
    title: "Credentials",
    description:
      "Education, certifications (AWS, NSS), and professional qualifications",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description: "Contact information, social links, and availability status",
  },
  recruiter: {
    path: "/recruiter",
    title: "Recruiter Hub",
    description:
      "Quick-access hub for recruiters with resume downloads and key highlights",
  },
  chat: {
    path: "/chat",
    title: "Chat with Ozzy",
    description:
      "AI assistant for answering questions about experience, skills, and projects",
  },
} as const;

export type PageKey = keyof typeof pageMetadata;
