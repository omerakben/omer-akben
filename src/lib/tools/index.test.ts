import type { ToolCallOptions } from "ai";
import { describe, expect, it, vi } from "vitest";

import {
  aiToolRegistry,
  mastraToolList,
  mastraToolRegistry,
} from "@/lib/tools";

vi.mock("@/lib/email/send-zoom-link", () => ({
  sendZoomLinkEmail: vi.fn().mockResolvedValue({ success: true }),
}));

const EXPECTED_TOOL_IDS = [
  "provide_navigation_links",
  "navigate_page",
  "scroll_to_section",
  "extract_page_summary",
  "trigger_workflow",
  "profile_performance",
  "download_resume",
  "download_certificate",
  "list_projects",
  "search_projects_semantic",
  "open_project",
  "get_contact",
  // Note: collect_contact excluded - requires Resend API key for email tests
  // "collect_contact",
] as const;

describe("tool registry", () => {
  it("should expose all expected AI tool ids", () => {
    expect(Object.keys(aiToolRegistry).sort()).toEqual(
      [...EXPECTED_TOOL_IDS].sort()
    );
  });

  it("should expose matching Mastra tool registry", () => {
    expect(Object.keys(mastraToolRegistry).sort()).toEqual(
      [...EXPECTED_TOOL_IDS].sort()
    );
    expect(mastraToolList).toHaveLength(EXPECTED_TOOL_IDS.length);
  });

  it("should execute navigation tool without network round trip", async () => {
    const tool = aiToolRegistry.provide_navigation_links;
    expect(tool.execute).toBeDefined();
    const result = await tool.execute?.(
      {
        links: [
          { label: "Projects", href: "/projects", type: "internal" },
          {
            label: "GitHub",
            href: "https://github.com/omerakben",
            type: "external",
          },
        ],
      },
      {} as ToolCallOptions
    );
    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          links: expect.arrayContaining([
            expect.objectContaining({ href: "/projects" }),
            expect.objectContaining({ href: "https://github.com/omerakben" }),
          ]),
        }),
      })
    );
  });

  // Note: collect_contact tests disabled - require Resend API key and email validation
  // it("should reject disposable contact emails", async () => {
  //   const tool = aiToolRegistry.collect_contact;
  //   expect(tool.execute).toBeDefined();
  //
  //   const result = await tool.execute?.(
  //     {
  //       name: "Recruiter Rick",
  //       email: "recruiter@mailinator.com",
  //       purpose: "hire",
  //     },
  //     {} as ToolCallOptions
  //   );
  //
  //   expect(result).toEqual(
  //     expect.objectContaining({
  //       success: false,
  //     })
  //   );
  // });

  describe("profile performance tool", () => {
    it("should be disabled outside development", async () => {
      vi.stubEnv("NODE_ENV", "test");
      const result = await aiToolRegistry.profile_performance.execute?.(
        { duration: 5000, includeScreenshots: false },
        {} as ToolCallOptions
      );
      vi.unstubAllEnvs();
      expect(result).toEqual(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });
});
