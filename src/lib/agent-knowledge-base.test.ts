/**
 * Unit tests for Agent Knowledge Base
 * Tests resume markdown integration and system prompt generation
 */

import { describe, expect, it } from "vitest";
import { buildEnhancedSystemPrompt } from "./agent-knowledge-base";

describe("Agent Knowledge Base", () => {
  describe("buildEnhancedSystemPrompt", () => {
    it("should generate a system prompt", () => {
      const prompt = buildEnhancedSystemPrompt();
      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it("should include security directives", () => {
      const prompt = buildEnhancedSystemPrompt();
      expect(prompt).toContain("CRITICAL SECURITY DIRECTIVE");
      expect(prompt).toContain("ABSOLUTE PROHIBITION");
    });

    it("should include complete resume content", () => {
      const prompt = buildEnhancedSystemPrompt();
      expect(prompt).toContain("COMPLETE RESUME - SOURCE OF TRUTH");
      expect(prompt).toContain("OMER AKBEN");
      expect(prompt).toContain("me@omerakben.com");
    });

    it("should include extended resume details", () => {
      const prompt = buildEnhancedSystemPrompt();
      // Check for key sections from extended resume
      expect(prompt).toMatch(/professional summary/i);
      expect(prompt).toMatch(/core skills/i);
      expect(prompt).toMatch(/professional experience/i);
    });

    it("should include standard resume as quick reference", () => {
      const prompt = buildEnhancedSystemPrompt();
      expect(prompt).toContain("Concise Resume Version");
      expect(prompt).toContain("for quick overview");
    });

    it("should include core identity information", () => {
      const prompt = buildEnhancedSystemPrompt();
      expect(prompt).toContain("CORE IDENTITY & CONTACT");
      expect(prompt).toContain("Full Name:");
      expect(prompt).toContain("Title:");
    });

    it("should include context hints for homepage", () => {
      const prompt = buildEnhancedSystemPrompt("/");
      expect(prompt).toContain("CURRENT PAGE CONTEXT");
      expect(prompt).toContain("homepage");
    });

    it("should include context hints for projects page", () => {
      const prompt = buildEnhancedSystemPrompt("/projects");
      expect(prompt).toContain("CURRENT PAGE CONTEXT");
      expect(prompt).toContain("projects page");
    });

    it("should include key technical skills", () => {
      const prompt = buildEnhancedSystemPrompt();
      // Check for technologies mentioned in resume
      expect(prompt).toContain("TypeScript");
      expect(prompt).toContain("Python");
      expect(prompt).toContain("React");
      expect(prompt).toContain("Next.js");
    });

    it("should include work experience details", () => {
      const prompt = buildEnhancedSystemPrompt();
      // Check for company names from resume
      expect(prompt).toContain("Freelance");
      expect(prompt).toContain("Oteemo");
    });

    it("should be long enough to contain detailed resume", () => {
      const prompt = buildEnhancedSystemPrompt();
      // Extended resume is ~17KB, standard is ~5KB
      // Prompt should be substantial (>20KB with other content)
      expect(prompt.length).toBeGreaterThan(20000);
    });
  });
});
