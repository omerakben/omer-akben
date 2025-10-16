import { describe, expect, it } from "vitest";
import {
  contactInfoSchema,
  downloadResumeInputSchema,
  downloadResumeOutputSchema,
  getContactOutputSchema,
  listProjectsInputSchema,
  listProjectsOutputSchema,
  openProjectInputSchema,
  projectSchema,
} from "./schemas";

describe("Agent Tools Schemas", () => {
  describe("downloadResumeInputSchema", () => {
    it("should accept valid format values", () => {
      expect(downloadResumeInputSchema.parse({ format: "resume" })).toEqual({
        format: "resume",
      });
      expect(downloadResumeInputSchema.parse({ format: "extended" })).toEqual({
        format: "extended",
      });
    });

    it("should default to 'resume' when format is not provided", () => {
      expect(downloadResumeInputSchema.parse({})).toEqual({ format: "resume" });
    });

    it("should reject invalid format values", () => {
      expect(() =>
        downloadResumeInputSchema.parse({ format: "invalid" })
      ).toThrow();
      expect(() =>
        downloadResumeInputSchema.parse({ format: "full" })
      ).toThrow();
      expect(() =>
        downloadResumeInputSchema.parse({ format: "short" })
      ).toThrow();
      expect(() =>
        downloadResumeInputSchema.parse({ format: "docx" })
      ).toThrow();
    });
  });

  describe("downloadResumeOutputSchema", () => {
    it("should accept valid output", () => {
      const validOutput = {
        url: "https://example.com/resume.pdf",
        filename: "resume.pdf",
        size: 1024,
        format: "pdf",
        googleDriveUrl:
          "https://drive.google.com/file/d/abc123/view?usp=sharing",
      };
      expect(downloadResumeOutputSchema.parse(validOutput)).toEqual(
        validOutput
      );
    });

    it("should reject invalid URL", () => {
      expect(() =>
        downloadResumeOutputSchema.parse({
          url: "not-a-url",
          filename: "resume.pdf",
          size: 1024,
          format: "pdf",
        })
      ).toThrow();
    });

    it("should reject non-number size", () => {
      expect(() =>
        downloadResumeOutputSchema.parse({
          url: "https://example.com/resume.pdf",
          filename: "resume.pdf",
          size: "1024",
          format: "pdf",
        })
      ).toThrow();
    });
  });

  describe("listProjectsInputSchema", () => {
    it("should accept valid category values", () => {
      const validCategories = [
        "all",
        "ai-ml",
        "web",
        "mobile",
        "tools",
        "other",
      ];
      validCategories.forEach((category) => {
        expect(listProjectsInputSchema.parse({ category })).toEqual({
          category,
        });
      });
    });

    it("should accept optional featured boolean", () => {
      expect(listProjectsInputSchema.parse({ featured: true })).toEqual({
        featured: true,
      });
      expect(listProjectsInputSchema.parse({ featured: false })).toEqual({
        featured: false,
      });
    });

    it("should accept valid limit range (1-50)", () => {
      expect(listProjectsInputSchema.parse({ limit: 1 })).toEqual({ limit: 1 });
      expect(listProjectsInputSchema.parse({ limit: 25 })).toEqual({
        limit: 25,
      });
      expect(listProjectsInputSchema.parse({ limit: 50 })).toEqual({
        limit: 50,
      });
    });

    it("should reject limit outside range", () => {
      expect(() => listProjectsInputSchema.parse({ limit: 0 })).toThrow();
      expect(() => listProjectsInputSchema.parse({ limit: 51 })).toThrow();
    });

    it("should accept empty input", () => {
      expect(listProjectsInputSchema.parse({})).toEqual({});
    });
  });

  describe("projectSchema", () => {
    it("should accept valid project object", () => {
      const validProject = {
        id: "project-1",
        slug: "test-project",
        title: "Test Project",
        description: "A test project",
        technologies: ["React", "TypeScript"],
        role: "Full-Stack",
        category: "web",
        featured: true,
        status: "completed",
      };
      expect(projectSchema.parse(validProject)).toEqual(validProject);
    });

    it("should accept optional URL fields", () => {
      const projectWithUrls = {
        id: "project-1",
        slug: "test-project",
        title: "Test Project",
        description: "A test project",
        technologies: ["React"],
        role: "AI",
        category: "ai-ml",
        featured: false,
        status: "in-progress",
        demoUrl: "https://demo.example.com",
        githubUrl: "https://github.com/user/repo",
      };
      expect(projectSchema.parse(projectWithUrls)).toEqual(projectWithUrls);
    });

    it("should reject invalid role enum", () => {
      expect(() =>
        projectSchema.parse({
          id: "1",
          slug: "test",
          title: "Test",
          description: "Test",
          technologies: [],
          role: "InvalidRole",
          category: "web",
          featured: false,
          status: "completed",
        })
      ).toThrow();
    });

    it("should reject invalid status enum", () => {
      expect(() =>
        projectSchema.parse({
          id: "1",
          slug: "test",
          title: "Test",
          description: "Test",
          technologies: [],
          role: "QA",
          category: "tools",
          featured: false,
          status: "invalid-status",
        })
      ).toThrow();
    });
  });

  describe("listProjectsOutputSchema", () => {
    it("should accept valid output with projects array", () => {
      const validOutput = {
        projects: [
          {
            id: "1",
            slug: "test",
            title: "Test",
            description: "Test",
            technologies: ["React"],
            role: "Full-Stack",
            category: "web",
            featured: true,
            status: "completed",
          },
        ],
        total: 1,
      };
      expect(listProjectsOutputSchema.parse(validOutput)).toEqual(validOutput);
    });

    it("should accept empty projects array", () => {
      const emptyOutput = { projects: [], total: 0 };
      expect(listProjectsOutputSchema.parse(emptyOutput)).toEqual(emptyOutput);
    });
  });

  describe("openProjectInputSchema", () => {
    it("should accept valid slug string", () => {
      expect(openProjectInputSchema.parse({ slug: "test-project" })).toEqual({
        slug: "test-project",
      });
    });

    it("should reject missing slug", () => {
      expect(() => openProjectInputSchema.parse({})).toThrow();
    });
  });

  describe("contactInfoSchema", () => {
    it("should accept valid contact info", () => {
      const validContact = {
        email: "test@example.com",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/test",
        github: "https://github.com/test",
      };
      expect(contactInfoSchema.parse(validContact)).toEqual(validContact);
    });

    it("should accept optional phone and twitter", () => {
      const contactWithOptionals = {
        email: "test@example.com",
        phone: "+1-234-567-8900",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/test",
        github: "https://github.com/test",
        twitter: "https://twitter.com/test",
      };
      expect(contactInfoSchema.parse(contactWithOptionals)).toEqual(
        contactWithOptionals
      );
    });

    it("should reject invalid email", () => {
      expect(() =>
        contactInfoSchema.parse({
          email: "not-an-email",
          location: "SF",
          linkedin: "https://linkedin.com",
          github: "https://github.com",
        })
      ).toThrow();
    });

    it("should reject invalid URL formats", () => {
      expect(() =>
        contactInfoSchema.parse({
          email: "test@example.com",
          location: "SF",
          linkedin: "not-a-url",
          github: "https://github.com",
        })
      ).toThrow();
    });
  });

  describe("getContactOutputSchema", () => {
    it("should accept valid contact output", () => {
      const validOutput = {
        contact: {
          email: "test@example.com",
          location: "San Francisco, CA",
          linkedin: "https://linkedin.com/in/test",
          github: "https://github.com/test",
        },
      };
      expect(getContactOutputSchema.parse(validOutput)).toEqual(validOutput);
    });
  });
});
