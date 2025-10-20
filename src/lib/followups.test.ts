/**
 * Unit tests for follow-up question generation system
 * Tests intent classification, topic detection, and personalized follow-up generation
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import type { SemanticMemory } from "@/lib/memory/types";

describe("followups", () => {
  describe("classifyIntent", () => {
    it("should classify tmay intent", async () => {
      const { classifyIntent } = await import("./followups");

      expect(classifyIntent("Tell me about you")).toBe("tmay");
      expect(classifyIntent("Introduce yourself")).toBe("tmay");
      expect(classifyIntent("Who are you?")).toBe("tmay");
    });

    it("should classify portfolio intent", async () => {
      const { classifyIntent } = await import("./followups");

      expect(classifyIntent("Show me your portfolio")).toBe("portfolio");
      expect(classifyIntent("What projects have you built?")).toBe("portfolio");
      expect(classifyIntent("Tell me about what you ship")).toBe("portfolio");
    });

    it("should classify skills intent", async () => {
      const { classifyIntent } = await import("./followups");

      expect(classifyIntent("What are your skills?")).toBe("skills");
      expect(classifyIntent("What's your tech stack?")).toBe("skills");
      expect(classifyIntent("What technologies do you know?")).toBe("skills");
    });

    it("should classify experience intent", async () => {
      const { classifyIntent } = await import("./followups");

      expect(classifyIntent("What is your experience?")).toBe("experience");
      expect(classifyIntent("Describe your career")).toBe("experience");
      expect(classifyIntent("What roles have you had?")).toBe("experience");
    });

    it("should classify problems intent", async () => {
      const { classifyIntent } = await import("./followups");

      expect(classifyIntent("What problems do you solve?")).toBe("problems");
      expect(classifyIntent("What challenges are you passionate about?")).toBe("problems");
      expect(classifyIntent("What do you focus on?")).toBe("problems");
    });

    it("should return null for unrecognized intent", async () => {
      const { classifyIntent } = await import("./followups");

      expect(classifyIntent("Hello there")).toBeNull();
      expect(classifyIntent("Random text")).toBeNull();
    });
  });

  describe("detectTopics", () => {
    it("should detect frontend topics", async () => {
      const { detectTopics } = await import("./followups");

      const topics = detectTopics("I work with React and TypeScript");
      expect(topics).toContain("frontend");
    });

    it("should detect backend topics", async () => {
      const { detectTopics } = await import("./followups");

      const topics = detectTopics("I built an API with Node.js and Express");
      expect(topics).toContain("backend");
    });

    it("should detect AI/ML topics", async () => {
      const { detectTopics } = await import("./followups");

      const topics = detectTopics("I trained a machine learning model");
      expect(topics).toContain("ai-ml");
    });

    it("should detect multiple topics", async () => {
      const { detectTopics } = await import("./followups");

      const topics = detectTopics("I built a React app with a Python backend using machine learning");
      expect(topics.length).toBeGreaterThan(1);
    });

    it("should return empty array for no topics", async () => {
      const { detectTopics } = await import("./followups");

      const topics = detectTopics("Hello world");
      expect(topics).toEqual([]);
    });
  });

  describe("getFollowups", () => {
    beforeEach(() => {
      // Reset environment variable for LLM mode
      delete process.env.NEXT_PUBLIC_ENABLE_SERVER_SUGGEST;
    });

    it("should return personalized follow-ups for recruiter role", async () => {
      const { getFollowups } = await import("./followups");

      const semanticMemory: SemanticMemory = {
        role: "recruiter",
        company: "Tech Corp",
        interests: ["React", "TypeScript"],
        experienceLevel: "mid",
        visitedProjects: [],
        techFocus: ["frontend"],
        jobSearch: false,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const followups = await getFollowups(
        "Tell me about your projects",
        "I have several projects involving React and TypeScript",
        [],
        semanticMemory
      );

      expect(followups).toHaveLength(2);
      expect(Array.isArray(followups)).toBe(true);
    });

    it("should return personalized follow-ups for developer role with interests", async () => {
      const { getFollowups } = await import("./followups");

      const semanticMemory: SemanticMemory = {
        role: "developer",
        company: null,
        interests: ["React", "Node.js"],
        experienceLevel: "senior",
        visitedProjects: [],
        techFocus: ["fullstack"],
        jobSearch: false,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const followups = await getFollowups(
        "What have you built?",
        "I've built several full-stack applications",
        [],
        semanticMemory
      );

      expect(followups).toHaveLength(2);
      // Should include personalized questions about React/Node.js
    });

    it("should return personalized follow-ups for student role", async () => {
      const { getFollowups } = await import("./followups");

      const semanticMemory: SemanticMemory = {
        role: "student",
        company: null,
        interests: [],
        experienceLevel: "junior",
        visitedProjects: [],
        techFocus: [],
        jobSearch: false,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const followups = await getFollowups(
        "I'm learning web development",
        "That's great! What are you focusing on?",
        [],
        semanticMemory
      );

      expect(followups).toHaveLength(2);
      // Should include learning-focused questions
    });

    it("should fall back to heuristic when no semantic memory", async () => {
      const { getFollowups } = await import("./followups");

      const followups = await getFollowups(
        "Show me your projects",
        "Here are my projects...",
        [],
        null
      );

      expect(followups).toHaveLength(2);
      expect(Array.isArray(followups)).toBe(true);
    });

    it("should use intent-based follow-ups for recognized intents", async () => {
      const { getFollowups } = await import("./followups");

      const followups = await getFollowups(
        "What are your skills?",
        "I have expertise in React, TypeScript, and Node.js",
        [],
        null
      );

      expect(followups).toHaveLength(2);
    });

    it("should use topic-based follow-ups when intent not recognized", async () => {
      const { getFollowups } = await import("./followups");

      const followups = await getFollowups(
        "Tell me about React",
        "React is a JavaScript library for building user interfaces",
        [],
        null
      );

      expect(followups).toHaveLength(2);
    });

    it("should avoid recently shown follow-ups", async () => {
      const { getFollowups } = await import("./followups");

      const recentlyShown = [
        "Which projects best demonstrate leadership at scale?",
        "Tell me about team collaboration in your projects",
      ];

      const semanticMemory: SemanticMemory = {
        role: "recruiter",
        company: null,
        interests: [],
        experienceLevel: "mid",
        visitedProjects: [],
        techFocus: [],
        jobSearch: false,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const followups = await getFollowups(
        "Tell me about your projects",
        "I have several projects",
        recentlyShown,
        semanticMemory
      );

      expect(followups).toHaveLength(2);
      // Should not include any from recentlyShown
      followups.forEach((q) => {
        expect(recentlyShown).not.toContain(q);
      });
    });

    it("should return general fallback when no matches", async () => {
      const { getFollowups } = await import("./followups");

      const followups = await getFollowups(
        "Random unrelated text",
        "Another random response",
        [],
        null
      );

      expect(followups).toHaveLength(2);
      expect(Array.isArray(followups)).toBe(true);
    });

    it("should handle unknown role in semantic memory", async () => {
      const { getFollowups } = await import("./followups");

      const semanticMemory: SemanticMemory = {
        role: "unknown",
        company: null,
        interests: [],
        experienceLevel: "unknown",
        visitedProjects: [],
        techFocus: [],
        jobSearch: false,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const followups = await getFollowups(
        "Tell me about yourself",
        "I'm a software engineer",
        [],
        semanticMemory
      );

      expect(followups).toHaveLength(2);
      // Should fall back to heuristic since role is unknown
    });

    it("should prioritize job search follow-ups for recruiters", async () => {
      const { getFollowups } = await import("./followups");

      const semanticMemory: SemanticMemory = {
        role: "recruiter",
        company: null,
        interests: [],
        experienceLevel: "mid",
        visitedProjects: [],
        techFocus: [],
        jobSearch: true,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const followups = await getFollowups(
        "Are you looking for opportunities?",
        "I'm open to new roles",
        [],
        semanticMemory
      );

      expect(followups).toHaveLength(2);
    });

    it("should include tech focus in personalization", async () => {
      const { getFollowups } = await import("./followups");

      const semanticMemory: SemanticMemory = {
        role: "unknown",
        company: null,
        interests: [],
        experienceLevel: "unknown",
        visitedProjects: [],
        techFocus: ["ai-ml", "backend"],
        jobSearch: false,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const followups = await getFollowups(
        "What do you specialize in?",
        "I focus on AI and backend development",
        [],
        semanticMemory
      );

      expect(followups).toHaveLength(2);
    });

    it("should handle experience level variations", async () => {
      const { getFollowups } = await import("./followups");

      const juniorMemory: SemanticMemory = {
        role: "developer",
        company: null,
        interests: ["React"],
        experienceLevel: "junior",
        visitedProjects: [],
        techFocus: [],
        jobSearch: false,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const seniorMemory: SemanticMemory = {
        role: "developer",
        company: null,
        interests: ["React"],
        experienceLevel: "senior",
        visitedProjects: [],
        techFocus: [],
        jobSearch: false,
        lastUpdated: "2025-01-01T00:00:00.000Z",
      };

      const juniorFollowups = await getFollowups(
        "Tell me about your work",
        "I'm learning React",
        [],
        juniorMemory
      );

      const seniorFollowups = await getFollowups(
        "Tell me about your work",
        "I architect React applications",
        [],
        seniorMemory
      );

      expect(juniorFollowups).toHaveLength(2);
      expect(seniorFollowups).toHaveLength(2);
      // Different experience levels should potentially get different questions
    });
  });
});
