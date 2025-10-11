export interface Skill {
  name: string;
  level: "Expert" | "Advanced" | "Proficient";
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "TypeScript", level: "Expert" },
      { name: "JavaScript", level: "Expert" },
      { name: "Python", level: "Expert" },
      { name: "C#", level: "Expert" },
      { name: "Java", level: "Advanced" },
    ],
  },
  {
    category: "Frontend Development",
    skills: [
      { name: "React", level: "Expert" },
      { name: "Next.js", level: "Expert" },
      { name: "HTML", level: "Expert" },
      { name: "CSS", level: "Expert" },
      { name: "Tailwind CSS", level: "Expert" },
    ],
  },
  {
    category: "Backend Development",
    skills: [
      { name: "FastAPI", level: "Expert" },
      { name: "Django", level: "Advanced" },
      { name: "REST APIs", level: "Expert" },
      { name: "Node.js", level: "Advanced" },
    ],
  },
  {
    category: "Test Automation",
    skills: [
      { name: "Selenium WebDriver", level: "Expert" },
      { name: "Playwright", level: "Expert" },
      { name: "Jest", level: "Advanced" },
      { name: "Vitest", level: "Advanced" },
      { name: "Cypress", level: "Advanced" },
      { name: "SpecFlow/Cucumber (BDD)", level: "Expert" },
      { name: "MSTest", level: "Expert" },
      { name: "NUnit", level: "Advanced" },
      { name: "TestNG", level: "Advanced" },
      { name: "JUnit", level: "Advanced" },
    ],
  },
  {
    category: "CI/CD & DevOps",
    skills: [
      { name: "Azure DevOps", level: "Expert" },
      { name: "Jenkins", level: "Expert" },
      { name: "Git", level: "Expert" },
      { name: "Docker", level: "Advanced" },
      { name: "Kubernetes", level: "Proficient" },
    ],
  },
  {
    category: "Cloud & Data",
    skills: [
      { name: "Azure", level: "Advanced" },
      { name: "AWS", level: "Advanced" },
      { name: "SQL Server", level: "Expert" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "MySQL", level: "Advanced" },
      { name: "MongoDB", level: "Proficient" },
    ],
  },
  {
    category: "Automation & Integrations",
    skills: [
      { name: "Zapier", level: "Advanced" },
      { name: "n8n", level: "Advanced" },
      { name: "Make.com", level: "Proficient" },
    ],
  },
  {
    category: "Experimentation & Telemetry",
    skills: [
      { name: "Feature Flags", level: "Advanced" },
      { name: "A/B Testing", level: "Advanced" },
      { name: "Split/LaunchDarkly", level: "Proficient" },
      { name: "Analytics Instrumentation", level: "Advanced" },
    ],
  },
  {
    category: "AI-Assisted Development",
    skills: [
      { name: "GitHub Copilot", level: "Expert" },
      { name: "ChatGPT", level: "Expert" },
      { name: "Claude", level: "Expert" },
      { name: "Cursor", level: "Expert" },
      { name: "Prompt Engineering", level: "Expert" },
      { name: "Automated Test Generation", level: "Advanced" },
    ],
  },
];

export const getLevelColor = (level: Skill["level"]): string => {
  switch (level) {
    case "Expert":
      return "bg-brand-primary text-surf-0";
    case "Advanced":
      return "bg-accent-primary text-white";
    case "Proficient":
      return "bg-gradient-to-r from-brand-primary to-accent-primary text-white";
  }
};
