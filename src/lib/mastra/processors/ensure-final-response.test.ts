import { describe, expect, it } from "vitest";
import type { ProcessInputStepArgs } from "@mastra/core/processors";
import {
  CHAT_MAX_STEPS,
  EnsureFinalResponseProcessor,
} from "@/lib/mastra/processors/ensure-final-response";

function stepArgs(stepNumber: number): ProcessInputStepArgs {
  return {
    stepNumber,
    systemMessages: [],
  } as ProcessInputStepArgs;
}

describe("EnsureFinalResponseProcessor", () => {
  it("allows tools on the first step", async () => {
    const processor = new EnsureFinalResponseProcessor(CHAT_MAX_STEPS);
    await expect(processor.processInputStep(stepArgs(0))).resolves.toEqual({});
  });

  it("forces prose on the final step so tool-only turns cannot finish empty", async () => {
    const processor = new EnsureFinalResponseProcessor(CHAT_MAX_STEPS);
    const result = await processor.processInputStep(stepArgs(CHAT_MAX_STEPS - 1));

    expect(result.toolChoice).toBe("none");
    const content = result.systemMessages?.at(-1)?.content;
    expect(content).toEqual(expect.stringContaining("Write a user-visible answer"));
    expect(content).toEqual(
      expect.stringContaining("Do not emit tool narration")
    );
  });

  it("does not ask the model to rewrite when a prior step already has text", async () => {
    const processor = new EnsureFinalResponseProcessor(CHAT_MAX_STEPS);
    const result = await processor.processInputStep({
      ...stepArgs(CHAT_MAX_STEPS - 1),
      steps: [
        {
          text: "I'm a founder and AI full-stack engineer with 6+ years spanning QA/SDET.",
        },
      ],
    } as ProcessInputStepArgs);

    expect(result.toolChoice).toBe("none");
    const content = result.systemMessages?.at(-1)?.content;
    expect(content).toEqual(
      expect.stringContaining("Do not rewrite, replace, or summarize")
    );
    expect(content).not.toEqual(
      expect.stringContaining("Write a user-visible answer")
    );
  });
});
