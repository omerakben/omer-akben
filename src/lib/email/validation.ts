/**
 * Email Validation Utilities
 *
 * Provides email validation including disposable email detection
 * to prevent spam and maintain contact quality.
 */

/**
 * List of common disposable email domains (updated 2025)
 * Source: https://github.com/disposable-email-domains/disposable-email-domains
 * Last updated: January 2025
 */
const DISPOSABLE_EMAIL_DOMAINS = [
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "mailinator.com",
  "throwaway.email",
  "temp-mail.org",
  "fakeinbox.com",
  "trashmail.com",
  "yopmail.com",
  "sharklasers.com",
  "maildrop.cc",
  "getnada.com",
  "mintemail.com",
  "getairmail.com",
  "tempinbox.com",
  "dispostable.com",
  "mohmal.com",
  "mytemp.email",
  "guerrillamailblock.com",
  "spamgourmet.com",
  // 2025 additions
  "emailondeck.com",
  "emailfake.com",
  "temp-mail.io",
  "disposablemail.com",
  "tempmailo.com",
  "burnermail.io",
  "inboxkitten.com",
  "mailsac.com",
  "mailtemp.net",
  "temporary-mail.net",
];

/**
 * Check if an email domain is in the disposable email list
 */
export function isDisposableEmail(email: string): boolean {
  try {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return false;
    }
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
  } catch {
    return false;
  }
}

/**
 * Validate email format and check for disposable domains
 */
export function validateContactEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Check for disposable email
  if (isDisposableEmail(email)) {
    return {
      valid: false,
      error:
        "Disposable email addresses are not allowed. Please use a permanent email address.",
    };
  }

  return { valid: true };
}
