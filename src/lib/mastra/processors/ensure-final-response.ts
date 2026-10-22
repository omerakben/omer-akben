import { stripToolNarration } from "@/lib/chat/message-utils";
import type {
  ProcessInputStepArgs,
  ProcessInputStepResult,
  Processor,
} from "@mastra/core/processors";

export const CHAT_MAX_STEPS = 2;

function priorStepHasVisibleText(
  steps: ProcessInputStepArgs["steps"] | undefined
): boolean {
  if (!Array.isArray(steps)) {
    return false;
  }

  return steps.some((step) => {
    if (!step || typeof step !== "object" || !("text" in step)) {
      return false;
    }

    const text = step.text;
    return typeof text === "string" && stripToolNarration(text).length > 0;
  });
}

/**
 * Official Mastra pattern: a tool call on the final maxSteps turn
 * produces an empty assistant completion. Force prose on the last step
 * only when earlier steps produced no user-visible text.
 *
 * Step 0 may use tools. Step 1 (last when maxSteps=2) cannot.
 */
export class EnsureFinalResponseProcessor implements Processor {
  readonly id = "ensure-final-response";

  constructor(private readonly maxSteps: number = CHAT_MAX_STEPS) {}

  async processInputStep({
    stepNumber,
    systemMessages,
    steps,
  }: ProcessInputStepArgs): Promise<ProcessInputStepResult> {
    if (stepNumber !== this.maxSteps - 1) {
      return {};
    }

    if (priorStepHasVisibleText(steps)) {
      return {
        toolChoice: "none",
        systemMessages: [
          ...systemMessages,
          {
            role: "system",
            content: [
              "A user-visible answer was already written in this turn.",
              "Do not rewrite, replace, or summarize that answer.",
              "Do not emit tool narration such as [Navigation buttons...] or \"I've provided clickable navigation buttons\".",
              "Emit no additional prose.",
            ].join(" "),
          },
        ],
      };
    }

    return {
      toolChoice: "none",
      systemMessages: [
        ...systemMessages,
        {
          role: "system",
          content: [
            "This is the final step. Write a user-visible answer in plain prose.",
            "Never end with only tool calls.",
            "Do not emit tool narration such as [Navigation buttons...] or \"I've provided clickable navigation buttons\".",
            "If the user asked about TUEL or Tuel, explain Trusted Unified Education & Learning at tuel.ai only.",
            "Do not present the animation library or Selenium harness as the TUEL product.",
            "Public Elon proof only: 250+ users, 80%+ voluntary adoption, 90%+ exam average among engaged weekly users.",
            "Never cite 202, 204, 88%, 94%, 72.2M, 84, 27, or 30 as public counts. No salary.",
          ].join(" "),
        },
      ],
    };
  }
}
