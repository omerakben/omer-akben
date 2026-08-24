---
title: "SEO Implementation Guide"
description: "Comprehensive SEO strategy: page metadata, Open Graph, Twitter Cards, JSON-LD structured data, sitemap, and robots.txt configuration"
date: 2025-11-02
status: stable
tags: [seo, metadata, structured-data, open-graph, sitemap]
---

# SEO Implementation Guide

This document describes the SEO and metadata implementation for omerakben.com.

## Overview

The site uses a comprehensive SEO strategy including:

- **Page Metadata**: Title, description, Open Graph, Twitter Cards
- **Structured Data**: JSON-LD schemas for rich snippets
- **Sitemap & Robots**: Automated generation via Next.js
- **Semantic HTML**: Proper landmarks and heading hierarchy
- **Accessibility**: WCAG AA compliance for better SEO

## Metadata System

### Location

- **Utility**: `src/lib/metadata.ts`
- **Function**: `createMetadata({ title, description, path, image })`

### Usage Pattern

For **server components** (most pages):

```typescript
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Page Title",
  description: "Page description for meta tags and search results",
  path: "/page-path",
});
```

For **client components** (uses "use client"):
Create a sibling `layout.tsx` file:

```typescript
// src/app/my-client-page/layout.tsx
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Page Title",
  description: "Page description",
  path: "/my-client-page",
});

export default function MyClientPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### Metadata Components

Each page automatically includes:

- **Title**: `"{Page Title} | Omer Akben"` or default site title
- **Description**: SEO-optimized description (150-160 characters)
- **Canonical URL**: `https://omerakben.com{path}`
- **Open Graph Tags**:
  - `og:title`, `og:description`, `og:url`
  - `og:image` (1200x630px)
  - `og:type: "website"`
  - `og:locale: "en_US"`
- **Twitter Cards**:
  - `twitter:card: "summary_large_image"`
  - `twitter:title`, `twitter:description`
  - `twitter:creator: "@oakben"`
  - `twitter:image`

## Structured Data (JSON-LD)

### Location

- **Utility**: `src/lib/structured-data.ts`

### Implemented Schemas

#### 1. Person Schema (Homepage)

Represents Omer Akben as a professional:

```typescript
import { getPersonSchema } from "@/lib/structured-data";

// In page.tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonSchema()) }}
/>
```

**Includes**:

- Name, nickname, job title
- Contact information
- Social profiles (LinkedIn, GitHub, Twitter)
- Skills and expertise
- Work authorization (U.S. Permanent Resident / Green Card status)
- Education (Nashville Software School)

#### 2. WebSite Schema (Homepage)

Represents the portfolio site:

```typescript
import { getWebSiteSchema } from "@/lib/structured-data";

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteSchema()) }}
/>
```

**Includes**:

- Site name and URL
- Search action support
- Author information

#### 3. SoftwareApplication Schema (Project Pages)

For individual projects:

```typescript
import { getSoftwareApplicationSchema } from "@/lib/structured-data";

const projectSchema = getSoftwareApplicationSchema({
  name: "Project Name",
  description: "Project description",
  applicationCategory: "BusinessApplication",
  url: "https://project-url.com",
  screenshot: "https://omerakben.com/screenshots/project.png",
});

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
/>
```

#### 4. BreadcrumbList Schema (Navigation)

For site navigation structure:

```typescript
import { getBreadcrumbListSchema } from "@/lib/structured-data";

const breadcrumbs = getBreadcrumbListSchema([
  { name: "Home", url: "/" },
  { name: "Projects", url: "/projects" },
  { name: "Project Name", url: "/projects/project-slug" },
]);
```

## Page-Specific Implementation

### Implemented Pages

- ✅ `/` (Home): Default metadata + Person + WebSite schemas
- ✅ `/projects`: Project listing metadata
- ✅ `/projects/[slug]`: Dynamic metadata + per-route OG images (see `src/app/projects/[slug]/page.tsx`)
- ✅ `/skills`: Skills showcase metadata
- ✅ `/journey`: Career timeline metadata
- ✅ `/credentials`: Education & certifications metadata
- ✅ `/contact`: Contact page metadata
- ✅ `/recruiter`: Recruiter hub metadata
- ✅ `/chat`: AI assistant chat metadata

### To Implement

- [ ] Add breadcrumb schemas to all pages
- [ ] Add FAQ schema if applicable

## Sitemap & Robots

### Sitemap

- **Location**: `src/app/sitemap.ts`
- **URL**: `https://omerakben.com/sitemap.xml`
- **Generated**: Automatically by Next.js
- **Includes**: All static and dynamic routes

### Robots.txt

- **Location**: `src/app/robots.ts`
- **URL**: `https://omerakben.com/robots.txt`
- **Configuration**:

  ```
  User-agent: *
  Allow: /
  Sitemap: https://omerakben.com/sitemap.xml
  ```

## SEO Best Practices Checklist

### Content

- [x] Unique titles per page (50-60 characters)
- [x] Unique descriptions per page (150-160 characters)
- [x] Descriptive URLs (slug-based routing)
- [x] Semantic HTML structure
- [x] Proper heading hierarchy (h1 → h2 → h3)

### Technical

- [x] Responsive design (mobile-first)
- [x] Fast load times (see bundle-analysis.md)
- [x] HTTPS enabled (via Vercel)
- [x] Clean URL structure
- [x] Canonical URLs set
- [x] Sitemap.xml generated
- [x] Robots.txt configured

### Images

- [ ] Alt text on all images
- [x] Next.js Image optimization
- [x] WebP/AVIF formats
- [ ] Lazy loading implemented
- [x] Open Graph images (1200x630px)

### Open Graph Image Checklist

- Default card served from `src/app/opengraph-image.tsx` (1200×630, branded typography).
- Project-specific cards generated by `src/app/projects/[slug]/opengraph-image.tsx`; titles and top technologies render automatically.
- When adding a new project slug, confirm `/projects/<slug>/opengraph-image` returns 200 locally and on Vercel.
- Validate cards with:
  - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
  - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
  - [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/)

### Accessibility (Improves SEO)

- [x] ARIA landmarks (header, main, footer, nav)
- [x] Skip to content link
- [x] Focus indicators
- [x] Color contrast compliance
- [x] Keyboard navigation
- [x] Screen reader support

## Testing & Validation

### Tools to Use

1. **Google Search Console**: Monitor indexing and performance
2. **PageSpeed Insights**: Test Core Web Vitals
3. **Rich Results Test**: Validate structured data
4. **Facebook Debugger**: Test Open Graph tags
5. **Twitter Card Validator**: Test Twitter Cards
6. **LinkedIn Post Inspector**: Test LinkedIn previews

### Commands

```bash
# Check build includes metadata
npm run build

# Verify sitemap generation
curl https://omerakben.com/sitemap.xml

# Verify robots.txt
curl https://omerakben.com/robots.txt

# Test structured data locally
# View page source and search for "application/ld+json"
```

## Performance Impact

- **Metadata**: Negligible (~1KB per page)
- **Structured Data**: ~2-3KB per page
- **Total SEO Overhead**: ~3-4KB per page

## Future Improvements

- [ ] Add FAQ schema to relevant pages
- [ ] Implement breadcrumb navigation UI + schema
- [ ] Enhance OG templates with project metrics or screenshots
- [ ] Add Article schema if blog is added
- [ ] Monitor and optimize based on Search Console data
- [ ] Add hreflang tags if internationalization is needed

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
