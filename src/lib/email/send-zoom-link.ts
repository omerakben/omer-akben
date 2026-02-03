import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    // Get Zoom link from environment variable
    const zoomLink = process.env.OMER_ZOOM_LINK;

    if (!zoomLink) {
      return {
        success: false,
        error: "Zoom link not configured. Please contact support.",
      };
    }

    // Dynamic imports to avoid build-time static analysis of @react-email/components
    // Next.js incorrectly detects Html from @react-email as next/document Html
    const { render } = await import("@react-email/render");
    const { ZoomLinkEmail } = await import("./templates/ZoomLinkEmail");

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
    const { data, error } = await resend.emails.send({
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
