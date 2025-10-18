/**
 * Skill Icon Mapping
 * Maps skill names to simple-icons or lucide-react icons
 */

import * as SimpleIcons from "simple-icons";
import DOMPurify from "dompurify";

// Map skill names to simple-icons slugs
const SKILL_ICON_MAP: Record<string, string> = {
  // Programming Languages
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
  "C#": "csharp",
  Java: "openjdk",

  // Frontend
  React: "react",
  "Next.js": "nextdotjs",
  HTML: "html5",
  CSS: "css3",
  "Tailwind CSS": "tailwindcss",

  // Backend
  FastAPI: "fastapi",
  Django: "django",
  "REST APIs": "fastapi", // Generic API icon
  "Node.js": "nodedotjs",

  // Testing
  "Selenium WebDriver": "selenium",
  Playwright: "playwright",
  Jest: "jest",
  Vitest: "vitest",
  Cypress: "cypress",
  "SpecFlow/Cucumber (BDD)": "cucumber",
  MSTest: "dotnet",
  NUnit: "dotnet",
  TestNG: "testinglibrary",
  JUnit: "junit5",

  // CI/CD & DevOps
  "Azure DevOps": "azuredevops",
  Jenkins: "jenkins",
  Git: "git",
  Docker: "docker",
  Kubernetes: "kubernetes",

  // Cloud & Data
  Azure: "microsoftazure",
  AWS: "amazonwebservices",
  "SQL Server": "microsoftsqlserver",
  PostgreSQL: "postgresql",
  MySQL: "mysql",
  MongoDB: "mongodb",

  // Automation & Integrations
  Zapier: "zapier",
  n8n: "n8n",
  "Make.com": "make",

  // Experimentation & Telemetry
  "Feature Flags": "flagsmith",
  "A/B Testing": "googleoptimize",
  "Split/LaunchDarkly": "launchdarkly",
  "Analytics Instrumentation": "googleanalytics",

  // AI-Assisted Development
  "GitHub Copilot": "githubcopilot",
  ChatGPT: "openai",
  Claude: "anthropic",
  Cursor: "cursor",
  "Prompt Engineering": "openai",
  "Automated Test Generation": "openai",
};

/**
 * Get SVG icon for a skill
 */
export function getSkillIcon(skillName: string): string | null {
  const iconSlug = SKILL_ICON_MAP[skillName];
  if (!iconSlug) return null;

  try {
    // Get icon from simple-icons - dynamic lookup requires any cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const icon = (SimpleIcons as any)[`si${iconSlug.charAt(0).toUpperCase()}${iconSlug.slice(1).replace(/-/g, "")}`];
    if (!icon) return null;

    return `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="${icon.path}"/>
    </svg>`;
  } catch {
    return null;
  }
}

/**
 * Render skill icon as React component
 */
export function SkillIcon({ skillName, className = "w-5 h-5" }: { skillName: string; className?: string }) {
  const svgString = getSkillIcon(skillName);

  if (!svgString) {
    // Fallback to checkmark if no icon found
    return (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(svgString, {
          USE_PROFILES: { svg: true }
        })
      }}
    />
  );
}
