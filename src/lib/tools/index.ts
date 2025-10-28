import type { ZodTypeAny } from "zod";
import {
  collectContactInputSchema,
  collectContactOutputSchema,
  downloadCertificateInputSchema,
  downloadCertificateOutputSchema,
  downloadResumeInputSchema,
  downloadResumeOutputSchema,
  extractPageSummaryInputSchema,
  extractPageSummaryOutputSchema,
  getContactInputSchema,
  getContactOutputSchema,
  listProjectsInputSchema,
  listProjectsOutputSchema,
  navigatePageInputSchema,
  navigatePageOutputSchema,
  openProjectInputSchema,
  openProjectOutputSchema,
  profilePerformanceInputSchema,
  profilePerformanceOutputSchema,
  provideNavigationLinksInputSchema,
  provideNavigationLinksOutputSchema,
  scrollToSectionInputSchema,
  scrollToSectionOutputSchema,
  searchProjectsSemanticSchema,
  searchProjectsSemanticOutputSchema,
  triggerWorkflowInputSchema,
  triggerWorkflowOutputSchema,
} from "@/lib/tools/zod-schemas";

export type ToolIdentifier =
  | "download_resume"
  | "download_certificate"
  | "list_projects"
  | "search_projects_semantic"
  | "open_project"
  | "get_contact"
  | "provide_navigation_links"
  | "navigate_page"
  | "scroll_to_section"
  | "extract_page_summary"
  | "trigger_workflow"
  | "profile_performance"
  | "collect_contact";

type ToolSchemaContract<InputSchema extends ZodTypeAny, OutputSchema extends ZodTypeAny> = {
  description: string;
  inputSchema: InputSchema;
  outputSchema: OutputSchema;
};

export const toolSchemaRegistry = {
  download_resume: {
    description: "Download the latest resume asset in the requested format.",
    inputSchema: downloadResumeInputSchema,
    outputSchema: downloadResumeOutputSchema,
  },
  download_certificate: {
    description: "Provide certificate download links for verified credentials.",
    inputSchema: downloadCertificateInputSchema,
    outputSchema: downloadCertificateOutputSchema,
  },
  list_projects: {
    description: "List portfolio projects with optional filtering parameters.",
    inputSchema: listProjectsInputSchema,
    outputSchema: listProjectsOutputSchema,
  },
  search_projects_semantic: {
    description: "Perform semantic search over portfolio projects.",
    inputSchema: searchProjectsSemanticSchema,
    outputSchema: searchProjectsSemanticOutputSchema,
  },
  open_project: {
    description: "Retrieve a detailed portfolio project by slug.",
    inputSchema: openProjectInputSchema,
    outputSchema: openProjectOutputSchema,
  },
  get_contact: {
    description: "Return the preferred contact channels for Omer Akben.",
    inputSchema: getContactInputSchema,
    outputSchema: getContactOutputSchema,
  },
  provide_navigation_links: {
    description: "Generate structured navigation link suggestions for the UI.",
    inputSchema: provideNavigationLinksInputSchema,
    outputSchema: provideNavigationLinksOutputSchema,
  },
  navigate_page: {
    description: "Navigate the visitor to a specific page on omerakben.com.",
    inputSchema: navigatePageInputSchema,
    outputSchema: navigatePageOutputSchema,
  },
  scroll_to_section: {
    description: "Scroll the UI to a specific section selector with smooth behavior.",
    inputSchema: scrollToSectionInputSchema,
    outputSchema: scrollToSectionOutputSchema,
  },
  extract_page_summary: {
    description: "Summarize the currently viewed page for quick recaps.",
    inputSchema: extractPageSummaryInputSchema,
    outputSchema: extractPageSummaryOutputSchema,
  },
  trigger_workflow: {
    description: "Trigger backend automation workflows with typed payloads.",
    inputSchema: triggerWorkflowInputSchema,
    outputSchema: triggerWorkflowOutputSchema,
  },
  profile_performance: {
    description: "Profile front-end performance metrics (development only).",
    inputSchema: profilePerformanceInputSchema,
    outputSchema: profilePerformanceOutputSchema,
  },
  collect_contact: {
    description: "Collect visitor contact details and send consented follow-ups.",
    inputSchema: collectContactInputSchema,
    outputSchema: collectContactOutputSchema,
  },
} satisfies Record<
  ToolIdentifier,
  ToolSchemaContract<ZodTypeAny, ZodTypeAny>
>;

export type ToolSchemaRegistry = typeof toolSchemaRegistry;
