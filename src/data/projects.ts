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
  // TIER 1: Live Production Projects ⭐
  {
    id: "1",
    slug: "north-glass",
    title: "North Glass LLC - Production Website",
    description: "Live commercial website for glass/aluminum contractor with AI-powered business intelligence integration. Used by real customers with production-level performance and analytics.",
    longDescription: "Full-featured marketing website for North Glass LLC with integrated AI business plan generator (Elon AI Agent). Features include service showcases, project portfolio, contact forms with email delivery, Vercel Analytics tracking, SEO optimization, and mobile-responsive design. Actively serving real business operations.",
    technologies: ["Next.js 15", "React 19", "TypeScript", "Vercel Analytics", "nodemailer", "AI Integration"],
    role: "Full-Stack",
    category: "web",
    featured: true,
    demoUrl: "https://www.northglassnc.com",
    status: "completed",
  },
  {
    id: "2",
    slug: "elon-ai-agent",
    title: "Elon AI Agent - Business Plan Generator",
    description: "AI-powered business plan generator with parallel agent processing achieving 3-4x speedup. Production-validated by North Glass LLC with comprehensive sections and citation-rich output.",
    longDescription: "OpenAI-powered system generating comprehensive business plans in under 60 seconds using 7 specialized sub-agents running in parallel via asyncio. Features three-phase workflow (clarification, parallel generation, review), web search integration, code interpreter tools, JSON Schema validation, and quality assurance with 0-10 scoring. Built with FastAPI and Next.js 15.",
    technologies: ["FastAPI", "OpenAI API", "Next.js 15", "Python", "asyncio", "TypeScript"],
    role: "AI",
    category: "ai-ml",
    featured: true,
    demoUrl: "https://elon-ai-agent.happyplant-fd188d6c.canadacentral.azurecontainerapps.io/docs",
    status: "completed",
  },
  {
    id: "3",
    slug: "developer-cheat-sheets",
    title: "Developer Cheat Sheets",
    description: "Copy-paste ready code examples for Python, Django, TypeScript, and Next.js. Professional dark theme with syntax highlighting, responsive design, and fast Turbopack builds.",
    longDescription: "Technical reference web application featuring four comprehensive sections: Python Essentials, Django Framework, TypeScript Types, and Next.js App Router. Built with modern stack including syntax highlighting, responsive mobile/tablet layout, and optimized for developer workflows.",
    technologies: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS 4", "Turbopack"],
    role: "Full-Stack",
    category: "tools",
    featured: true,
    demoUrl: "https://developer-cheat-sheets-ha3dfgvz4-omera.vercel.app",
    status: "completed",
  },

  // TIER 2: Ready to Deploy
  {
    id: "4",
    slug: "elon-ai-toolbox",
    title: "Elon AI Toolbox - University Resources",
    description: "Curated catalog of 134 AI tools for Elon University students, faculty, and staff. Features smart filtering, search functionality, and responsive design with university branding.",
    longDescription: "Educational resource directory built for Elon University featuring comprehensive collection of AI tools organized by category. Includes real-time search, URL-synced filters for bookmarking, professional UI with Elon University brand colors (#8A0000 maroon), and performance optimized with static generation.",
    technologies: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS"],
    role: "Full-Stack",
    category: "tools",
    featured: true,
    demoUrl: "https://elon-ai-toolbox-mdxazqewk-omera.vercel.app",
    status: "completed",
  },
  {
    id: "5",
    slug: "capstone-deadline",
    title: "DEADLINE - Developer Command Center",
    description: "Live full-stack developer operations platform with demo mode. Manage environment variables, AI prompts, and documentation across dev/staging/prod environments with session-based authentication and secure artifact storage.",
    longDescription: "Production-deployed developer command center with workspace isolation, polymorphic artifacts (ENV_VAR, PROMPT, DOC_LINK), and comprehensive tagging system. Features Django 5 backend on Railway with PostgreSQL, Next.js 15 frontend on Vercel, session-based demo authentication, masked sensitive values, and environment-aware artifact management. Pre-populated with 6 sample artifacts demonstrating real-world use cases.",
    technologies: ["Django 5", "Next.js 15", "React 19", "PostgreSQL", "Railway", "Vercel", "DRF", "TypeScript"],
    role: "Full-Stack",
    category: "tools",
    featured: true,
    demoUrl: "https://capstone-client-8i3watbic-omera.vercel.app",
    status: "completed",
  },
  {
    id: "6",
    slug: "oteemo-ai-roadmap",
    title: "Oteemo AI Training Portal",
    description: "Enterprise AI training platform with Azure AD SSO and role-based learning paths. Features advanced search with Fuse.js, 41+ curated courses, and comprehensive admin interface.",
    longDescription: "Internal AI training portal for Oteemo employees featuring Azure AD OAuth integration, group-based role mapping (admin/architect/engineering/conversant), sophisticated search ranking algorithm with Fuse.js, and JSON-based content management. Built for enterprise with middleware authorization and JWT session management.",
    technologies: ["Next.js 15", "NextAuth.js v5", "Azure AD", "Fuse.js", "TypeScript", "Tailwind CSS 4"],
    role: "Full-Stack",
    category: "ai-ml",
    featured: false,
    demoUrl: "https://oteemo-ai-roadmap.vercel.app",
    status: "completed",
  },

  // TIER 3: Production-Ready with Minor Items
  {
    id: "7",
    slug: "tuel-chatbot",
    title: "Tuel AI Chatbot Builder",
    description: "Full-stack chatbot builder platform for Tuel University with multi-provider AI support (OpenAI, Gemini, OpenRouter), RAG implementation, and OAuth SSO.",
    longDescription: "Complete chatbot builder platform allowing instructors to create AI-powered assistants trained on custom content (files + URLs). Features include vector storage for RAG, real-time streaming chat, share tokens, analytics dashboard, BYOK encryption for OpenRouter, and comprehensive role-based access control.",
    technologies: ["FastAPI", "Next.js 15", "OpenAI GPT-4", "Gemini", "NextAuth.js v5", "Python", "SQLAlchemy"],
    role: "AI",
    category: "ai-ml",
    featured: false,
    status: "completed",
  },
  {
    id: "8",
    slug: "ai-tutor",
    title: "AI Tutor - Multi-Agent Learning Platform",
    description: "Voice-powered educational platform with 6 specialized AI agents, real-time collaborative coding, and Docker-based sandboxed execution. Features 46 database models and 100+ API endpoints.",
    longDescription: "Full-stack educational platform with multi-agent AI system (Google Gemini ADK), voice-to-voice learning, interactive Canvas with Monaco editor, real ML models (Random Forest, Neural Networks), and comprehensive analytics. Built with Django 5 and Next.js 15, featuring Celery task queue, Redis caching, and n8n automation.",
    technologies: ["Django 5", "Next.js 15", "React 19", "Google Gemini AI", "Python", "TypeScript", "PostgreSQL", "Redis", "Celery"],
    role: "AI",
    category: "ai-ml",
    featured: false,
    status: "in-progress",
  },
  {
    id: "9",
    slug: "tuel-animation-library",
    title: "Tuel - React Animation Library",
    description: "Open-source React animation library published as 13 NPM packages (@tuel/*). Features motion primitives, scroll animations, interactive galleries, and Three.js integration.",
    longDescription: "Monorepo animation library built with Turborepo managing 13 specialized packages: motion primitives, scroll-triggered animations, image galleries, text effects, GSAP integration, Three.js helpers, and performance optimization utilities. Built with TypeScript and modern tooling (pnpm workspaces, tsup, Changesets).",
    technologies: ["TypeScript", "React 19", "Turborepo", "Framer Motion", "GSAP", "Three.js", "pnpm"],
    role: "Full-Stack",
    category: "tools",
    featured: false,
    status: "in-progress",
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
