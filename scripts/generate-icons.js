#!/usr/bin/env node
/**
 * Generate lightweight icon manifest from simple-icons SVG files
 * This script extracts only the icons we need, reducing bundle size from 2.3MB to ~50KB
 */

const fs = require("fs");
const path = require("path");

// Icons we actually use in the application (53 icons vs 3000+)
const REQUIRED_ICONS = [
  "amazonwebservices",
  "anthropic",
  "azuredevops",
  "csharp",
  "css3",
  "cucumber",
  "cursor",
  "cypress",
  "django",
  "docker",
  "dotnet",
  "express",
  "fastapi",
  "figma",
  "flagsmith",
  "git",
  "github",
  "githubcopilot",
  "go",
  "googleanalytics",
  "googleoptimize",
  "html5",
  "jenkins",
  "jest",
  "junit5",
  "kubernetes",
  "langchain",
  "launchdarkly",
  "make",
  "microsoftazure",
  "microsoftsqlserver",
  "mongodb",
  "mysql",
  "n8n",
  "nextdotjs",
  "nodedotjs",
  "openai",
  "openjdk",
  "playwright",
  "postman",
  "postgresql",
  "python",
  "react",
  "redis",
  "selenium",
  "tailwindcss",
  "tensorflow",
  "testinglibrary",
  "typescript",
  "visualstudiocode",
  "vitest",
  "vuedotjs",
  "zapier",
  "javascript",
];

const iconsDir = path.join(__dirname, "../node_modules/simple-icons/icons");
const outputFile = path.join(
  __dirname,
  "../src/lib/icon-manifest-generated.ts"
);

// Read SVG files and extract path data
const icons = {};
let missingIcons = [];

for (const slug of REQUIRED_ICONS) {
  const svgPath = path.join(iconsDir, `${slug}.svg`);

  if (!fs.existsSync(svgPath)) {
    missingIcons.push(slug);
    continue;
  }

  const svgContent = fs.readFileSync(svgPath, "utf8");

  // Extract title and path from SVG
  const titleMatch = svgContent.match(/<title>(.*?)<\/title>/);
  const pathMatch = svgContent.match(/<path d="([^"]+)"/);

  if (titleMatch && pathMatch) {
    icons[slug] = {
      title: titleMatch[1],
      path: pathMatch[1],
      slug: slug,
    };
  }
}

// Generate TypeScript file
// Build icon data for JSON
const iconDataForJson = Object.entries(icons).reduce((acc, [slug, data]) => {
  acc[slug] = {
    title: data.title,
    slug: slug,
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${data.title}</title><path d="${data.path}"/></svg>`,
    path: data.path,
  };
  return acc;
}, {});

const tsContent = `/**
 * Generated Icon Manifest
 * Auto-generated from simple-icons SVG files
 * DO NOT EDIT - Run npm run generate:icons to regenerate
 *
 * Bundle size: ~${Object.keys(icons).length * 3}KB (vs 2.3MB with wildcard import)
 * Icons: ${Object.keys(icons).length}/${REQUIRED_ICONS.length} loaded
 */

export interface SimpleIcon {
  title: string;
  slug: string;
  svg: string;
  path: string;
}

const iconData: Record<string, SimpleIcon> = ${JSON.stringify(iconDataForJson, null, 2)};

/**
 * Get icon by slug
 */
export function getIconBySlug(slug: string): SimpleIcon | null {
  return iconData[slug] || null;
}

/**
 * Get all available icon slugs
 */
export function getAvailableIcons(): string[] {
  return Object.keys(iconData);
}

/**
 * Get icon count
 */
export function getIconCount(): number {
  return Object.keys(iconData).length;
}
`;

// Write generated file
fs.writeFileSync(outputFile, tsContent, "utf8");

console.log(
  `✅ Generated ${Object.keys(icons).length}/${REQUIRED_ICONS.length} icons`
);
console.log(`📦 Output: ${outputFile}`);

if (missingIcons.length > 0) {
  console.log(`⚠️  Missing icons: ${missingIcons.join(", ")}`);
}
