import type { ProjectStatus } from "@/lib/constants";

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
  displayOrder?: number;
  demoUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: ProjectStatus;
}

export const projects: Project[] = [
  // TIER 1: Capstone & Professional Frameworks ⭐
  {
    id: "5",
    slug: "capstone-deadline",
    title: "DEADLINE - Developer Command Center",
    description:
      "Production full-stack developer operations platform achieving A- (92/100) UI/UX grade. Centralizes ENV variables, AI prompts, and documentation across dev/staging/prod environments with Firebase authentication, workspace isolation, and immutable audit logs for compliance.",
    longDescription:
      "DEADLINE solves the scattered artifact problem developers face daily—hunting ENV variables in Slack threads, losing reusable prompts, and navigating fragmented documentation. Built with Django 5 + PostgreSQL (Railway) and Next.js 15 (Vercel), it provides a secure command center with polymorphic artifact management (ENV_VAR, PROMPT, DOC_LINK), environment-aware scoping (DEV/STAGING/PROD), masked sensitive values with explicit reveal tracking, comprehensive tagging/search, and immutable audit logs (user, IP, timestamp). Rate limiting (10 reveals/min, 60 searches/hour) prevents credential harvesting. Achieved A- grade in Playwright visual testing with professional micro-interactions (hover states, loading feedback, accessible focus rings). 64/64 backend tests passing, zero linting errors, mobile-responsive across all viewports (375px-1512px). Firebase Authentication (Email/Password + Google OAuth) required for full access—no demo credentials to ensure security.",
    image: "/assets/deadline-hero.png",
    technologies: [
      "Django 5",
      "Next.js 15",
      "React 19",
      "PostgreSQL",
      "Railway",
      "Vercel",
      "Django REST Framework",
      "TypeScript",
      "Tailwind CSS",
      "Firebase Auth",
      "Playwright",
      "pytest",
    ],
    role: "Full-Stack",
    category: "tools",
    featured: true,
    demoUrl: "https://deadline-demo.vercel.app",
    githubUrl: "https://github.com/omerakben/deadline",
    startDate: "September 2024",
    endDate: "October 2024",
    status: "beta",
  },
  {
    id: "9",
    slug: "tuel-animation-library",
    title: "Tuel - Professional React Animation Library",
    description:
      "Production-ready React animation library with 13 specialized NPM packages (@tuel/*). Features scroll animations, interactive galleries, Three.js integration, and performance optimization utilities. Built with TypeScript, Turborepo, and modern monorepo tooling.",
    longDescription:
      "Open-source animation library addressing the gap between basic CSS animations and complex animation frameworks. Tuel provides professional-grade components with zero-config defaults, SSR safety, and accessibility built-in. The monorepo architecture (Turborepo + pnpm workspaces) manages 13 packages covering motion primitives, scroll effects, galleries, text animations, GSAP/Three.js integration, and performance utilities. Published to npm with automated Changesets versioning and GitHub Actions CI/CD. Currently at v0.2.0 (alpha) with active development toward v2.0.0 production release (80%+ test coverage, WCAG AA compliance, comprehensive documentation).",
    technologies: [
      "TypeScript",
      "React 19",
      "Next.js 15",
      "Turborepo",
      "Framer Motion",
      "GSAP",
      "Three.js",
      "pnpm",
      "Vitest",
      "Playwright",
      "Changesets",
    ],
    role: "Full-Stack",
    category: "tools",
    featured: true,
    demoUrl: "https://tuel.vercel.app",
    githubUrl: "https://github.com/omerakben/tuel",
    status: "in-progress",
    startDate: "December 2024",
    endDate: "Ongoing (v2.0.0 June 2025)",
  },
  {
    id: "10",
    slug: "tuel-selenium-webdriver-restsharp",
    title: "TUEL Selenium WebDriver + RestSharp Test Framework",
    description:
      "Production-ready .NET 8 automation framework combining Selenium WebDriver UI suites with RestSharp API coverage, centralized configuration, Azure AD auth flows, and Docker-first execution for CI pipelines.",
    longDescription:
      "Transit to Fully Open-Source TUEL is a modern SDET reference implementation that evolved a legacy financial services harness into a vendor-neutral test framework. It ships with Page Object Model patterns, retry-aware WebDriver helpers, multi-flow Azure Entra ID authentication, environment-scoped configuration, and SecretManager support for env/Key Vault/encrypted references. Thread.Sleep was eliminated in favor of smart waits, and structured logging captures every action with masking. Docker Compose spins up Selenium Grid-ready runs that finish full suites in under five minutes with 95%+ reliability. Each delivery phase is wrapped with documentation—smart-wait initiative, centralized configuration rollout, structured logging, and security hardening—so other teams can adopt without rework.",
    technologies: [
      ".NET 8",
      "C#",
      "Selenium WebDriver",
      "RestSharp",
      "Azure AD",
      "Secret Manager",
      "Azure Key Vault",
      "Docker",
      "xUnit",
      "WebDriverWait",
    ],
    role: "QA",
    category: "tools",
    featured: true,
    githubUrl: "https://github.com/omerakben/tuel-Selenium-WebDriver-RestSharp",
    status: "beta",
  },

  // TIER 2: Live Production Projects
  {
    id: "1",
    slug: "north-glass",
    title: "North Glass LLC - Production Website",
    description:
      "Live commercial website for glass/aluminum contractor with AI-powered business intelligence integration. Used by real customers with production-level performance and analytics.",
    longDescription:
      "Full-featured marketing website for North Glass LLC with integrated AI business plan generator (Elon AI Agent). Features include service showcases, project portfolio, contact forms with email delivery, Vercel Analytics tracking, SEO optimization, and mobile-responsive design. Actively serving real business operations.",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Vercel Analytics",
      "nodemailer",
      "AI Integration",
    ],
    role: "Full-Stack",
    category: "web",
    featured: true,
    demoUrl: "https://www.northglassnc.com",
    githubUrl: "https://github.com/omerakben/north-glass",
    status: "beta",
  },
  {
    id: "2",
    slug: "elon-ai-agent",
    title: "Elon AI Agent - Business Plan Generator",
    description:
      "AI-powered business plan generator with parallel agent processing achieving 3-4x speedup. Production-validated by North Glass LLC with comprehensive sections and citation-rich output.",
    longDescription:
      "OpenAI-powered system generating comprehensive business plans in under 60 seconds using 7 specialized sub-agents running in parallel via asyncio. Features three-phase workflow (clarification, parallel generation, review), web search integration, code interpreter tools, JSON Schema validation, and quality assurance with 0-10 scoring. Built with FastAPI and Next.js 15.",
    technologies: [
      "FastAPI",
      "OpenAI API",
      "Next.js 15",
      "Python",
      "asyncio",
      "TypeScript",
    ],
    role: "AI",
    category: "ai-ml",
    featured: true,
    demoUrl:
      "https://elon-ai-agent.happyplant-fd188d6c.canadacentral.azurecontainerapps.io/docs",
    githubUrl: "https://github.com/omerakben/elon-ai-agent",
    status: "beta",
  },
  {
    id: "3",
    slug: "developer-cheat-sheets",
    title: "Developer Cheat Sheets",
    description:
      "Copy-paste ready code examples for Python, Django, TypeScript, and Next.js. Professional dark theme with syntax highlighting, responsive design, and fast Turbopack builds.",
    longDescription:
      "Technical reference web application featuring four comprehensive sections: Python Essentials, Django Framework, TypeScript Types, and Next.js App Router. Built with modern stack including syntax highlighting, responsive mobile/tablet layout, and optimized for developer workflows.",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Turbopack",
    ],
    role: "Full-Stack",
    category: "tools",
    featured: true,
    demoUrl: "https://developer-cheat-sheets.vercel.app/",
    githubUrl: "https://github.com/omerakben/developer-cheat-sheets",
    status: "beta",
  },

  // TIER 2: Ready to Deploy
  {
    id: "4",
    slug: "elon-ai-toolbox",
    title: "Elon AI Toolbox - University Resources",
    description:
      "Curated catalog of 134 AI tools for Elon University students, faculty, and staff. Features smart filtering, search functionality, and responsive design with university branding.",
    longDescription:
      "The Elon AI Toolbox was born out of a need to provide students, faculty, and staff at Elon University with a centralized, easy-to-use platform for discovering and utilizing AI tools. The project's main goal was to create a curated and searchable catalog of AI resources to support teaching, learning, and research across the university. I took on the challenge of building this platform from the ground up, focusing on creating a user-friendly interface and a robust filtering and search system. The result is a fast, responsive, and accessible web application that has been praised for its design and functionality. The toolbox is now a go-to resource for the Elon community, empowering users to explore the potential of AI in their academic and professional endeavors.",
    image: "/assets/elon-ai-toolbox-screenshot.png",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Fuse.js",
    ],
    role: "Full-Stack",
    category: "tools",
    featured: true,
    displayOrder: 1,
    demoUrl: "https://elon-ai-toolbox-mdxazqewk-omera.vercel.app",
    githubUrl: "https://github.com/omerakben/elon-ai-toolbox",
    status: "beta",
  },
  {
    id: "6",
    slug: "oteemo-ai-roadmap",
    title: "Oteemo AI Training Portal",
    description:
      "Enterprise AI training platform with Azure AD SSO and role-based learning paths. Features advanced search with Fuse.js, 41+ curated courses, and comprehensive admin interface.",
    longDescription:
      "Internal AI training portal for Oteemo employees featuring Azure AD OAuth integration, group-based role mapping (admin/architect/engineering/conversant), sophisticated search ranking algorithm with Fuse.js, and JSON-based content management. Built for enterprise with middleware authorization and JWT session management.",
    technologies: [
      "Next.js 15",
      "NextAuth.js v5",
      "Azure AD",
      "Fuse.js",
      "TypeScript",
      "Tailwind CSS 4",
    ],
    role: "Full-Stack",
    category: "ai-ml",
    featured: false,
    demoUrl: "https://oteemo-ai-roadmap.vercel.app",
    githubUrl: "https://github.com/omerakben/oteemo-ai-roadmap",
    status: "beta",
  },

  // TIER 3: Production-Ready with Minor Items
  {
    id: "7",
    slug: "tuel-chatbot",
    title: "Tuel AI Chatbot Builder",
    description:
      "Full-stack chatbot builder platform for Tuel University with multi-provider AI support (OpenAI, Gemini, OpenRouter), RAG implementation, and OAuth SSO.",
    longDescription:
      "Complete chatbot builder platform allowing instructors to create AI-powered assistants trained on custom content (files + URLs). Features include vector storage for RAG, real-time streaming chat, share tokens, analytics dashboard, BYOK encryption for OpenRouter, and comprehensive role-based access control.",
    technologies: [
      "FastAPI",
      "Next.js 15",
      "OpenAI GPT-4",
      "Gemini",
      "NextAuth.js v5",
      "Python",
      "SQLAlchemy",
    ],
    role: "AI",
    category: "ai-ml",
    featured: false,
    githubUrl: "https://github.com/omerakben/tuel-chatbot",
    status: "beta",
  },
  {
    id: "8",
    slug: "ai-tutor",
    title: "AI Tutor - Multi-Agent Learning Platform",
    description:
      "Voice-powered educational platform with 6 specialized AI agents, real-time collaborative coding, and Docker-based sandboxed execution. Features 46 database models and 100+ API endpoints.",
    longDescription:
      "Full-stack educational platform with multi-agent AI system (Google Gemini ADK), voice-to-voice learning, interactive Canvas with Monaco editor, real ML models (Random Forest, Neural Networks), and comprehensive analytics. Built with Django 5 and Next.js 15, featuring Celery task queue, Redis caching, and n8n automation.",
    technologies: [
      "Django 5",
      "Next.js 15",
      "React 19",
      "Google Gemini AI",
      "Python",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Celery",
    ],
    role: "AI",
    category: "ai-ml",
    featured: false,
    githubUrl: "https://github.com/omerakben/ai-tutor",
    status: "in-progress",
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((project) => project.featured);
};

export const getProjectsByCategory = (
  category: Project["category"]
): Project[] => {
  return projects.filter((project) => project.category === category);
};
