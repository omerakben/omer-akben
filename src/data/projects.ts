export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  role: "Full-Stack" | "AI" | "QA" | "QA/AI";
  category: "ai-ml" | "web" | "mobile" | "tools" | "other";
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: "completed" | "in-progress" | "planned";
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "elon-ai-chat-builder",
    title: "Elon AI Chat Builder",
    description: "Enterprise AI chatbot platform for Elon University enabling faculty and staff to create custom AI assistants with knowledge base integration.",
    technologies: ["Next.js", "OpenAI", "Supabase", "TypeScript", "Vercel"],
    role: "Full-Stack",
    category: "ai-ml",
    featured: true,
    demoUrl: "#",
    githubUrl: "#",
    status: "completed",
  },
  {
    id: "2",
    slug: "ai-toolbar-chrome",
    title: "AI Toolbar — Chrome Extension",
    description: "Productivity Chrome extension with AI-powered tools for text summarization, translation, and content generation.",
    technologies: ["Chrome API", "React", "OpenAI", "TypeScript"],
    role: "AI",
    category: "ai-ml",
    featured: true,
    demoUrl: "#",
    status: "completed",
  },
  {
    id: "3",
    slug: "genesis-test-copilot",
    title: "Genesis Test Copilot",
    description: "AI-powered test automation assistant that generates Playwright tests from natural language descriptions.",
    technologies: ["Playwright", "LangChain", "FastAPI", "Python"],
    role: "QA/AI",
    category: "ai-ml",
    featured: true,
    githubUrl: "#",
    status: "completed",
  },
  {
    id: "4",
    slug: "autodocs-ai",
    title: "AutoDocs AI",
    description: "Automated documentation generator for codebases using AI to analyze code and generate comprehensive docs.",
    technologies: ["Python", "OpenAI", "AST", "Markdown"],
    role: "AI",
    category: "ai-ml",
    featured: false,
    githubUrl: "#",
    status: "completed",
  },
  {
    id: "5",
    slug: "prompt-toolkit",
    title: "Prompt Toolkit",
    description: "Library of reusable prompt templates and patterns for building reliable LLM applications.",
    technologies: ["LangChain", "Python", "OpenAI", "Templates"],
    role: "AI",
    category: "ai-ml",
    featured: false,
    demoUrl: "#",
    githubUrl: "#",
    status: "completed",
  },
  {
    id: "6",
    slug: "e2e-test-framework",
    title: "E2E Test Framework",
    description: "Scalable end-to-end test automation framework with parallel execution and comprehensive reporting.",
    technologies: ["Playwright", "TypeScript", "Docker", "CI/CD"],
    role: "QA",
    category: "tools",
    featured: false,
    githubUrl: "#",
    status: "completed",
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((project) => project.featured);
};

export const getProjectsByCategory = (category: Project["category"]): Project[] => {
  return projects.filter((project) => project.category === category);
};
