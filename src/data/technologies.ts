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
  { name: "Python", iconName: "python", colorClass: "text-[#3776AB]" },
  { name: "TypeScript", iconName: "typescript", colorClass: "text-[#3178C6]" },
  { name: "React", iconName: "react", colorClass: "text-[#61DAFB]" },
  { name: "Next.js", iconName: "nextdotjs", colorClass: "text-text-1" },
  { name: "Node.js", iconName: "nodedotjs", colorClass: "text-[#339933]" },
  { name: "PostgreSQL", iconName: "postgresql", colorClass: "text-[#4169E1]" },
  { name: "Docker", iconName: "docker", colorClass: "text-[#2496ED]" },
  { name: "AWS", iconName: "amazonaws", colorClass: "text-[#FF9900]" },
  { name: "Playwright", iconName: "playwright", colorClass: "text-[#2EAD33]" },
  { name: "Selenium", iconName: "selenium", colorClass: "text-[#43B02A]" },
  { name: "OpenAI", iconName: "openai", colorClass: "text-text-1" },
  { name: "LangChain", iconName: "langchain", colorClass: "text-brand-primary" },
  { name: "Git", iconName: "git", colorClass: "text-[#F05032]" },
  { name: "Postman", iconName: "postman", colorClass: "text-[#FF6C37]" },
  { name: "Figma", iconName: "figma", colorClass: "text-[#F24E1E]" },
];

// Row 2: Scrolls right-to-left
export const technologiesRow2: Technology[] = [
  { name: "JavaScript", iconName: "javascript", colorClass: "text-[#F7DF1E]" },
  { name: "Go", iconName: "go", colorClass: "text-[#00ADD8]" },
  { name: "Vue.js", iconName: "vuedotjs", colorClass: "text-[#4FC08D]" },
  { name: "Tailwind CSS", iconName: "tailwindcss", colorClass: "text-[#06B6D4]" },
  { name: "Express", iconName: "express", colorClass: "text-text-1" },
  { name: "FastAPI", iconName: "fastapi", colorClass: "text-[#009688]" },
  { name: "MongoDB", iconName: "mongodb", colorClass: "text-[#47A248]" },
  { name: "Redis", iconName: "redis", colorClass: "text-[#DC382D]" },
  { name: "Kubernetes", iconName: "kubernetes", colorClass: "text-[#326CE5]" },
  { name: "TensorFlow", iconName: "tensorflow", colorClass: "text-[#FF6F00]" },
  { name: "GitHub", iconName: "github", colorClass: "text-text-1" },
  { name: "Jenkins", iconName: "jenkins", colorClass: "text-[#D24939]" },
  { name: "Jest", iconName: "jest", colorClass: "text-[#C21325]" },
  { name: "Cypress", iconName: "cypress", colorClass: "text-[#17202C]" },
  { name: "VS Code", iconName: "visualstudiocode", colorClass: "text-[#007ACC]" },
];
