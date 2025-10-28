import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ToolCallOptions } from "ai";

vi.mock("@/lib/email/send-zoom-link", () => ({
  sendZoomLinkEmail: vi
    .fn()
    .mockResolvedValue({ success: true, messageId: "email_123" }),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkContactRateLimit: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/redis/contact-storage", () => ({
  saveContactToRedis: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/redis/embeddings", () => ({
  searchProjectsBySimilarity: vi
    .fn()
    .mockResolvedValue([
      { slug: "sample", score: 0.9, project: { slug: "sample" } },
    ]),
}));

import {
  collectContact,
  downloadCertificate,
  downloadResume,
  extractPageSummary,
  getContact,
  listProjects,
  navigatePage,
  openProject,
  portfolioTools,
  profilePerformance,
  provideNavigationLinks,
  scrollToSection,
  searchProjectsSemantic,
  triggerWorkflow,
} from "@/lib/tools";

const originalEnv = { ...process.env };

beforeEach(async () => {
  process.env = {
    ...originalEnv,
    NODE_ENV: "development",
    OMER_ZOOM_LINK: "https://zoom.example",
  };

  const { checkContactRateLimit } = await import("@/lib/rate-limit");
  vi.mocked(checkContactRateLimit).mockResolvedValue(true);

  const { sendZoomLinkEmail } = await import("@/lib/email/send-zoom-link");
  vi.mocked(sendZoomLinkEmail).mockResolvedValue({
    success: true,
    messageId: "email_123",
  });
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("tools library", () => {
  it("provides navigation links without modification", () => {
    const links = [{ label: "Projects", href: "/projects", type: "internal" as const }];
    expect(provideNavigationLinks({ links })).toEqual({ links });
  });

  it("navigates to allowed domains and rejects others", () => {
    const result = navigatePage({ url: "https://omerakben.com/projects" });
    expect(result.message).toContain("Navigating to");
    expect(result.waitUntil).toBe("load");

    expect(() => navigatePage({ url: "https://example.com" })).toThrow(
      /restricted/
    );
  });

  it("scrolls to selector with default behavior", () => {
    expect(scrollToSection({ selector: "#hero" })).toEqual({
      selector: "#hero",
      behavior: "smooth",
      message: "Scrolling to #hero",
    });
  });

  it("returns resume metadata for known format", () => {
    const resume = downloadResume({ format: "resume" });
    expect(resume.filename).toContain("Resume");
  });

  it("returns certificate details for AWS", () => {
    const certificate = downloadCertificate({ type: "aws" });
    expect(certificate.certificateName).toContain("AWS");
  });

  it("lists projects with filters applied", () => {
    const result = listProjects({ category: "web", limit: 2 });
    expect(result.projects.length).toBeLessThanOrEqual(2);
    expect(result.total).toBeGreaterThanOrEqual(result.projects.length);
  });

  it("runs profile performance only in development", () => {
    const metrics = profilePerformance({ includeScreenshots: true });
    expect(metrics.metrics.lcp).toBeGreaterThan(0);
    process.env.NODE_ENV = "production";
    expect(() => profilePerformance({})).toThrow(/development mode/);
  });

  it("summarizes page content respecting max length", () => {
    const summary = extractPageSummary({ maxLength: 5 });
    expect(summary.wordCount).toBe(5);
  });

  it("performs semantic search via embedding helper", async () => {
    const result = await searchProjectsSemantic({ query: "ai" });
    expect(result.count).toBe(1);
  });

  it("retrieves static contact info", () => {
    const result = getContact({});
    expect(result.contact.email).toContain("@");
  });

  it("opens project by slug", () => {
    const project = openProject({ slug: "north-glass" });
    expect(project.project.slug).toBe("north-glass");
  });

  it("triggers workflow with mock response", async () => {
    const response = await triggerWorkflow({
      workflowId: "demo",
      payload: {},
      waitForResult: true,
    });
    expect(response.status).toBe("completed");
  });

  it("collects contact data with rate limit context", async () => {
    const options = { experimental_context: { ip: "203.0.113.1" } } as ToolCallOptions;
    const result = await collectContact(
      {
        name: "Ada Lovelace",
        email: "ada@example.com",
        company: "Babbage Labs",
        purpose: "hire",
      },
      options
    );
    expect(result.success).toBe(true);
    expect(result.emailSent).toBe(true);
  });

  it("enforces rate limit failures", async () => {
    const { checkContactRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkContactRateLimit).mockResolvedValueOnce(false);

    await expect(
      collectContact({
        name: "Grace Hopper",
        email: "grace@example.com",
        purpose: "consult",
      })
    ).rejects.toThrow(/limit reached/);
  });

  it("rejects invalid contact email", async () => {
    await expect(
      collectContact({
        name: "Invalid",
        email: "not-an-email",
        purpose: "other",
      })
    ).rejects.toThrow(/Invalid email/);
  });

  it("exposes portfolio tool registry with expected keys", () => {
    expect(portfolioTools.collect_contact).toBeDefined();
    expect(Object.keys(portfolioTools)).toContain("navigate_page");
  });
});
