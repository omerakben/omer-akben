export interface Skill {
  name: string;
  experience?: string; // "6+ years", "Since 2024", etc.
  context?: string; // "Production use", "8 projects", "Certified"
  projects?: string[]; // Actual portfolio project references
  metrics?: string; // "98% pass rate", "1,000+ users"
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    category: "Languages",
    skills: [
      {
        name: "Python",
        experience: "Since 2024",
        context: "FastAPI, Django, AI/ML pipelines",
        projects: ["Elon AI Studio", "Minor Use Foundation"],
      },
      {
        name: "TypeScript",
        experience: "Since 2024",
        context: "Next.js 15, React 19, Vercel AI SDK",
        projects: ["omerakben.com", "Elon AI Studio", "North Glass LLC"],
      },
      {
        name: "JavaScript",
        experience: "6+ years",
        context: "Node.js, React, full-stack apps",
        projects: ["omerakben.com", "tuel npm packages"],
      },
      {
        name: "C#",
        experience: "6+ years",
        context: ".NET, Playwright, Selenium WebDriver",
        metrics: "98% test pass rates at Oteemo",
      },
      {
        name: "Java",
        experience: "2+ years",
        context: "Selenium WebDriver, TestNG, REST Assured",
      },
      {
        name: "SQL",
        experience: "6+ years",
        context: "PostgreSQL, SQL Server, query optimization",
      },
      {
        name: "Bash",
        experience: "6+ years",
        context: "CI/CD scripting, automation",
      },
    ],
  },
  {
    category: "AI & LLM",
    skills: [
      {
        name: "LangChain",
        experience: "Since 2024",
        context: "Production RAG pipelines",
        metrics: "1,000+ users, 60% faster support",
      },
      {
        name: "LangGraph",
        experience: "Since 2024",
        context: "Multi-agent workflows, autonomous tool calling",
        projects: ["Elon AI Studio"],
      },
      {
        name: "OpenAI API",
        experience: "Since 2024",
        context: "GPT-4, embeddings, function calling",
        projects: ["omerakben.com", "Elon AI Studio"],
      },
      {
        name: "Anthropic Claude",
        experience: "Since 2024",
        context: "Claude 3.5 Sonnet, streaming responses",
        projects: ["omerakben.com"],
      },
      {
        name: "Vertex AI",
        experience: "Since 2024",
        context: "Google Cloud AI services",
      },
      {
        name: "Azure AI",
        experience: "Since 2024",
        context: "Microsoft Foundry, Entra ID integration",
        projects: ["Elon AI Studio"],
      },
      {
        name: "Amazon Bedrock",
        experience: "Since 2024",
        context: "AWS managed AI services",
      },
      {
        name: "RAG (Retrieval-Augmented Generation)",
        experience: "Since 2024",
        context: "Hybrid search, pgvector + Redis",
        metrics: "25% precision improvement, P95 < 2s",
      },
      {
        name: "RAGAS",
        experience: "Since 2024",
        context: "RAG evaluation framework",
      },
      {
        name: "LangSmith",
        experience: "Since 2024",
        context: "LLM tracing and observability",
        metrics: "15% cost reduction",
      },
      {
        name: "Arize Phoenix",
        experience: "Since 2024",
        context: "LLM observability platform",
      },
      {
        name: "Vector Databases",
        experience: "Since 2024",
        context: "pgvector, FAISS, Pinecone, Weaviate, Upstash Vector",
        projects: ["omerakben.com", "Elon AI Studio"],
      },
      {
        name: "Multi-Agent Systems",
        experience: "Since 2024",
        context: "CrewAI, Mastra",
        projects: ["omerakben.com"],
      },
      {
        name: "Prompt Engineering",
        experience: "Since 2024",
        context: "Structured outputs, few-shot learning",
      },
      {
        name: "Golden Datasets",
        experience: "Since 2024",
        context: "AI evaluation and testing",
      },
    ],
  },
  {
    category: "Backend & APIs",
    skills: [
      {
        name: "FastAPI",
        experience: "Since 2024",
        context: "Production Python APIs, Pydantic validation",
        projects: ["Elon AI Studio"],
      },
      {
        name: "Django",
        experience: "Since 2024",
        context: "Python web framework, ORM",
      },
      {
        name: "Node.js / Express",
        experience: "6+ years",
        context: "REST APIs, middleware",
      },
      {
        name: "REST",
        experience: "6+ years",
        context: "RESTful API design, OpenAPI/Swagger",
      },
      {
        name: "GraphQL",
        experience: "Since 2023",
        context: "Type-safe APIs",
      },
      {
        name: "Pydantic",
        experience: "Since 2024",
        context: "Python data validation",
      },
      {
        name: "OAuth2 / JWT",
        experience: "6+ years",
        context: "Authentication, authorization",
      },
      {
        name: "ORMs",
        experience: "Since 2024",
        context: "Prisma, TypeORM, Django ORM",
      },
      {
        name: "API Versioning",
        experience: "6+ years",
        context: "Backward compatibility strategies",
      },
    ],
  },
  {
    category: "Frontend",
    skills: [
      {
        name: "React",
        experience: "Since 2024",
        context: "React 19, Server Components",
        projects: ["omerakben.com", "Elon AI Studio", "North Glass LLC"],
      },
      {
        name: "Next.js",
        experience: "Since 2024",
        context: "Next.js 15, App Router, Turbopack",
        projects: ["omerakben.com", "Elon AI Studio"],
      },
      {
        name: "Vercel AI SDK",
        experience: "Since 2024",
        context: "Streaming UIs, tool calling",
        projects: ["omerakben.com", "Elon AI Studio"],
      },
      {
        name: "Tailwind CSS",
        experience: "Since 2024",
        context: "Tailwind 4, CSS custom properties",
        projects: ["omerakben.com"],
      },
      {
        name: "SSR / ISR",
        experience: "Since 2024",
        context: "Server-Side Rendering, Incremental Static Regeneration",
      },
      {
        name: "Accessibility (a11y)",
        experience: "Since 2024",
        context: "WCAG 2A compliance",
        metrics: "8/8 routes compliant",
      },
      {
        name: "Performance Optimization",
        experience: "Since 2024",
        context: "Lighthouse CI, bundle analysis",
        metrics: "95+ performance scores",
      },
    ],
  },
  {
    category: "Data & Infrastructure",
    skills: [
      {
        name: "PostgreSQL",
        experience: "6+ years",
        context: "Schema design, pgvector for AI",
      },
      {
        name: "SQL Server",
        experience: "6+ years",
        context: "Enterprise database, SSIS/SSRS",
      },
      {
        name: "MongoDB",
        experience: "2+ years",
        context: "NoSQL, document databases",
      },
      {
        name: "Redis",
        experience: "Since 2024",
        context: "Semantic caching, rate limiting, Upstash",
        projects: ["omerakben.com", "Elon AI Studio"],
      },
      {
        name: "Elasticsearch",
        experience: "Since 2023",
        context: "Full-text search",
      },
      {
        name: "Schema Design",
        experience: "6+ years",
        context: "Normalization, migrations",
      },
      {
        name: "Query Tuning",
        experience: "6+ years",
        context: "Performance optimization",
        metrics: "10% execution time reduction",
      },
    ],
  },
  {
    category: "Cloud, DevOps & LLMOps",
    skills: [
      {
        name: "AWS",
        experience: "3+ years",
        context: "Lambda, ECS, S3, API Gateway, EC2",
        metrics: "AWS Cloud Practitioner Certified (2022)",
      },
      {
        name: "Azure",
        experience: "Since 2023",
        context: "Entra ID, Azure DevOps, Container Apps",
        projects: ["Elon AI Studio"],
      },
      {
        name: "Docker",
        experience: "6+ years",
        context: "Containerization, multi-stage builds",
        metrics: "Hours to setup (from days)",
      },
      {
        name: "Kubernetes",
        experience: "Since 2023",
        context: "Container orchestration",
      },
      {
        name: "GitHub Actions",
        experience: "Since 2024",
        context: "CI/CD automation, quality gates",
        projects: ["omerakben.com"],
      },
      {
        name: "Jenkins",
        experience: "6+ years",
        context: "Selenium Grid autoscaling, parallelization",
        metrics: "40% faster PR feedback",
      },
      {
        name: "Terraform",
        experience: "Since 2023",
        context: "Infrastructure as Code",
      },
      {
        name: "Observability",
        experience: "Since 2024",
        context: "Sentry, PostHog, LangSmith tracing",
      },
    ],
  },
  {
    category: "QA & Test Engineering",
    skills: [
      {
        name: "Playwright",
        experience: "Since 2024",
        context: "E2E/API testing, Docker infrastructure",
        metrics: "98% pass rates, 95%+ stability",
      },
      {
        name: "Selenium WebDriver",
        experience: "6+ years",
        context: "Java, C#, Python frameworks",
      },
      {
        name: "Cypress",
        experience: "Since 2023",
        context: "E2E testing",
      },
      {
        name: "REST Assured",
        experience: "6+ years",
        context: "API contract testing",
        metrics: "Prevented 3 high-severity outages",
      },
      {
        name: "Postman / Newman",
        experience: "6+ years",
        context: "API testing, CI integration",
      },
      {
        name: "Cucumber / SpecFlow (BDD)",
        experience: "6+ years",
        context: "Behavior-Driven Development, Gherkin",
        metrics: "40% to 85% automated coverage",
      },
      {
        name: "JUnit / TestNG / xUnit / MSTest",
        experience: "6+ years",
        context: "Unit testing frameworks",
      },
      {
        name: "JMeter",
        experience: "3+ years",
        context: "Performance testing",
      },
      {
        name: "Appium",
        experience: "2+ years",
        context: "Mobile test automation",
      },
      {
        name: "Test Strategy",
        experience: "6+ years",
        context: "TDD, BDD, shift-left practices",
      },
      {
        name: "Vitest",
        experience: "Since 2024",
        context: "Unit testing for Vite projects",
        metrics: "776/776 tests passing",
      },
    ],
  },
];
