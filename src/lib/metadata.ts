import { FAVICON_SOURCES } from "@/lib/constants";
import { Metadata } from "next";

const baseUrl = "https://omerakben.com";
const defaultTitle = "Omer Akben - AI/ML Engineer & Full-Stack Developer";
const defaultDescription =
  "Building intelligent systems and elegant solutions. Specializing in AI/ML engineering, full-stack development, and agentic workflows.";

export function createMetadata({
  title,
  description,
  path = "",
  image = "/og-image.png",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = title ? `${title} | Omer Akben` : defaultTitle;
  const fullUrl = `${baseUrl}${path}`;

  return {
    title: fullTitle,
    description: description || defaultDescription,
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        {
          url: FAVICON_SOURCES.light.icon32,
          type: "image/png",
          sizes: "32x32",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: FAVICON_SOURCES.dark.icon32,
          type: "image/png",
          sizes: "32x32",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: FAVICON_SOURCES.light.icon16,
          type: "image/png",
          sizes: "16x16",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: FAVICON_SOURCES.dark.icon16,
          type: "image/png",
          sizes: "16x16",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      shortcut: [
        {
          url: FAVICON_SOURCES.light.iconIco,
          media: "(prefers-color-scheme: light)",
        },
        {
          url: FAVICON_SOURCES.dark.iconIco,
          media: "(prefers-color-scheme: dark)",
        },
      ],
      apple: [
        {
          url: FAVICON_SOURCES.light.appleTouch,
          sizes: "180x180",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: FAVICON_SOURCES.dark.appleTouch,
          sizes: "180x180",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      other: [
        {
          rel: "manifest",
          url: FAVICON_SOURCES.light.manifest,
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "manifest",
          url: FAVICON_SOURCES.dark.manifest,
          media: "(prefers-color-scheme: dark)",
        },
        {
          rel: "icon",
          url: FAVICON_SOURCES.light.android192,
          sizes: "192x192",
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          url: FAVICON_SOURCES.dark.android192,
          sizes: "192x192",
          media: "(prefers-color-scheme: dark)",
        },
        {
          rel: "icon",
          url: FAVICON_SOURCES.light.android512,
          sizes: "512x512",
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          url: FAVICON_SOURCES.dark.android512,
          sizes: "512x512",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      url: fullUrl,
      siteName: "Omer Akben Portfolio",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || defaultDescription,
      creator: "@omerakben",
      images: [image],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}
