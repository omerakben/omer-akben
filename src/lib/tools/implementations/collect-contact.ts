import { tool, type ToolCallOptions } from "ai";

import {
  CollectContactInput,
  CollectContactResponse,
  createErrorResponse,
  createSuccessResponse,
  collectContactInputSchema,
  collectContactResponseSchema,
} from "@/lib/tools/zod-schemas";
import { sendZoomLinkEmail } from "@/lib/email/send-zoom-link";
import { validateContactEmail } from "@/lib/email/validation";
import { logError } from "@/lib/log";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { saveContactToRedis } from "@/lib/redis/contact-storage";

const resolveRateLimitKey = (
  input: CollectContactInput,
  options?: ToolCallOptions
) => options?.toolCallId ?? `email:${input.email.toLowerCase()}`;

export const collectContact = tool<
  CollectContactInput,
  CollectContactResponse
>({
  description:
    "Collect visitor contact information, persist it securely, and share Omer's Zoom link after consent.",
  inputSchema: collectContactInputSchema,
  outputSchema: collectContactResponseSchema,
  execute: async (input, options) => {
    const emailValidation = validateContactEmail(input.email);
    if (!emailValidation.valid) {
      return createErrorResponse(emailValidation.error ?? "Invalid email format");
    }

    const rateLimitKey = resolveRateLimitKey(input, options);
    const allowed = await checkContactRateLimit(rateLimitKey);
    if (!allowed) {
      return createErrorResponse(
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
        ip: rateLimitKey,
      });
    } catch (error) {
      logError("tools.collect-contact.storage", error);
    }

    let emailResult: Awaited<ReturnType<typeof sendZoomLinkEmail>> | undefined;
    try {
      emailResult = await sendZoomLinkEmail({
        to: input.email,
        name: input.name,
        company: input.company,
        purpose: input.purpose,
        conversationNotes: input.notes,
      });
    } catch (error) {
      logError("tools.collect-contact.email", error);
    }

    const zoomLink = process.env.OMER_ZOOM_LINK;
    const emailSent = emailResult?.success ?? false;
    const message = emailSent
      ? `Perfect! I've sent Omer's Zoom link to ${input.email}. Check your inbox!`
      : "Contact saved! I will have Omer reach out to you shortly.";

    return createSuccessResponse({
      success: true,
      emailSent,
      zoomLink,
      message,
      messageId: emailResult?.messageId,
    });
  },
});
