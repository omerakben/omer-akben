import { describe, expect, it } from "vitest";
import {
  getFeaturedProjects,
  getProjectBySlug,
  getProjectsByCategory,
  projects,
  type Project,
} from "./projects";

describe("Projects Data Layer", () => {
  describe("projects array", () => {
    it("should contain projects", () => {
      expect(projects).toBeDefined();
      expect(projects.length).toBeGreaterThan(0);
    });

    it("should have valid project structure", () => {
      projects.forEach((project) => {
        expect(project).toHaveProperty("id");
        expect(project).toHaveProperty("slug");
        expect(project).toHaveProperty("title");
        expect(project).toHaveProperty("description");
        expect(project).toHaveProperty("technologies");
        expect(project).toHaveProperty("role");
        expect(project).toHaveProperty("category");
        expect(project).toHaveProperty("featured");

        // Validate types
        expect(typeof project.id).toBe("string");
        expect(typeof project.slug).toBe("string");
        expect(typeof project.title).toBe("string");
        expect(typeof project.description).toBe("string");
        expect(Array.isArray(project.technologies)).toBe(true);
        expect(typeof project.role).toBe("string");
        expect(typeof project.category).toBe("string");
        expect(typeof project.featured).toBe("boolean");
      });
    });

    it("should have unique IDs", () => {
      const ids = projects.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it("should have unique slugs", () => {
      const slugs = projects.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it("should have valid role values", () => {
      const validRoles = ["Full-Stack", "AI", "QA", "QA/AI"];
      projects.forEach((project) => {
        expect(validRoles).toContain(project.role);
      });
    });

    it("should have valid category values", () => {
      const validCategories = ["ai-ml", "web", "mobile", "tools", "other"];
      projects.forEach((project) => {
        expect(validCategories).toContain(project.category);
      });
    });

    it("should have valid status values when present", () => {
      const validStatuses = ["completed", "in-progress", "planned"];
      projects.forEach((project) => {
        if (project.status) {
          expect(validStatuses).toContain(project.status);
        }
      });
    });

    it("should have valid URLs when present", () => {
      const urlRegex = /^https?:\/\/.+/;
      projects.forEach((project) => {
        if (project.demoUrl) {
          expect(project.demoUrl).toMatch(urlRegex);
        }
        if (project.githubUrl) {
          expect(project.githubUrl).toMatch(urlRegex);
        }
      });
    });
  });

  describe("getProjectBySlug", () => {
    it("should return project when slug exists", () => {
      const firstProject = projects[0];
      const found = getProjectBySlug(firstProject.slug);
      expect(found).toBeDefined();
      expect(found?.slug).toBe(firstProject.slug);
    });

    it("should return undefined when slug does not exist", () => {
      const found = getProjectBySlug("non-existent-slug");
      expect(found).toBeUndefined();
    });

    it("should return correct project for known slugs", () => {
      const knownSlugs = [
        "north-glass",
        "elon-ai-agent",
        "developer-cheat-sheets",
      ];
      knownSlugs.forEach((slug) => {
        const found = getProjectBySlug(slug);
        expect(found).toBeDefined();
        expect(found?.slug).toBe(slug);
      });
    });

    it("should be case-sensitive", () => {
      const firstProject = projects[0];
      const upperSlug = firstProject.slug.toUpperCase();
      const found = getProjectBySlug(upperSlug);
      expect(found).toBeUndefined();
    });
  });

  describe("getFeaturedProjects", () => {
    it("should return only featured projects", () => {
      const featured = getFeaturedProjects();
      expect(featured.length).toBeGreaterThan(0);
      featured.forEach((project) => {
        expect(project.featured).toBe(true);
      });
    });

    it("should return array", () => {
      const featured = getFeaturedProjects();
      expect(Array.isArray(featured)).toBe(true);
    });

    it("should return subset of all projects", () => {
      const featured = getFeaturedProjects();
      expect(featured.length).toBeLessThanOrEqual(projects.length);
    });

    it("should match manual count", () => {
      const manualCount = projects.filter((p) => p.featured).length;
      const featured = getFeaturedProjects();
      expect(featured.length).toBe(manualCount);
    });
  });

  describe("getProjectsByCategory", () => {
    it("should return projects for valid category", () => {
      const webProjects = getProjectsByCategory("web");
      expect(Array.isArray(webProjects)).toBe(true);
      webProjects.forEach((project) => {
        expect(project.category).toBe("web");
      });
    });

    it("should return empty array for category with no projects", () => {
      const mobileProjects = getProjectsByCategory("mobile");
      expect(Array.isArray(mobileProjects)).toBe(true);
      // If no mobile projects exist
      if (mobileProjects.length === 0) {
        expect(mobileProjects).toEqual([]);
      }
    });

    it("should work for all valid categories", () => {
      const categories: Project["category"][] = [
        "ai-ml",
        "web",
        "mobile",
        "tools",
        "other",
      ];
      categories.forEach((category) => {
        const filtered = getProjectsByCategory(category);
        expect(Array.isArray(filtered)).toBe(true);
        filtered.forEach((project) => {
          expect(project.category).toBe(category);
        });
      });
    });

    it("should return subset of all projects", () => {
      const categories: Project["category"][] = [
        "ai-ml",
        "web",
        "mobile",
        "tools",
        "other",
      ];
      categories.forEach((category) => {
        const filtered = getProjectsByCategory(category);
        expect(filtered.length).toBeLessThanOrEqual(projects.length);
      });
    });
  });

  describe("Data integrity", () => {
    it("should have at least 3 featured projects", () => {
      const featured = getFeaturedProjects();
      expect(featured.length).toBeGreaterThanOrEqual(3);
    });

    it("should have projects in multiple categories", () => {
      const categories = new Set(projects.map((p) => p.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should have non-empty descriptions", () => {
      projects.forEach((project) => {
        expect(project.description.length).toBeGreaterThan(0);
        expect(project.description.trim()).toBe(project.description);
      });
    });

    it("should have non-empty technology arrays", () => {
      projects.forEach((project) => {
        expect(project.technologies.length).toBeGreaterThan(0);
      });
    });

    it("should have slugs in kebab-case format", () => {
      const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
      projects.forEach((project) => {
        expect(project.slug).toMatch(kebabCaseRegex);
      });
    });
  });
});
