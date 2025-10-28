import { createTool as createMastraTool } from "@mastra/core";
import type { Tool as AiTool, ToolCallOptions } from "ai";
import type { ZodTypeAny } from "zod";

import { collectContact } from "@/lib/tools/implementations/collect-contact";
import { downloadCertificate } from "@/lib/tools/implementations/download-certificate";
import { downloadResume } from "@/lib/tools/implementations/download-resume";
import { extractPageSummary } from "@/lib/tools/implementations/extract-page-summary";
import { getContact } from "@/lib/tools/implementations/get-contact";
import { listProjects } from "@/lib/tools/implementations/list-projects";
import { navigatePage } from "@/lib/tools/implementations/navigate-page";
import { openProject } from "@/lib/tools/implementations/open-project";
import { profilePerformance } from "@/lib/tools/implementations/profile-performance";
import { provideNavigationLinks } from "@/lib/tools/implementations/provide-navigation-links";
import { scrollToSection } from "@/lib/tools/implementations/scroll-to-section";
import { searchProjectsSemantic } from "@/lib/tools/implementations/search-projects-semantic";
import { triggerWorkflow } from "@/lib/tools/implementations/trigger-workflow";

const adaptAiToolToMastra = <Input, Output>(
  id: string,
  aiTool: AiTool<Input, Output>
) => {
  if (!aiTool.execute) {
    throw new Error(`AI tool ${id} does not implement execute()`);
  }

  return createMastraTool({
    id,
    description: aiTool.description ?? "",
    inputSchema: aiTool.inputSchema as unknown as ZodTypeAny,
    outputSchema: aiTool.outputSchema as unknown as ZodTypeAny,
    execute: async ({ context }, options) =>
      aiTool.execute!(
        context as Input,
        (options ?? {}) as ToolCallOptions
      ),
  });
};

export const aiToolRegistry = {
  provide_navigation_links: provideNavigationLinks,
  navigate_page: navigatePage,
  scroll_to_section: scrollToSection,
  extract_page_summary: extractPageSummary,
  trigger_workflow: triggerWorkflow,
  profile_performance: profilePerformance,
  download_resume: downloadResume,
  download_certificate: downloadCertificate,
  list_projects: listProjects,
  search_projects_semantic: searchProjectsSemantic,
  open_project: openProject,
  get_contact: getContact,
  collect_contact: collectContact,
} as const;

export type PortfolioToolId = keyof typeof aiToolRegistry;

export const mastraToolRegistry = {
  provide_navigation_links: adaptAiToolToMastra(
    "provide_navigation_links",
    aiToolRegistry.provide_navigation_links
  ),
  navigate_page: adaptAiToolToMastra(
    "navigate_page",
    aiToolRegistry.navigate_page
  ),
  scroll_to_section: adaptAiToolToMastra(
    "scroll_to_section",
    aiToolRegistry.scroll_to_section
  ),
  extract_page_summary: adaptAiToolToMastra(
    "extract_page_summary",
    aiToolRegistry.extract_page_summary
  ),
  trigger_workflow: adaptAiToolToMastra(
    "trigger_workflow",
    aiToolRegistry.trigger_workflow
  ),
  profile_performance: adaptAiToolToMastra(
    "profile_performance",
    aiToolRegistry.profile_performance
  ),
  download_resume: adaptAiToolToMastra(
    "download_resume",
    aiToolRegistry.download_resume
  ),
  download_certificate: adaptAiToolToMastra(
    "download_certificate",
    aiToolRegistry.download_certificate
  ),
  list_projects: adaptAiToolToMastra(
    "list_projects",
    aiToolRegistry.list_projects
  ),
  search_projects_semantic: adaptAiToolToMastra(
    "search_projects_semantic",
    aiToolRegistry.search_projects_semantic
  ),
  open_project: adaptAiToolToMastra("open_project", aiToolRegistry.open_project),
  get_contact: adaptAiToolToMastra("get_contact", aiToolRegistry.get_contact),
  collect_contact: adaptAiToolToMastra(
    "collect_contact",
    aiToolRegistry.collect_contact
  ),
} as const;

export const provideNavigationLinksTool =
  mastraToolRegistry.provide_navigation_links;
export const navigatePageTool = mastraToolRegistry.navigate_page;
export const scrollToSectionTool = mastraToolRegistry.scroll_to_section;
export const extractPageSummaryTool =
  mastraToolRegistry.extract_page_summary;
export const triggerWorkflowTool = mastraToolRegistry.trigger_workflow;
export const profilePerformanceTool =
  mastraToolRegistry.profile_performance;
export const downloadResumeTool = mastraToolRegistry.download_resume;
export const downloadCertificateTool =
  mastraToolRegistry.download_certificate;
export const listProjectsTool = mastraToolRegistry.list_projects;
export const searchProjectsSemanticTool =
  mastraToolRegistry.search_projects_semantic;
export const openProjectTool = mastraToolRegistry.open_project;
export const getContactTool = mastraToolRegistry.get_contact;
export const collectContactTool = mastraToolRegistry.collect_contact;

export const mastraToolList = Object.values(mastraToolRegistry);
