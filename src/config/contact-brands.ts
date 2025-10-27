/**
 * Contact Card Brand Color Configuration
 * Maps contact methods to their brand colors and styling
 */

export const CONTACT_BRANDS = {
  linkedin: {
    name: "LinkedIn",
    primary: "#0077B5",
    hover: "#006399",
    rgb: "0, 119, 181",
  },
  github: {
    name: "GitHub",
    primary: "#5FED83", // GitHub Brand Green 3 - vibrant and visible on dark backgrounds
    hover: "#BFFFD1", // GitHub Brand Green 1 - lighter green for hover
    rgb: "95, 237, 131", // RGB values for Green 3
  },
  calendar: {
    name: "Google Calendar",
    primary: "#4285F4",
    hover: "#3367D6",
    rgb: "66, 133, 244",
  },
} as const;

export type ContactBrandKey = keyof typeof CONTACT_BRANDS;
export type ContactBrand = (typeof CONTACT_BRANDS)[ContactBrandKey];

/**
 * Helper to get brand color CSS custom properties
 */
export function getBrandColorVars(brand: ContactBrand | "brand" | "accent") {
  if (brand === "brand") {
    return {
      "--contact-primary": "var(--brand-primary)",
      "--contact-hover": "var(--brand-primary-hover)",
      "--contact-rgb": "var(--brand-primary-rgb)",
    } as React.CSSProperties;
  }

  if (brand === "accent") {
    return {
      "--contact-primary": "var(--accent-primary)",
      "--contact-hover": "var(--accent-primary-hover)",
      "--contact-rgb": "var(--accent-primary-rgb)",
    } as React.CSSProperties;
  }

  return {
    "--contact-primary": brand.primary,
    "--contact-hover": brand.hover,
    "--contact-rgb": brand.rgb,
  } as React.CSSProperties;
}
