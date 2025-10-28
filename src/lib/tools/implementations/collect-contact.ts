import { tool, type ToolCallOptions } from "ai";
import { sendZoomLinkEmail } from "@/lib/email/send-zoom-link";
import { validateContactEmail } from "@/lib/email/validation";
import { logError } from "@/lib/log";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { saveContactToRedis } from "@/lib/redis/contact-storage";
import {
  collectContactInputSchema,
  collectContactOutputSchema,
  type CollectContactInput,
  type CollectContactOutput,
} from "@/lib/tools/zod-schemas";

interface CollectContactToolContext {
  rateLimitKey?: string;
  ip?: string;
  userId?: string;
  threadId?: string;
}

function resolveRateLimitKey(options?: ToolCallOptions): string {
  const context = options?.experimental_context as
    | CollectContactToolContext
    | undefined;

  return (
    context?.rateLimitKey ||
    context?.ip ||
    context?.userId ||
    context?.threadId ||
    "anonymous"
  );
}

export async function collectContact(
  input: CollectContactInput,
  options?: ToolCallOptions
): Promise<CollectContactOutput> {
  const emailValidation = validateContactEmail(input.email);
  if (!emailValidation.valid) {
    throw new Error(emailValidation.error ?? "Invalid email");
  }

  const identifier = resolveRateLimitKey(options);
  const rateLimitOk = await checkContactRateLimit(identifier);
  if (!rateLimitOk) {
    throw new Error(
      "Contact collection limit reached. Please try again tomorrow."
    );
  }

  try {
    await saveContactToRedis({
      name: input.name,
      email: input.email,
      company: input.company,
      purpose: input.purpose,
      notes: input.notes,
      preferredTime: input.preferredTime,
      collectedAt: new Date().toISOString(),
      ip: identifier,
    });
  } catch (error) {
    logError("collect-contact:storage", error);
    // Continue even if storage fails to preserve user experience
  }

  let emailResult: Awaited<ReturnType<typeof sendZoomLinkEmail>> | null = null;
  try {
    emailResult = await sendZoomLinkEmail({
      to: input.email,
      name: input.name,
      company: input.company,
      purpose: input.purpose,
      conversationNotes: input.notes,
    });
  } catch (error) {
    logError("collect-contact:email", error);
  }

  const zoomLink = process.env.OMER_ZOOM_LINK;

  return {
    success: true,
    emailSent: emailResult?.success ?? false,
    zoomLink,
    message: emailResult?.success
      ? `Perfect! I've sent Omer's Zoom link to ${input.email}. Check your inbox!`
      : "Contact saved! I will have Omer reach out to you shortly.",
    messageId: emailResult?.messageId,
  };
}

export const collectContactTool = tool({
  name: "collect_contact",
  description:
    "Collect visitor contact details with consent and deliver Omer's Zoom link via email.",
  inputSchema: collectContactInputSchema,
  outputSchema: collectContactOutputSchema,
  execute: async (input, options) => collectContact(input, options),
});
