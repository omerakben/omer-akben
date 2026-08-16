export interface Project {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string; // Shortened title for card display
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
  status?: "completed" | "in-progress" | "planned";
}

export const projects: Project[] = [
  // TIER 1: Capstone & Professional Frameworks ⭐
  {
    id: "5",
    slug: "capstone-deadline",
    title: "DEADLINE - Developer Command Center",
    shortTitle: "DEADLINE",
    description:
      "Production full-stack developer operations platform achieving A- (92/100) UI/UX grade. Centralizes ENV variables, AI prompts, and documentation across dev/staging/prod environments with Firebase authentication, workspace isolation, and immutable audit logs for compliance.",
    longDescription:
      "DEADLINE solves the scattered artifact problem developers face daily—hunting ENV variables in Slack threads, losing reusable prompts, and navigating fragmented documentation. Built with Django 5 + PostgreSQL (Railway) and Next.js 15 (Vercel), it provides a secure command center with polymorphic artifact management (ENV_VAR, PROMPT, DOC_LINK), environment-aware scoping (DEV/STAGING/PROD), masked sensitive values with explicit reveal tracking, comprehensive tagging/search, and immutable audit logs (user, IP, timestamp). Rate limiting (10 reveals/min, 60 searches/hour) prevents credential harvesting. Achieved A- grade in Playwright visual testing with professional micro-interactions (hover states, loading feedback, accessible focus rings). 64/64 backend tests passing, zero linting errors, mobile-responsive across all viewports (375px-1512px). Firebase Authentication (Email/Password + Google OAuth) required for full access—no demo credentials to ensure security.",
    image: "/deadline_img/deadline-dashboard.png",
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
    featured: false,
    displayOrder: 5,
    demoUrl: "https://deadline-demo.vercel.app",
    githubUrl: "https://github.com/omerakben/deadline",
    startDate: "September 2024",
    endDate: "October 2024",
    status: "completed",
  },
  {
    id: "9",
    slug: "tuel-animation-library",
    title: "Tuel - Professional React Animation Library",
    shortTitle: "Tuel Animation Library",
    description:
      "Production-ready React animation library with 13 specialized NPM packages (@tuel/*). Features scroll animations, interactive galleries, Three.js integration, and performance optimization utilities. Built with TypeScript, Turborepo, and modern monorepo tooling.",
    longDescription:
      "Open-source animation library addressing the gap between basic CSS animations and complex animation frameworks. Tuel provides professional-grade components with zero-config defaults, SSR safety, and accessibility built-in. The monorepo architecture (Turborepo + pnpm workspaces) manages 13 packages covering motion primitives, scroll effects, galleries, text animations, GSAP/Three.js integration, and performance utilities. Published to npm with automated Changesets versioning and GitHub Actions CI/CD. Currently at v0.2.0 (alpha) with active development toward v2.0.0 production release (80%+ test coverage, WCAG AA compliance, comprehensive documentation).",
    image: "/tuel_animations_img/tuel_page.png",
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
    displayOrder: 4,
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
    shortTitle: "Tuel Selenium Test Framework",
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
    featured: false,
    displayOrder: 1,
    githubUrl: "https://github.com/omerakben/tuel-Selenium-WebDriver-RestSharp",
    status: "completed",
  },

  // TIER 2: Live Production Projects
  {
    id: "1",
    slug: "north-glass",
    title: "North Glass LLC - Production Website",
    shortTitle: "North Glass LLC",
    description:
      "Live commercial website for glass/aluminum contractor with AI-powered business intelligence integration. Used by real customers with production-level performance and analytics.",
    longDescription:
      "Full-featured marketing website for North Glass LLC with integrated AI business plan generator (Elon AI Agent). Features include service showcases, project portfolio, contact forms with email delivery, Vercel Analytics tracking, SEO optimization, and mobile-responsive design. Actively serving real business operations.",
    image: "/nort_glass_img/north_glass_hero.png",
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
    displayOrder: 2,
    demoUrl: "https://www.northglassnc.com",
    githubUrl: "https://github.com/omerakben/north-glass",
    status: "completed",
  },
  {
    id: "13",
    slug: "elon-ai",
    title: "Elon AI — TUEL AI Platform",
    shortTitle: "Elon AI",
    description:
      "Live TUEL AI deployment at Elon University: 622 sessions, 72.2M tokens, 202 users, 96% satisfaction (73/76), 2% error rate. Professor Mustafa Akben's research shows 88% voluntary adoption and 94% exam average among engaged weekly users (Spring 2026). FERPA-compliant, citation-grounded, with 30 AI assistants serving 27 teachers and 84 students.",
    longDescription:
      "Elon AI is the live TUEL AI deployment for Elon University, built as a B2B educational technology platform with 16+ interactive learning tools (flashcards, quizzes, concept maps, Hume AI voice chat) and a 7-layer prompt system with citations. It supports multi-model routing (OpenAI, Claude, Grok, Gemini) and a production RAG pipeline using Upstash Vector + pgvector. The platform includes Microsoft Entra ID SSO, role-based access control, faculty controls for AI behavior, 35+ audit action types, and evaluation with RAGAS. Production metrics: 622 all-time sessions, 202 total users, 72.2M all-time tokens, 2% error rate, 96% satisfaction (73/76), and P95 retrieval latency under 2 seconds. The platform currently powers 30 AI assistants used by 27 teachers and 84 students. Professor Mustafa Akben's peer-reviewed research found 88% voluntary adoption and 94% exam average among engaged weekly users (Spring 2026)—outcomes attributed to FERPA-compliant, citation-grounded AI that faculty trust and students embrace. Live at https://elon-ai.app — public demo assistants and chatbot builder at https://tuel.ai.",
    image: "/elon_ai_img/elon_ai_img.png",
    technologies: [
      "Next.js 15",
      "React 19",
      "FastAPI",
      "Vercel AI SDK",
      "OpenAI",
      "Claude",
      "Grok",
      "Gemini",
      "LangChain",
      "LangGraph",
      "RAG (Upstash Vector, pgvector)",
      "Microsoft Entra ID",
      "Hume AI",
      "Drizzle ORM",
      "Neon Postgres",
      "QStash",
      "Playwright",
    ],
    role: "AI",
    category: "ai-ml",
    featured: true,
    displayOrder: 1,
    demoUrl: "https://elon-ai.app/",
    startDate: "January 2024",
    endDate: "Present",
    status: "completed",
  },
  {
    id: "2",
    slug: "elon-ai-agent",
    title: "Elon AI Agent - Business Plan Generator",
    description:
      "AI-powered business plan generator with parallel agent processing achieving 3-4x speedup. Production-validated by North Glass LLC with comprehensive sections and citation-rich output. [ELON UNIVERSITY PROPERTY - PRIVATE REPOSITORY]",
    longDescription:
      "OpenAI-powered system generating comprehensive business plans in under 60 seconds using 7 specialized sub-agents running in parallel via asyncio. Features three-phase workflow (clarification, parallel generation, review), web search integration, code interpreter tools, JSON Schema validation, and quality assurance with 0-10 scoring. Built with FastAPI and Next.js 15. This is a private repository developed for Elon University and remains their intellectual property.",
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
    featured: false,
    displayOrder: 2,
    demoUrl:
      "https://elon-ai-agent.happyplant-fd188d6c.canadacentral.azurecontainerapps.io/docs",
    // GitHub: Private repository - Elon University property
    status: "completed",
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
    featured: false,
    displayOrder: 5,
    // TEMPORARILY DISABLED - Updating with original sources
    // demoUrl: "https://developer-cheat-sheets.vercel.app/",
    // githubUrl: "https://github.com/omerakben/developer-cheat-sheets",
    status: "completed",
  },

  // TIER 2: Ready to Deploy
  {
    id: "4",
    slug: "elon-ai-toolbox",
    title: "Elon AI Toolbox",
    shortTitle: "AI Toolbox",
    description:
      "Comprehensive catalog of AI-powered educational and productivity tools for Elon University students, faculty, and staff. Features smart filtering, responsive design, and university branding to enhance teaching, learning, and research.",
    longDescription:
      "The Elon Generative AI Toolbox provides the Elon University community with a centralized, searchable platform for discovering and utilizing AI resources. Built with Next.js 15 and React 19, the toolbox features a curated collection of generative AI tools and custom chatbots designed to enhance productivity, support research initiatives, and elevate teaching and learning experiences across campus. The platform includes smart filtering by category and keywords, responsive design optimized for all devices, comprehensive tool descriptions with direct links, and Elon University brand integration. Each tool is categorized for easy discovery across Academic Support, Administrative Tools, Career Development, Creative Tools, Data Analysis, Language Learning, Research Assistance, Teaching Tools, Writing Support, and more. The application is deployed on Azure App Service with performance optimization, image lazy loading, and WCAG accessibility compliance.",
    image: "/elon_ai_img/elon_ai_toolbox.png",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Font Awesome",
      "Fuse.js",
      "Azure App Service",
    ],
    role: "Full-Stack",
    category: "tools",
    featured: false,
    displayOrder: 3,
    demoUrl: "https://elon-ai-toolbox-mdxazqewk-omera.vercel.app",
    // Production URL: https://elonopenapps.azurewebsites.net/AItoolbox/toolbox.html
    status: "completed",
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
    displayOrder: 6,
    // TEMPORARILY DISABLED - Updating with original sources
    // demoUrl: "https://oteemo-ai-roadmap.vercel.app",
    // githubUrl: "https://github.com/omerakben/oteemo-ai-roadmap",
    status: "completed",
  },

  // TIER 3: Production-Ready with Minor Items
  {
    id: "7",
    slug: "tuel-chatbot",
    title: "Tuel AI Chatbot Builder",
    shortTitle: "Tuel AI Chatbot Builder",
    description:
      "Full-stack chatbot builder platform for TUEL AI powering 30 AI assistants across 27 teachers and 84 students. Multi-provider AI support (OpenAI, Gemini, OpenRouter), RAG implementation, and OAuth SSO.",
    longDescription:
      "Complete chatbot builder platform allowing instructors to create AI-powered assistants trained on custom content (files + URLs). Features include vector storage for RAG, real-time streaming chat, share tokens, analytics dashboard, BYOK encryption for OpenRouter, and comprehensive role-based access control. Currently powering 30 active AI assistants deployed by 27 teachers for 84 students—part of the TUEL AI ecosystem live at https://elon-ai.app. Public demo assistants available at https://tuel.ai/#demo.",
    image: "/tuel_chatbot_img/tuel_ai_landing_page.png",
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
    featured: true,
    displayOrder: 3,
    demoUrl: "https://tuel.ai/#demo",
    githubUrl: "https://github.com/omerakben/tuel-ai-chatbot",
    status: "completed",
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
    displayOrder: 7,
    // TEMPORARILY DISABLED - Updating with original sources
    // githubUrl: "https://github.com/omerakben/ai-tutor",
    status: "in-progress",
  },
  {
    id: "11",
    slug: "elongpt",
    title: "ElonGPT - University Information Assistant",
    shortTitle: "ElonGPT",
    description:
      "AI-powered campus information chatbot developed by Elon University's AI Hub. Provides real-time information about campus events, news, and university resources by synthesizing data from official Elon sources.",
    longDescription:
      "ElonGPT is an intelligent information retrieval system designed by Elon University's AI Hub to help students, faculty, and staff quickly find campus information, discover events, access news, and navigate university resources. The chatbot pulls information from the official Elon website and curated university sources to ensure accuracy and relevance. ElonGPT emphasizes query specificity for optimal results - users are encouraged to ask detailed questions like 'What events are happening today on campus? Today is [specific date]' rather than broad queries. Built with Next.js 15 and integrated with OpenAI's API, the system uses Supabase for data management and is deployed on Vercel for reliable, fast access. The chatbot serves as a 24/7 information companion for the Elon community, helping users stay informed about campus life, academic events, university news, and institutional resources.",
    image: "/elon_ai_img/elon_ai_hub.png",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "OpenAI API",
      "Supabase",
      "Tailwind CSS",
      "Vercel",
    ],
    role: "AI",
    category: "ai-ml",
    featured: false,
    displayOrder: 4,
    demoUrl: "https://www.elon.edu/u/ai/elongpt/",
    status: "completed",
  },
  {
    id: "12",
    slug: "lsb-ai-studio",
    title: "LSB Applied AI Studio - Business AI Education Platform",
    shortTitle: "LSB AI Studio",
    description:
      "Comprehensive AI education ecosystem from Elon's Love School of Business featuring four integrated learning applications: AI Tutor, Prompt Bank, LSB AI Toolbox, and Business Agents. Prepares business leaders for AI-native markets through hands-on learning.",
    longDescription:
      "The LSB Applied AI Studio is a dynamic educational ecosystem from Elon University's Love School of Business designed to develop workforce competencies in artificial intelligence. The studio fosters innovative problem-solving and ethical AI development, helping participants 'Understand, Apply, and Lead in the AI-native economy.' The platform features four interconnected learning applications: (1) AI Tutor - an interactive learning companion for mastering foundational AI concepts through dialogue-based instruction, (2) Prompt Bank - a curated collection of business-ready prompts demonstrating practical prompt engineering techniques, (3) LSB AI Toolbox - a hands-on platform enabling users to construct, validate, and implement AI solutions through structured workflows, and (4) Business Agents - an experiential program connecting students with community partner projects for real-world AI deployment. Built with modern web technologies and deployed on Azure, the studio addresses the critical need for strategic foresight and practical skills in navigating AI-driven business environments. The platform serves LSB students and professionals seeking to master AI tools and methodologies essential for contemporary business leadership.",
    image: "/elon_ai_img/elon_ai_studio.png",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Azure App Service",
      "Tailwind CSS",
      "AI Integration",
    ],
    role: "AI",
    category: "ai-ml",
    featured: true,
    displayOrder: 5,
    demoUrl: "https://lsb-ai.azurewebsites.net/main.html",
    status: "completed",
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
