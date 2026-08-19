import { describe, expect, it } from "vitest";
import {
  buildGroundedFallback,
  isAboutQuery,
  isPresenceQuery,
  isTuelQuery,
} from "@/lib/chat/grounded-fallback";
import { formatElonAcademicProofLine } from "@/lib/proof";

describe("grounded fallback routing", () => {
  it("treats short TUEL questions as product queries", () => {
    expect(isTuelQuery("Tuel")).toBe(true);
    expect(isTuelQuery("What is Tuel?")).toBe(true);
    expect(isTuelQuery("What is TUEL AI?")).toBe(true);
    expect(isTuelQuery("Are u there?")).toBe(false);
  });

  it("treats intro and presence questions distinctly", () => {
    expect(isAboutQuery("Tell me about yourself.")).toBe(true);
    expect(isAboutQuery("Tell me about your self")).toBe(true);
    expect(isPresenceQuery("Are u there?")).toBe(true);
    expect(isAboutQuery("What is Tuel?")).toBe(false);
  });
});

describe("buildGroundedFallback", () => {
  it("answers short TUEL questions with locked public proof", () => {
    for (const query of ["What is Tuel?", "Tuel", "What is TUEL AI?"]) {
      const reply = buildGroundedFallback(query);
      expect(reply).toMatch(/Trusted Unified Education & Learning/);
      expect(reply).toMatch(/tuel\.ai/);
      expect(reply).toMatch(/course-grounded/);
      expect(reply).toContain(formatElonAcademicProofLine());
      expect(reply).not.toMatch(/202|204|88%|94%|72\.2M/);
      expect(reply).not.toMatch(/animation library|Selenium/i);
      expect(reply).not.toMatch(/\b(84|27|30)\b/);
    }
  });

  it("answers an intro question with a non-empty bio", () => {
    const reply = buildGroundedFallback("Tell me about yourself.");
    expect(reply).toMatch(/Omer Akben/);
    expect(reply.length).toBeGreaterThan(40);
  });

  it("answers a presence check", () => {
    expect(buildGroundedFallback("Are u there?")).toMatch(/I'm here/i);
  });
});
