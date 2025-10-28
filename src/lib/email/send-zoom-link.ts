import { render } from "@react-email/render";
import { Resend } from "resend";
import { ZoomLinkEmail } from "./templates/ZoomLinkEmail";

let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (resend) {
    return resend;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  resend = new Resend(apiKey);
  return resend;
}

interface SendZoomLinkEmailInput {
  to: string;
  name: string;
  company?: string;
  purpose: string;
  conversationNotes?: string;
}

interface SendZoomLinkEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendZoomLinkEmail({
  to,
  name,
  company,
  purpose,
  conversationNotes,
}: SendZoomLinkEmailInput): Promise<SendZoomLinkEmailResult> {
  try {
    const client = getResendClient();
    if (!client) {
      return {
        success: false,
        error: "Email service not configured. Please contact support.",
      };
    }

    // Get Zoom link from environment variable
    const zoomLink = process.env.OMER_ZOOM_LINK;

    if (!zoomLink) {
      return {
        success: false,
        error: "Zoom link not configured. Please contact support.",
      };
    }

    // Render email template
    const emailHtml = await render(
      ZoomLinkEmail({
        name,
        company,
        conversationNotes,
        zoomLink,
      })
    );

    // Send email via Resend
    const { data, error } = await client.emails.send({
      from: "Omer Akben <noreply@omerakben.com>",
      to: [to],
      subject: `Let's connect! Here's my Zoom link`,
      html: emailHtml,
      replyTo: process.env.OMER_EMAIL || "me@omerakben.com",
      tags: [
        { name: "category", value: "contact-collection" },
        { name: "purpose", value: purpose },
      ],
    });

    if (error) {
      console.error("[Resend] Email send failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("[Resend] Unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Email service unavailable",
    };
  }
}
