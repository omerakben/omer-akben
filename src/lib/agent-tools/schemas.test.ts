import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import {
  downloadCertificateInputSchema,
  downloadCertificateOutputSchema,
  downloadResumeInputSchema,
  downloadResumeOutputSchema,
  extractPageSummaryInputSchema,
  extractPageSummaryOutputSchema,
  getContactInputSchema,
  getContactOutputSchema,
  listProjectsInputSchema,
  navigatePageInputSchema,
  openProjectInputSchema,
  profilePerformanceInputSchema,
  profilePerformanceOutputSchema,
  provideNavigationLinksInputSchema,
  scrollToSectionInputSchema,
  toolResponseSchema,
  triggerWorkflowInputSchema,
  triggerWorkflowOutputSchema,
} from "@/lib/tools/zod-schemas";

describe("agent-tools schemas", () => {
  describe("toolResponseSchema", () => {
    it("should validate successful response", () => {
      const result = toolResponseSchema.parse({
        success: true,
        data: { message: "Success" },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ message: "Success" });
    });

    it("should validate error response", () => {
      const result = toolResponseSchema.parse({
        success: false,
        error: "Something went wrong",
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Something went wrong");
    });

    it("should require success boolean", () => {
      expect(() => toolResponseSchema.parse({})).toThrow(ZodError);
    });
  });

  describe("downloadResumeInputSchema", () => {
    it("should accept 'resume' format", () => {
      const result = downloadResumeInputSchema.parse({ format: "resume" });
      expect(result.format).toBe("resume");
    });

    it("should accept 'extended' format", () => {
      const result = downloadResumeInputSchema.parse({ format: "extended" });
      expect(result.format).toBe("extended");
    });

    it("should default to 'resume' when no format provided", () => {
      const result = downloadResumeInputSchema.parse({});
      expect(result.format).toBe("resume");
    });

    it("should reject invalid format", () => {
      expect(() =>
        downloadResumeInputSchema.parse({ format: "invalid" })
      ).toThrow(ZodError);
    });
  });

  describe("downloadResumeOutputSchema", () => {
    it("should validate complete resume output", () => {
      const result = downloadResumeOutputSchema.parse({
        url: "https://example.com/resume.pdf",
        filename: "resume.pdf",
        size: 1024,
        format: "pdf",
        googleDriveUrl: "https://drive.google.com/file/123",
      });
      expect(result.url).toBe("https://example.com/resume.pdf");
      expect(result.filename).toBe("resume.pdf");
      expect(result.size).toBe(1024);
    });

    it("should accept relative paths for URL", () => {
      const result = downloadResumeOutputSchema.parse({
        url: "/assets/resume.pdf",
        filename: "resume.pdf",
        size: 1024,
        format: "pdf",
      });
      expect(result.url).toBe("/assets/resume.pdf");
    });

    it("should allow missing googleDriveUrl", () => {
      const result = downloadResumeOutputSchema.parse({
        url: "https://example.com/resume.pdf",
        filename: "resume.pdf",
        size: 1024,
        format: "pdf",
      });
      expect(result.googleDriveUrl).toBeUndefined();
    });
  });

  describe("listProjectsInputSchema", () => {
    it("should accept valid category", () => {
      const result = listProjectsInputSchema.parse({ category: "ai-ml" });
      expect(result.category).toBe("ai-ml");
    });

    it("should accept featured filter", () => {
      const result = listProjectsInputSchema.parse({ featured: true });
      expect(result.featured).toBe(true);
    });

    it("should accept limit within range", () => {
      const result = listProjectsInputSchema.parse({ limit: 10 });
      expect(result.limit).toBe(10);
    });

    it("should reject limit less than 1", () => {
      expect(() => listProjectsInputSchema.parse({ limit: 0 })).toThrow(
        ZodError
      );
    });

    it("should reject limit greater than 50", () => {
      expect(() => listProjectsInputSchema.parse({ limit: 51 })).toThrow(
        ZodError
      );
    });

    it("should accept all optional parameters together", () => {
      const result = listProjectsInputSchema.parse({
        category: "web",
        featured: true,
        limit: 5,
      });
      expect(result.category).toBe("web");
      expect(result.featured).toBe(true);
      expect(result.limit).toBe(5);
    });
  });

  describe("openProjectInputSchema", () => {
    it("should require slug", () => {
      const result = openProjectInputSchema.parse({
        slug: "elon-ai-agent",
      });
      expect(result.slug).toBe("elon-ai-agent");
    });

    it("should accept empty slug (no min length validation)", () => {
      const result = openProjectInputSchema.parse({ slug: "" });
      expect(result.slug).toBe("");
    });

    it("should reject missing slug", () => {
      expect(() => openProjectInputSchema.parse({})).toThrow(ZodError);
    });
  });

  describe("getContactInputSchema", () => {
    it("should accept empty object", () => {
      const result = getContactInputSchema.parse({});
      expect(result).toEqual({});
    });
  });

  describe("getContactOutputSchema", () => {
    it("should validate complete contact info", () => {
      const result = getContactOutputSchema.parse({
        contact: {
          email: "me@omerakben.com",
          phone: "+1-234-567-8900",
          location: "Nashville, TN",
          linkedin: "https://linkedin.com/in/omerakben",
          github: "https://github.com/omerakben",
          twitter: "https://x.com/mrfrkkbn",
        },
      });
      expect(result.contact.email).toBe("me@omerakben.com");
    });

    it("should require valid email", () => {
      expect(() =>
        getContactOutputSchema.parse({
          contact: {
            email: "invalid-email",
            location: "Nashville, TN",
            linkedin: "https://linkedin.com/in/user",
            github: "https://github.com/user",
          },
        })
      ).toThrow(ZodError);
    });

    it("should allow missing optional fields", () => {
      const result = getContactOutputSchema.parse({
        contact: {
          email: "me@omerakben.com",
          location: "Nashville, TN",
          linkedin: "https://linkedin.com/in/omerakben",
          github: "https://github.com/omerakben",
        },
      });
      expect(result.contact.phone).toBeUndefined();
      expect(result.contact.twitter).toBeUndefined();
    });
  });

  describe("downloadCertificateInputSchema", () => {
    it("should accept 'aws' type", () => {
      const result = downloadCertificateInputSchema.parse({ type: "aws" });
      expect(result.type).toBe("aws");
    });

    it("should accept 'nss' type", () => {
      const result = downloadCertificateInputSchema.parse({ type: "nss" });
      expect(result.type).toBe("nss");
    });

    it("should reject invalid type", () => {
      expect(() =>
        downloadCertificateInputSchema.parse({ type: "invalid" })
      ).toThrow(ZodError);
    });

    it("should require type field", () => {
      expect(() => downloadCertificateInputSchema.parse({})).toThrow(ZodError);
    });
  });

  describe("downloadCertificateOutputSchema", () => {
    it("should validate complete certificate output", () => {
      const result = downloadCertificateOutputSchema.parse({
        url: "https://example.com/cert.pdf",
        filename: "aws-cert.pdf",
        size: 2048,
        format: "pdf",
        certificateName: "AWS Cloud Practitioner Essentials",
        issuer: "Amazon Web Services",
        year: "2022",
      });
      expect(result.certificateName).toBe("AWS Cloud Practitioner Essentials");
      expect(result.issuer).toBe("Amazon Web Services");
      expect(result.year).toBe("2022");
    });

    it("should require all mandatory fields", () => {
      expect(() =>
        downloadCertificateOutputSchema.parse({
          url: "https://example.com/cert.pdf",
          filename: "cert.pdf",
          size: 2048,
          format: "pdf",
          // Missing certificateName, issuer, year
        })
      ).toThrow(ZodError);
    });
  });

  describe("provideNavigationLinksInputSchema", () => {
    it("should validate navigation links with all fields", () => {
      const result = provideNavigationLinksInputSchema.parse({
        links: [
          {
            label: "View Project",
            href: "/projects/north-glass",
            icon: "briefcase",
            type: "internal",
          },
          {
            label: "GitHub",
            href: "https://github.com/repo",
            icon: "github",
            type: "external",
          },
        ],
      });
      expect(result.links).toHaveLength(2);
      expect(result.links[0].label).toBe("View Project");
      expect(result.links[1].type).toBe("external");
    });

    it("should allow missing icon", () => {
      const result = provideNavigationLinksInputSchema.parse({
        links: [
          {
            label: "Link",
            href: "/path",
            type: "internal",
          },
        ],
      });
      expect(result.links[0].icon).toBeUndefined();
    });

    it("should reject invalid icon name", () => {
      expect(() =>
        provideNavigationLinksInputSchema.parse({
          links: [
            {
              label: "Link",
              href: "/path",
              icon: "invalid-icon",
              type: "internal",
            },
          ],
        })
      ).toThrow(ZodError);
    });

    it("should require type to be internal or external", () => {
      expect(() =>
        provideNavigationLinksInputSchema.parse({
          links: [
            {
              label: "Link",
              href: "/path",
              type: "invalid",
            },
          ],
        })
      ).toThrow(ZodError);
    });
  });

  describe("navigatePageInputSchema", () => {
    it("should accept valid URL", () => {
      const result = navigatePageInputSchema.parse({
        url: "https://omerakben.com/projects",
      });
      expect(result.url).toBe("https://omerakben.com/projects");
    });

    it("should default waitUntil to 'load'", () => {
      const result = navigatePageInputSchema.parse({
        url: "https://omerakben.com/projects",
      });
      expect(result.waitUntil).toBe("load");
    });

    it("should accept valid waitUntil values", () => {
      const result1 = navigatePageInputSchema.parse({
        url: "https://omerakben.com/",
        waitUntil: "domcontentloaded",
      });
      expect(result1.waitUntil).toBe("domcontentloaded");

      const result2 = navigatePageInputSchema.parse({
        url: "https://omerakben.com/",
        waitUntil: "networkidle",
      });
      expect(result2.waitUntil).toBe("networkidle");
    });

    it("should reject invalid URL", () => {
      expect(() => navigatePageInputSchema.parse({ url: "not-a-url" })).toThrow(
        ZodError
      );
    });

    it("should reject invalid waitUntil value", () => {
      expect(() =>
        navigatePageInputSchema.parse({
          url: "https://omerakben.com/",
          waitUntil: "invalid",
        })
      ).toThrow(ZodError);
    });
  });

  describe("scrollToSectionInputSchema", () => {
    it("should accept CSS selector", () => {
      const result = scrollToSectionInputSchema.parse({
        selector: "#projects",
      });
      expect(result.selector).toBe("#projects");
    });

    it("should default behavior to 'smooth'", () => {
      const result = scrollToSectionInputSchema.parse({
        selector: "#contact",
      });
      expect(result.behavior).toBe("smooth");
    });

    it("should accept 'instant' behavior", () => {
      const result = scrollToSectionInputSchema.parse({
        selector: "#about",
        behavior: "instant",
      });
      expect(result.behavior).toBe("instant");
    });

    it("should reject invalid behavior value", () => {
      expect(() =>
        scrollToSectionInputSchema.parse({
          selector: "#test",
          behavior: "invalid",
        })
      ).toThrow(ZodError);
    });

    it("should require selector", () => {
      expect(() => scrollToSectionInputSchema.parse({})).toThrow(ZodError);
    });
  });

  describe("extractPageSummaryInputSchema", () => {
    it("should default maxLength to 200", () => {
      const result = extractPageSummaryInputSchema.parse({});
      expect(result.maxLength).toBe(200);
    });

    it("should accept maxLength within range", () => {
      const result = extractPageSummaryInputSchema.parse({ maxLength: 150 });
      expect(result.maxLength).toBe(150);
    });

    it("should reject maxLength below minimum (50)", () => {
      expect(() =>
        extractPageSummaryInputSchema.parse({ maxLength: 49 })
      ).toThrow(ZodError);
    });

    it("should reject maxLength above maximum (500)", () => {
      expect(() =>
        extractPageSummaryInputSchema.parse({ maxLength: 501 })
      ).toThrow(ZodError);
    });

    it("should accept boundary values", () => {
      const result1 = extractPageSummaryInputSchema.parse({ maxLength: 50 });
      expect(result1.maxLength).toBe(50);

      const result2 = extractPageSummaryInputSchema.parse({ maxLength: 500 });
      expect(result2.maxLength).toBe(500);
    });
  });

  describe("extractPageSummaryOutputSchema", () => {
    it("should validate summary output", () => {
      const result = extractPageSummaryOutputSchema.parse({
        summary: "This is a page summary.",
        wordCount: 5,
      });
      expect(result.summary).toBe("This is a page summary.");
      expect(result.wordCount).toBe(5);
    });

    it("should require both summary and wordCount", () => {
      expect(() =>
        extractPageSummaryOutputSchema.parse({ summary: "test" })
      ).toThrow(ZodError);
    });
  });

  describe("triggerWorkflowInputSchema", () => {
    it("should accept workflow trigger input with empty payload", () => {
      const result = triggerWorkflowInputSchema.parse({
        workflowId: "workflow-123",
        payload: {},
      });
      expect(result.workflowId).toBe("workflow-123");
      expect(result.payload).toEqual({});
    });

    it("should default waitForResult to true", () => {
      const result = triggerWorkflowInputSchema.parse({
        workflowId: "workflow-123",
        payload: {},
      });
      expect(result.waitForResult).toBe(true);
    });

    it("should accept waitForResult as false", () => {
      const result = triggerWorkflowInputSchema.parse({
        workflowId: "workflow-123",
        payload: {},
        waitForResult: false,
      });
      expect(result.waitForResult).toBe(false);
    });

    it("should require workflowId and payload", () => {
      expect(() =>
        triggerWorkflowInputSchema.parse({ workflowId: "test" })
      ).toThrow(ZodError);

      expect(() => triggerWorkflowInputSchema.parse({ payload: {} })).toThrow(
        ZodError
      );
    });
  });

  describe("triggerWorkflowOutputSchema", () => {
    it("should validate workflow output for completed status", () => {
      const result = triggerWorkflowOutputSchema.parse({
        workflowId: "workflow-123",
        status: "completed",
        result: { output: "success" },
        message: "Workflow completed successfully",
      });
      expect(result.status).toBe("completed");
      expect(result.result).toEqual({ output: "success" });
    });

    it("should accept running status without result", () => {
      const result = triggerWorkflowOutputSchema.parse({
        workflowId: "workflow-123",
        status: "running",
        message: "Workflow is running",
      });
      expect(result.status).toBe("running");
      expect(result.result).toBeUndefined();
    });

    it("should accept failed status", () => {
      const result = triggerWorkflowOutputSchema.parse({
        workflowId: "workflow-123",
        status: "failed",
        message: "Workflow failed",
      });
      expect(result.status).toBe("failed");
    });

    it("should reject invalid status", () => {
      expect(() =>
        triggerWorkflowOutputSchema.parse({
          workflowId: "workflow-123",
          status: "pending",
          message: "test",
        })
      ).toThrow(ZodError);
    });
  });

  describe("profilePerformanceInputSchema", () => {
    it("should default duration to 5000ms", () => {
      const result = profilePerformanceInputSchema.parse({});
      expect(result.duration).toBe(5000);
    });

    it("should default includeScreenshots to false", () => {
      const result = profilePerformanceInputSchema.parse({});
      expect(result.includeScreenshots).toBe(false);
    });

    it("should accept duration within range", () => {
      const result = profilePerformanceInputSchema.parse({ duration: 10000 });
      expect(result.duration).toBe(10000);
    });

    it("should reject duration below minimum (1000ms)", () => {
      expect(() =>
        profilePerformanceInputSchema.parse({ duration: 999 })
      ).toThrow(ZodError);
    });

    it("should reject duration above maximum (30000ms)", () => {
      expect(() =>
        profilePerformanceInputSchema.parse({ duration: 30001 })
      ).toThrow(ZodError);
    });

    it("should accept includeScreenshots as true", () => {
      const result = profilePerformanceInputSchema.parse({
        includeScreenshots: true,
      });
      expect(result.includeScreenshots).toBe(true);
    });

    it("should accept boundary values", () => {
      const result1 = profilePerformanceInputSchema.parse({ duration: 1000 });
      expect(result1.duration).toBe(1000);

      const result2 = profilePerformanceInputSchema.parse({ duration: 30000 });
      expect(result2.duration).toBe(30000);
    });
  });

  describe("profilePerformanceOutputSchema", () => {
    it("should validate complete performance metrics", () => {
      const result = profilePerformanceOutputSchema.parse({
        metrics: {
          lcp: 2500,
          fid: 100,
          cls: 0.1,
          ttfb: 500,
        },
        suggestions: ["Optimize images", "Reduce JavaScript"],
        traceUrl: "https://example.com/trace.json",
      });
      expect(result.metrics.lcp).toBe(2500);
      expect(result.suggestions).toHaveLength(2);
      expect(result.traceUrl).toBe("https://example.com/trace.json");
    });

    it("should allow optional metric fields", () => {
      const result = profilePerformanceOutputSchema.parse({
        metrics: {
          lcp: 2500,
        },
        suggestions: ["Optimize images"],
      });
      expect(result.metrics.fid).toBeUndefined();
      expect(result.metrics.cls).toBeUndefined();
      expect(result.metrics.ttfb).toBeUndefined();
      expect(result.traceUrl).toBeUndefined();
    });

    it("should require metrics and suggestions", () => {
      expect(() =>
        profilePerformanceOutputSchema.parse({
          suggestions: ["test"],
        })
      ).toThrow(ZodError);

      expect(() =>
        profilePerformanceOutputSchema.parse({
          metrics: {},
        })
      ).toThrow(ZodError);
    });
  });
});
