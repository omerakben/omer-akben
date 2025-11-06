"use client";

import { Button } from "@/components/ui/button";
import { facts } from "@/data/facts";
import { Mail } from "lucide-react";

interface EmailActionButtonProps {
  /**
   * Optional subject line for the email
   */
  subject?: string;
  /**
   * Optional body text for the email
   */
  body?: string;
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Button variant (default, outline, ghost)
   */
  variant?: "default" | "outline" | "ghost";
  /**
   * Button size
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * EmailActionButton Component
 *
 * Professional email action button with mailto: integration.
 * Features:
 * - Pre-populated subject and body
 * - Accessible with ARIA labels
 * - Follows design system tokens
 * - Keyboard navigable
 */
export function EmailActionButton({
  subject = "Let's connect",
  body = "",
  className = "",
  variant = "default",
  size = "default",
}: EmailActionButtonProps) {
  const email = facts.personal.email;

  // Construct mailto link
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ""
  }`;

  return (
    <Button
      variant={variant}
      size={size}
      asChild
      className={`gap-2 ${className}`}
    >
      <a
        href={mailtoLink}
        aria-label={`Send email to ${email}`}
        rel="noopener noreferrer"
      >
        <Mail className="w-4 h-4" />
        <span>Email</span>
      </a>
    </Button>
  );
}
