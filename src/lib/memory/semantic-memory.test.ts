/**
 * Unit tests for semantic memory manager
 * Tests CRUD operations, array merging, TTL enforcement, and anonymous user handling
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import type { SemanticMemory, ExtractedFacts } from "./types";
import { SEMANTIC_MEMORY_TTL } from "./types";

const hgetallMock = vi.fn();
const hsetMock = vi.fn();
const expireMock = vi.fn();
const delMock = vi.fn();

vi.mock("@/lib/redis/client", () => ({
  getRedisClient: () => ({
    hgetall: hgetallMock,
    hset: hsetMock,
    expire: expireMock,
    del: delMock,
  }),
}));

describe("semantic-memory", () => {
  beforeEach(() => {
    hgetallMock.mockReset();
    hsetMock.mockReset();
    expireMock.mockReset();
    delMock.mockReset();
  });

  describe("getSemanticMemory", () => {
    it("should skip anonymous users", async () => {
      const { getSemanticMemory } = await import("./semantic-memory");
      const result = await getSemanticMemory("anonymous");
      expect(result).toBeNull();
    });

    it("should return null for non-existent memory", async () => {
      hgetallMock.mockResolvedValueOnce({});

      const { getSemanticMemory } = await import("./semantic-memory");
      const result = await getSemanticMemory("user-123");
      expect(result).toBeNull();
    });

    it("should parse and return semantic memory from Redis Hash", async () => {
      hgetallMock.mockResolvedValueOnce({
        role: "developer",
        company: "Acme Corp",
        interests: JSON.stringify(["React", "TypeScript"]),
        experienceLevel: "senior",
        visitedProjects: JSON.stringify(["project-1", "project-2"]),
        techFocus: JSON.stringify(["frontend", "ai-ml"]),
        jobSearch: "false",
        lastUpdated: "2025-01-15T10:00:00.000Z",
      });

      const { getSemanticMemory } = await import("./semantic-memory");
      const result = await getSemanticMemory("user-123");

      expect(result).toEqual({
        role: "developer",
        company: "Acme Corp",
        interests: ["React", "TypeScript"],
        experienceLevel: "senior",
        visitedProjects: ["project-1", "project-2"],
        techFocus: ["frontend", "ai-ml"],
        jobSearch: false,
        lastUpdated: "2025-01-15T10:00:00.000Z",
      });
    });

    it("should handle Redis errors gracefully", async () => {
      hgetallMock.mockRejectedValueOnce(new Error("Redis connection failed"));

      const { getSemanticMemory } = await import("./semantic-memory");
      const result = await getSemanticMemory("user-123");
      expect(result).toBeNull();
    });

    it("should handle null company correctly", async () => {
      hgetallMock.mockResolvedValueOnce({
        role: "developer",
        company: "",
        interests: "[]",
        experienceLevel: "mid",
        visitedProjects: "[]",
        techFocus: "[]",
        jobSearch: "false",
        lastUpdated: "2025-01-01T00:00:00.000Z",
      });

      const { getSemanticMemory } = await import("./semantic-memory");
      const result = await getSemanticMemory("user-123");

      expect(result?.company).toBeNull();
    });

    it("should handle boolean jobSearch conversion", async () => {
      hgetallMock.mockResolvedValueOnce({
        role: "developer",
        company: "",
        interests: "[]",
        experienceLevel: "mid",
        visitedProjects: "[]",
        techFocus: "[]",
        jobSearch: "true",
        lastUpdated: "2025-01-01T00:00:00.000Z",
      });

      const { getSemanticMemory } = await import("./semantic-memory");
      const result = await getSemanticMemory("user-123");

      expect(result?.jobSearch).toBe(true);
      expect(typeof result?.jobSearch).toBe("boolean");
    });
  });

  describe("saveSemanticMemory", () => {
    it("should skip anonymous users", async () => {
      const { saveSemanticMemory } = await import("./semantic-memory");
      const memory: SemanticMemory = {
        role: "developer",
        company: null,
        interests: [],
        experienceLevel: "mid",
        visitedProjects: [],
        techFocus: [],
        jobSearch: false,
        lastUpdated: "2025-01-15T10:00:00.000Z",
      };

      await expect(saveSemanticMemory("anonymous", memory)).resolves.not.toThrow();
      expect(hsetMock).not.toHaveBeenCalled();
    });

    it("should save semantic memory with TTL", async () => {
      hsetMock.mockResolvedValueOnce("OK");
      expireMock.mockResolvedValueOnce(1);

      const { saveSemanticMemory } = await import("./semantic-memory");
      const memory: SemanticMemory = {
        role: "developer",
        company: "Acme Corp",
        interests: ["React", "TypeScript"],
        experienceLevel: "senior",
        visitedProjects: ["project-1"],
        techFocus: ["frontend"],
        jobSearch: false,
        lastUpdated: "2025-01-15T10:00:00.000Z",
      };

      await saveSemanticMemory("user-123", memory);

      expect(hsetMock).toHaveBeenCalledWith(
        "memory:semantic:user-123",
        expect.objectContaining({
          role: "developer",
          company: "Acme Corp",
          interests: JSON.stringify(["React", "TypeScript"]),
        })
      );
      expect(expireMock).toHaveBeenCalledWith("memory:semantic:user-123", SEMANTIC_MEMORY_TTL);
    });

    it("should serialize arrays as JSON strings", async () => {
      hsetMock.mockResolvedValueOnce("OK");
      expireMock.mockResolvedValueOnce(1);

      const { saveSemanticMemory } = await import("./semantic-memory");
      const memory: SemanticMemory = {
        role: "developer",
        company: null,
        interests: ["React", "Vue"],
        experienceLevel: "mid",
        visitedProjects: [],
        techFocus: ["frontend"],
        jobSearch: false,
        lastUpdated: "2025-01-15T10:00:00.000Z",
      };

      await saveSemanticMemory("user-123", memory);

      const callArgs = hsetMock.mock.calls[0][1] as Record<string, string>;
      expect(callArgs.interests).toBe(JSON.stringify(["React", "Vue"]));
      expect(callArgs.techFocus).toBe(JSON.stringify(["frontend"]));
    });
  });

  describe("mergeSemanticMemory", () => {
    it("should skip anonymous users", async () => {
      const { mergeSemanticMemory } = await import("./semantic-memory");
      const facts: ExtractedFacts = {
        role: "developer",
        newInterests: ["React"],
      };

      await expect(mergeSemanticMemory("anonymous", facts)).resolves.not.toThrow();
      expect(hgetallMock).not.toHaveBeenCalled();
    });

    it("should create new memory if none exists", async () => {
      hgetallMock.mockResolvedValueOnce({});
      hsetMock.mockResolvedValueOnce("OK");
      expireMock.mockResolvedValueOnce(1);

      const { mergeSemanticMemory } = await import("./semantic-memory");
      const facts: ExtractedFacts = {
        role: "developer",
        newInterests: ["React", "TypeScript"],
        experienceLevel: "mid",
      };

      await mergeSemanticMemory("user-123", facts);

      expect(hsetMock).toHaveBeenCalled();
      const callArgs = hsetMock.mock.calls[0][1] as Record<string, string>;
      expect(callArgs.role).toBe("developer");
      expect(callArgs.experienceLevel).toBe("mid");
      expect(JSON.parse(callArgs.interests)).toEqual(["React", "TypeScript"]);
    });

    it("should replace single values when provided", async () => {
      hgetallMock.mockResolvedValueOnce({
        role: "unknown",
        company: "",
        interests: "[]",
        experienceLevel: "unknown",
        visitedProjects: "[]",
        techFocus: "[]",
        jobSearch: "false",
        lastUpdated: "2025-01-01T00:00:00.000Z",
      });
      hsetMock.mockResolvedValueOnce("OK");
      expireMock.mockResolvedValueOnce(1);

      const { mergeSemanticMemory } = await import("./semantic-memory");
      const facts: ExtractedFacts = {
        role: "developer",
        company: "Acme Corp",
        experienceLevel: "senior",
        jobSearch: true,
      };

      await mergeSemanticMemory("user-123", facts);

      const callArgs = hsetMock.mock.calls[0][1] as Record<string, string>;
      expect(callArgs.role).toBe("developer");
      expect(callArgs.company).toBe("Acme Corp");
      expect(callArgs.experienceLevel).toBe("senior");
      expect(callArgs.jobSearch).toBe("true");
    });

    it("should merge arrays with deduplication", async () => {
      hgetallMock.mockResolvedValueOnce({
        role: "developer",
        company: "Acme",
        interests: JSON.stringify(["React", "Vue"]),
        experienceLevel: "mid",
        visitedProjects: JSON.stringify(["project-1"]),
        techFocus: JSON.stringify(["frontend"]),
        jobSearch: "false",
        lastUpdated: "2025-01-01T00:00:00.000Z",
      });
      hsetMock.mockResolvedValueOnce("OK");
      expireMock.mockResolvedValueOnce(1);

      const { mergeSemanticMemory } = await import("./semantic-memory");
      const facts: ExtractedFacts = {
        newInterests: ["React", "TypeScript", "Angular"], // React is duplicate
        newVisitedProjects: ["project-2"],
        newTechFocus: ["frontend", "backend"], // frontend is duplicate
      };

      await mergeSemanticMemory("user-123", facts);

      const callArgs = hsetMock.mock.calls[0][1] as Record<string, string>;
      const mergedInterests = JSON.parse(callArgs.interests);
      const mergedProjects = JSON.parse(callArgs.visitedProjects);
      const mergedTechFocus = JSON.parse(callArgs.techFocus);

      expect(mergedInterests).toEqual(["React", "Vue", "TypeScript", "Angular"]);
      expect(mergedProjects).toEqual(["project-1", "project-2"]);
      expect(mergedTechFocus).toEqual(["frontend", "backend"]);
    });

    it("should enforce array limits", async () => {
      hgetallMock.mockResolvedValueOnce({
        role: "developer",
        company: "",
        interests: JSON.stringify(["React", "Vue", "Angular", "Svelte", "Solid", "Qwik", "Preact", "Lit"]),
        experienceLevel: "senior",
        visitedProjects: "[]",
        techFocus: "[]",
        jobSearch: "false",
        lastUpdated: "2025-01-01T00:00:00.000Z",
      });
      hsetMock.mockResolvedValueOnce("OK");
      expireMock.mockResolvedValueOnce(1);

      const { mergeSemanticMemory } = await import("./semantic-memory");
      const facts: ExtractedFacts = {
        newInterests: ["TypeScript", "WebAssembly", "Rust"], // Adding 3 new items
      };

      await mergeSemanticMemory("user-123", facts);

      const callArgs = hsetMock.mock.calls[0][1] as Record<string, string>;
      const mergedInterests = JSON.parse(callArgs.interests);

      // Should be limited to MAX_INTERESTS (10)
      expect(mergedInterests).toHaveLength(10);
      // Should contain existing items
      expect(mergedInterests).toContain("React");
      // Should contain new items (8 existing + 2 new = 10 total)
      expect(mergedInterests).toContain("TypeScript");
      expect(mergedInterests).toContain("WebAssembly");
      // But not all new items can fit (Rust should be truncated)
    });

    it("should handle graceful degradation on errors", async () => {
      hgetallMock.mockRejectedValueOnce(new Error("Redis connection failed"));

      const { mergeSemanticMemory } = await import("./semantic-memory");
      const facts: ExtractedFacts = {
        role: "developer",
      };

      await expect(mergeSemanticMemory("user-123", facts)).resolves.not.toThrow();
    });
  });

  describe("clearSemanticMemory", () => {
    it("should skip anonymous users", async () => {
      const { clearSemanticMemory } = await import("./semantic-memory");
      await expect(clearSemanticMemory("anonymous")).resolves.not.toThrow();
      expect(delMock).not.toHaveBeenCalled();
    });

    it("should delete semantic memory from Redis", async () => {
      delMock.mockResolvedValueOnce(1);

      const { clearSemanticMemory } = await import("./semantic-memory");
      await clearSemanticMemory("user-123");

      expect(delMock).toHaveBeenCalledWith("memory:semantic:user-123");
    });

    it("should throw on Redis errors", async () => {
      delMock.mockRejectedValueOnce(new Error("Redis connection failed"));

      const { clearSemanticMemory } = await import("./semantic-memory");
      await expect(clearSemanticMemory("user-123")).rejects.toThrow();
    });
  });
});
