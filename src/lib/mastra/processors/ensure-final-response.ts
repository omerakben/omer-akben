import type {
  ProcessInputStepArgs,
  ProcessInputStepResult,
  Processor,
} from "@mastra/core/processors";

export const CHAT_MAX_STEPS = 2;

/**
 * Official Mastra pattern: a tool call on the final maxSteps turn
 * produces an empty assistant completion. Force prose on the last step.
 *
 * Step 0 may use tools. Step 1 (last when maxSteps=2) cannot.
 */
export class EnsureFinalResponseProcessor implements Processor {
  readonly id = "ensure-final-response";

  constructor(private readonly maxSteps: number = CHAT_MAX_STEPS) {}

  async processInputStep({
    stepNumber,
    systemMessages,
  }: ProcessInputStepArgs): Promise<ProcessInputStepResult> {
    if (stepNumber !== this.maxSteps - 1) {
      return {};
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
            "If the user asked about TUEL or Tuel, explain the product family.",
            "Public Elon proof only: 250+ users, 80%+ voluntary adoption, 90%+ exam average among engaged weekly users.",
            "Never cite 202, 204, 88%, 94%, or 72.2M. No salary.",
          ].join(" "),
        },
      ],
    };
  }
}
