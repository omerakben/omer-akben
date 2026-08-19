import { describe, expect, it } from "vitest";
import { shouldContinueAfterIteration } from "@/lib/mastra/agents/iteration-policy";

describe("shouldContinueAfterIteration", () => {
  it("continues when the iteration produced no visible text", () => {
    expect(shouldContinueAfterIteration("")).toBe(true);
    expect(shouldContinueAfterIteration("   ")).toBe(true);
    expect(
      shouldContinueAfterIteration(
        "[Navigation buttons for Projects, Skills, and Career Journey pages now appear above.]"
      )
    ).toBe(true);
  });

  it("stops after a streamed bio so a rewrite step cannot start", () => {
    expect(
      shouldContinueAfterIteration(
        "I'm a founder and AI full-stack engineer with 6+ years spanning QA/SDET."
      )
    ).toBe(false);
  });
});
