import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  elonAcademicProof,
  elonOperationalProof,
  elonProofHighlights,
  formatElonAcademicProofLine,
} from "@/lib/proof";

const PUBLIC_COPY_FILES = [
  "src/lib/proof.ts",
  "src/data/facts.ts",
  "src/data/projects.ts",
  "src/data/journey.ts",
  "src/data/skills.ts",
  "src/components/hero-section-static.tsx",
  "src/app/page.tsx",
  "src/app/recruiter/page.tsx",
  "src/app/projects/elon-ai/page.tsx",
  "src/lib/structured-data.ts",
  "src/lib/agent-knowledge-base.ts",
  "src/lib/agent-knowledge/shared/conversation-guidelines.ts",
  "public/assets/Omer_Akben_Resume.md",
];

const FORBIDDEN_PUBLIC_EXACTS = [
  "72.2",
  "47.2",
  "88%",
  "94%",
  "202 users",
  "202 total",
  "204 users",
  "204 total",
  "622",
  "200+",
  "70M+",
  "600+",
  "850+",
  "0% error",
  "90%+ voluntary",
];

function readPublicCopy(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("public Elon proof lock", () => {
  it("uses 250+ users and academic floors", () => {
    expect(elonAcademicProof.activeUsers).toBe("250+");
    expect(elonAcademicProof.voluntaryAdoption).toBe("80%+");
    expect(elonAcademicProof.averageExamScore).toBe("90%+");
    expect(elonAcademicProof.examScoreQualifier).toBe(
      "among engaged weekly users"
    );
    expect(formatElonAcademicProofLine()).toContain("250+ users");
    expect(formatElonAcademicProofLine()).toContain("80%+ voluntary adoption");
    expect(formatElonAcademicProofLine()).toContain(
      "90%+ exam average among engaged weekly users"
    );
  });

  it("keeps ops floors conservative when they exist", () => {
    expect(elonOperationalProof.totalTokens).toBe("100M+");
    expect(elonOperationalProof.sessions).toBe("800+");
    expect(elonOperationalProof.errorRate).toBe("about 2%");
    expect(elonOperationalProof.sessions).not.toBe("850+");
  });

  it("exposes homepage chips from the academic floors", () => {
    expect(elonProofHighlights.map((chip) => chip.text)).toEqual([
      "250+ users",
      "80%+ voluntary adoption",
      "90%+ exam average",
    ]);
  });

  it("rejects leaked exacts and stale floors on public surfaces", () => {
    const corpus = PUBLIC_COPY_FILES.map(readPublicCopy).join("\n");

    FORBIDDEN_PUBLIC_EXACTS.forEach((exact) => {
      expect(corpus).not.toContain(exact);
    });

    expect(corpus).toContain("250+");
    expect(corpus).not.toMatch(/90%\+\s+voluntary/);
  });
});
