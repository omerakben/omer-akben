import { facts } from "@/data/facts";

/**
 * Structured Data (JSON-LD) Utilities
 *
 * Generates schema.org structured data for SEO and rich snippets.
 */

/**
 * Person Schema for homepage
 * Represents Omer Akben as a person in structured data
 */
export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: facts.personal.fullName,
    alternateName: facts.personal.nickname,
    jobTitle: facts.professional.currentRole,
    description: facts.professional.summary,
    email: facts.personal.email,
    url: "https://omerakben.com",
    image: "https://omerakben.com/profile-photo.jpg",
    sameAs: [
      facts.social.linkedin,
      facts.social.github,
      facts.social.twitter || "https://x.com/oakben",
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Full-Stack Development",
      "Test Automation",
      "Software Engineering",
      "Quality Assurance",
      "Python",
      "TypeScript",
      "React",
      "Next.js",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Nashville Software School",
    },
  };
}

/**
 * WebSite Schema for homepage
 * Represents the portfolio website
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Omer Akben - Portfolio",
    alternateName: "Ozzy's Portfolio",
    url: "https://omerakben.com",
    description:
      "Personal portfolio and recruiter-magnet site showcasing Omer 'Ozzy' Akben's work in AI, ML, and software engineering.",
    author: {
      "@type": "Person",
      name: facts.personal.fullName,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://omerakben.com/projects?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * SoftwareApplication Schema for project pages
 * Represents individual projects as software applications
 */
export function getSoftwareApplicationSchema({
  name,
  description,
  applicationCategory,
  url,
  screenshot,
}: {
  name: string;
  description: string;
  applicationCategory: string;
  url?: string;
  screenshot?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    author: {
      "@type": "Person",
      name: facts.personal.fullName,
      url: "https://omerakben.com",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(url && { url }),
    ...(screenshot && { screenshot }),
  };
}

/**
 * BreadcrumbList Schema for navigation
 * Helps search engines understand site structure
 */
export function getBreadcrumbListSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://omerakben.com${item.url}`,
    })),
  };
}
