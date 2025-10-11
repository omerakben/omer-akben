/**
 * Technology Marquee Data
 *
 * Technologies and tools used, with simple-icons mapping and theme colors
 */

export interface Technology {
  name: string;
  iconName: string; // simple-icons slug
  colorClass: string; // Tailwind class using design theme colors
}

// Row 1: Scrolls left-to-right
export const technologiesRow1: Technology[] = [
  { name: "Python", iconName: "python", colorClass: "text-brand-python" },
  { name: "TypeScript", iconName: "typescript", colorClass: "text-brand-typescript" },
  { name: "React", iconName: "react", colorClass: "text-brand-react" },
  { name: "Next.js", iconName: "nextdotjs", colorClass: "text-text-1" },
  { name: "Node.js", iconName: "nodedotjs", colorClass: "text-brand-node" },
  { name: "PostgreSQL", iconName: "postgresql", colorClass: "text-brand-postgresql" },
  { name: "Docker", iconName: "docker", colorClass: "text-brand-docker" },
  { name: "AWS", iconName: "amazonaws", colorClass: "text-brand-aws" },
  { name: "Playwright", iconName: "playwright", colorClass: "text-brand-playwright" },
  { name: "Selenium", iconName: "selenium", colorClass: "text-brand-selenium" },
  { name: "OpenAI", iconName: "openai", colorClass: "text-text-1" },
  { name: "LangChain", iconName: "langchain", colorClass: "text-brand-primary" },
  { name: "Git", iconName: "git", colorClass: "text-brand-git" },
  { name: "Postman", iconName: "postman", colorClass: "text-brand-postman" },
  { name: "Figma", iconName: "figma", colorClass: "text-brand-figma" },
];

// Row 2: Scrolls right-to-left
export const technologiesRow2: Technology[] = [
  { name: "JavaScript", iconName: "javascript", colorClass: "text-brand-javascript" },
  { name: "Go", iconName: "go", colorClass: "text-brand-go" },
  { name: "Vue.js", iconName: "vuedotjs", colorClass: "text-brand-vue" },
  { name: "Tailwind CSS", iconName: "tailwindcss", colorClass: "text-brand-tailwind" },
  { name: "Express", iconName: "express", colorClass: "text-text-1" },
  { name: "FastAPI", iconName: "fastapi", colorClass: "text-brand-fastapi" },
  { name: "MongoDB", iconName: "mongodb", colorClass: "text-brand-mongodb" },
  { name: "Redis", iconName: "redis", colorClass: "text-brand-redis" },
  { name: "Kubernetes", iconName: "kubernetes", colorClass: "text-brand-kubernetes" },
  { name: "TensorFlow", iconName: "tensorflow", colorClass: "text-brand-tensorflow" },
  { name: "GitHub", iconName: "github", colorClass: "text-text-1" },
  { name: "Jenkins", iconName: "jenkins", colorClass: "text-brand-jenkins" },
  { name: "Jest", iconName: "jest", colorClass: "text-brand-jest" },
  { name: "Cypress", iconName: "cypress", colorClass: "text-brand-cypress" },
  { name: "VS Code", iconName: "visualstudiocode", colorClass: "text-brand-vscode" },
];
