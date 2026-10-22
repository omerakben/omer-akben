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
          url: FAVICON_SOURCES.icon32,
          type: "image/png",
          sizes: "32x32",
        },
        {
          url: FAVICON_SOURCES.icon16,
          type: "image/png",
          sizes: "16x16",
        },
      ],
      shortcut: FAVICON_SOURCES.iconIco,
      apple: {
        url: FAVICON_SOURCES.appleTouch,
        sizes: "180x180",
      },
      other: [
        {
          rel: "manifest",
          url: FAVICON_SOURCES.manifest,
        },
        {
          rel: "icon",
          url: FAVICON_SOURCES.android192,
          sizes: "192x192",
        },
        {
          rel: "icon",
          url: FAVICON_SOURCES.android512,
          sizes: "512x512",
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
      creator: "@oakben",
      images: [image],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}
