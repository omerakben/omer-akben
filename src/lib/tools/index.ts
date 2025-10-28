import type { Tool } from "ai";

import {
  collectContact,
  collectContactTool,
} from "./implementations/collect-contact";
import {
  downloadCertificate,
  downloadCertificateTool,
} from "./implementations/download-certificate";
import {
  downloadResume,
  downloadResumeTool,
} from "./implementations/download-resume";
import {
  extractPageSummary,
  extractPageSummaryTool,
} from "./implementations/extract-page-summary";
import { getContact, getContactTool } from "./implementations/get-contact";
import { listProjects, listProjectsTool } from "./implementations/list-projects";
import { navigatePage, navigatePageTool } from "./implementations/navigate-page";
import { openProject, openProjectTool } from "./implementations/open-project";
import {
  profilePerformance,
  profilePerformanceTool,
} from "./implementations/profile-performance";
import {
  provideNavigationLinks,
  provideNavigationLinksTool,
} from "./implementations/provide-navigation-links";
import {
  scrollToSection,
  scrollToSectionTool,
} from "./implementations/scroll-to-section";
import {
  searchProjectsSemantic,
  searchProjectsSemanticTool,
} from "./implementations/search-projects-semantic";
import { triggerWorkflow, triggerWorkflowTool } from "./implementations/trigger-workflow";

export {
  collectContact,
  collectContactTool,
  downloadCertificate,
  downloadCertificateTool,
  downloadResume,
  downloadResumeTool,
  extractPageSummary,
  extractPageSummaryTool,
  getContact,
  getContactTool,
  listProjects,
  listProjectsTool,
  navigatePage,
  navigatePageTool,
  openProject,
  openProjectTool,
  profilePerformance,
  profilePerformanceTool,
  provideNavigationLinks,
  provideNavigationLinksTool,
  scrollToSection,
  scrollToSectionTool,
  searchProjectsSemantic,
  searchProjectsSemanticTool,
  triggerWorkflow,
  triggerWorkflowTool,
};

export const portfolioTools = {
  collect_contact: collectContactTool,
  download_certificate: downloadCertificateTool,
  download_resume: downloadResumeTool,
  extract_page_summary: extractPageSummaryTool,
  get_contact: getContactTool,
  list_projects: listProjectsTool,
  navigate_page: navigatePageTool,
  open_project: openProjectTool,
  profile_performance: profilePerformanceTool,
  provide_navigation_links: provideNavigationLinksTool,
  scroll_to_section: scrollToSectionTool,
  search_projects_semantic: searchProjectsSemanticTool,
  trigger_workflow: triggerWorkflowTool,
} satisfies Record<string, Tool>;

export type PortfolioToolName = keyof typeof portfolioTools;
export const portfolioToolList = Object.values(portfolioTools);
