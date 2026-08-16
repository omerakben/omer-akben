/**
 * Agent Grounding Data
 *
 * This file contains facts and information about Omer Akben
 * that AI agents can use to answer questions accurately.
 */

export const facts = {
  personal: {
    fullName: "Omer Akben",
    nickname: "Ozzy",
    title: "AI Full-Stack Engineer • EdTech Founder • SDET",
    location: "Raleigh, NC",
    timezone: "EST (UTC-5)",
    email: "me@omerakben.com",
    phone: "(267) 512-4566",
  },

  professional: {
    yearsOfExperience: "6+",
    currentRole: "Founder & AI Full-Stack Engineer",
    currentCompany: "TUEL AI",
    summary:
      "AI Full-Stack Software Engineer and EdTech Founder with 6+ years of SDET/QA automation experience. Creator of TUEL AI, a B2B educational technology platform deployed at Elon University with production metrics demonstrating real user impact. Specializes in building production-grade Retrieval-Augmented Generation (RAG) and agentic workflows using LangGraph, LangChain, and modern LLM APIs (OpenAI, Claude, Vertex AI). Combines strong Python (FastAPI) and TypeScript/React (Next.js, Vercel AI SDK) skills with deep testing and CI/CD expertise to ship reliable, capability-building AI applications. Focused on human-AI interaction that develops genuine user skill rather than engagement metrics. Known for system-level thinking: observability, automated evaluations (RAGAS, DeepEval), and shift-left quality baked into full-stack delivery.",
    specializations: [
      "EdTech Platform Founder & AI Product Delivery",
      "Retrieval-Augmented Generation (RAG) & Agentic Workflows",
      "Full-Stack Development (Next.js/React + FastAPI)",
      "LLMOps, Observability & Automated Evaluation",
      "QA Test Automation & SDET",
      "CI/CD Architecture & DevOps",
    ],
    availability: "Open to scoped consulting and TUEL walkthroughs",
    workPreferences: {
      remote: true,
      location: "Raleigh, NC or Remote",
      roles: [
        "AI Engineer / LLM Engineer",
        "Full-Stack Developer",
        "QA Automation Architect / SDET",
        "Test Automation Architect",
      ],
    },
    workAuthorization: {
      status: "U.S. Permanent Resident (Green Card)",
      officialTitle: "Lawful Permanent Resident (LPR)",
      sponsorshipRequired: false,
      employmentRestrictions: "None",
      eligibleEmployers: "Any U.S. employer (government, private, nonprofit)",
      proofDocument: "Permanent Resident Card (Form I-551)",
      summary:
        "Authorized to work in the United States for any employer without sponsorship",
    },
  },

  skills: {
    // Programming Languages
    languages: [
      "Python",
      "TypeScript",
      "JavaScript",
      "C#",
      "Java",
      "SQL",
      "Bash",
    ],

    // Frontend Development
    frontend: [
      "React",
      "Next.js",
      "TypeScript/JavaScript",
      "Tailwind CSS",
      "Streaming UIs (SSE)",
      "Server-Side Rendering (SSR)",
      "Incremental Static Regeneration (ISR)",
      "Accessibility (a11y)",
      "Performance Optimization",
    ],

    // Backend & APIs
    backend: [
      "Python (FastAPI, Django)",
      "Node.js/Express",
      "RESTful APIs",
      "GraphQL",
      "OAuth2/JWT",
      "Pydantic",
      "OpenAPI/Swagger",
      "Object-Relational Mapping (ORM)",
      "API Versioning",
      "SQL Schema Design",
    ],

    // AI/Generative AI
    aiml: [
      "OpenAI API",
      "Anthropic Claude API",
      "Vertex AI",
      "Amazon Bedrock",
      "Azure AI / Microsoft Foundry",
      "LangChain",
      "LangGraph",
      "Retrieval-Augmented Generation (RAG)",
      "RAGAS",
      "DeepEval",
      "LangSmith",
      "Arize Phoenix",
      "Vector Databases (pgvector, FAISS, Pinecone, Weaviate)",
      "Multi-Agent Systems (CrewAI, Mastra)",
      "Prompt Engineering & Evaluation",
      "Golden Datasets",
      "Content Guardrails",
      "Function/Tool Calling",
    ],

    // Data & Databases
    data: [
      "PostgreSQL",
      "SQL Server",
      "MongoDB",
      "Redis",
      "Schema Design",
      "Data Migrations",
      "Data Validation",
      "SQL Queries & Optimization",
    ],

    // Cloud & DevOps
    cloud: [
      "AWS (Lambda, ECS, S3, API Gateway)",
      "Azure (Entra ID, Azure DevOps)",
      "Docker",
      "Kubernetes (environment parity)",
      "Git/GitHub",
      "CI/CD (GitHub Actions, Jenkins, Azure Pipelines)",
      "Observability (logging, metrics, tracing)",
      "Terraform",
    ],

    // QA & Test Automation (SDET)
    qa: [
      "Playwright (End-to-End/API)",
      "Selenium WebDriver",
      "Java",
      "JUnit",
      "TestNG",
      "REST Assured",
      "Postman",
      "Newman",
      "Cucumber/SpecFlow/BDD",
      "JMeter (performance testing)",
      "Cypress (exposure)",
      "Appium (mobile testing)",
      "Test Strategy & Planning",
    ],

    // Engineering Practices
    practices: [
      "System Design",
      "Test-Driven Development (TDD)",
      "Behavior-Driven Development (BDD)",
      "Shift-Left Quality",
      "Code Reviews",
      "Technical Documentation",
      "Mentoring",
      "Agile/Scrum",
    ],

    // Development Tools
    tools: [
      "Git/GitHub",
      "VS Code",
      "IntelliJ",
      "Postman",
      "Newman",
      "Docker",
      "Kubernetes",
    ],
  },

  education: [
    {
      degree: "Full Stack Web Developer Bootcamp",
      institution: "Nashville Software School",
      year: "2024 - 2025",
      specialization: "Full-Stack Development",
      description:
        "Intensive full-stack development program covering modern web technologies and software engineering practices. Key coursework included React/Next.js ecosystem, Python/FastAPI and Django frameworks, TypeScript development, Test-Driven Development (TDD), CI/CD pipelines, and foundational labs with PyTorch and TensorFlow for understanding LLM integration workflows.",
    },
    {
      degree: "Software Development Engineer in Test (SDET)",
      institution: "TechCenture Academy",
      year: "2018 - 2019",
      specialization: "QA Automation",
      description:
        "Comprehensive SDET training program focusing on test automation frameworks and quality engineering practices. Covered Java and C# programming, Selenium WebDriver, Cucumber, and SpecFlow for Behavior-Driven Development (BDD), Test-Driven Development (TDD) methodologies, and CI/CD integration with Jenkins and Azure DevOps.",
    },
    {
      degree: "Master of Science in Healthcare Management",
      institution: "Istanbul Okan University",
      year: "2014 - 2016",
      specialization: "Healthcare Management",
      description:
        "Graduate studies in healthcare administration, policy, and management with emphasis on healthcare information systems, regulatory compliance (HIPAA), and quality improvement methodologies in clinical settings.",
    },
  ],

  certifications: [
    {
      name: "NSS Cloud Deployment Certificate",
      issuer: "Nashville Software School",
      year: "2025",
    },
    {
      name: "Introduction to Cloud Computing",
      issuer: "IBM via Coursera",
      year: "2024",
    },
    {
      name: "AWS Cloud Practitioner Essentials",
      issuer: "Amazon Web Services",
      year: "2022",
    },
    {
      name: "Nashville Software School Graduate",
      issuer: "Nashville Software School",
      year: "2025",
    },
  ],

  experience: [
    {
      title: "Founder & AI Full-Stack Engineer",
      company: "TUEL AI",
      location: "Remote (Raleigh, NC)",
      period: "Jan 2024 – Present",
      achievements: [
        "Selected for Elon University Business Faculty Pilot Program after 6 months production use. Built AI education platform with 16+ interactive learning tools (flashcards, quizzes, concept maps, Hume AI voice chat) and a 7-layer prompt system with source citations. Production metrics: 622 all-time sessions, 202 total users, 72.2M all-time tokens, 2% error rate, 96% satisfaction (73/76), and 60% support response time reduction.",
        "Built FERPA-compliant multi-tenant architecture with row-level isolation, Microsoft Entra ID RBAC, faculty dashboard for AI behavior control, and 35+ audit action types. Implemented production RAG pipeline (pgvector + keyword hybrid search, Upstash Redis semantic caching, RAGAS validation) improving retrieval precision by 25% while keeping P95 latency under 2 seconds.",
        "Orchestrated multi-agent workflows in LangGraph and Vercel AI SDK for autonomous tool calling and student services flows with content guardrails and conversation memory. Automated regulatory document workflows for Minor Use Foundation using LLM-based PDF extraction, reducing manual data entry by 60% with full audit trails.",
        "Integrated Playwright E2E tests into GitHub Actions and LangSmith tracing, achieving 95%+ stability on critical chat/auth flows and cutting query costs by 15%.",
      ],
      technologies: [
        "TypeScript",
        "Next.js 15",
        "React 19",
        "Node.js",
        "Python",
        "FastAPI",
        "Vercel AI SDK",
        "OpenAI API",
        "Anthropic Claude API",
        "Vertex AI",
        "Azure AI / Microsoft Foundry",
        "Amazon Bedrock",
        "LangChain",
        "LangGraph",
        "RAGAS",
        "LangSmith",
        "PostgreSQL (pgvector)",
        "Upstash Redis",
        "Drizzle ORM",
        "Neon Postgres",
        "QStash",
        "Hume AI",
        "Playwright",
        "GitHub Actions",
        "Microsoft Entra ID",
        "Docker",
      ],
    },
    {
      title: "Test Automation Architect (SDET)",
      company: "Oteemo",
      location: "Remote",
      period: "February 2025 – September 2025",
      achievements: [
        "Served as the sole SDET for a Fortune 500 financial services client, transforming an empty Azure DevOps repository with only a README into a production-grade, assetized test automation framework. This greenfield initiative established testing standards and accelerated quality practices across multiple development teams.",
        "Architected and implemented a comprehensive Playwright framework with C#/.NET including multi-environment configuration with secure credential management, a Dockerized local test runner for consistent execution across developer machines, and a reusable starter repository template. The framework reduced new project setup time from days to hours and standardized testing practices across teams.",
        "Engineered framework components, including Page Object Model with Page Factory pattern, reusable data factories for test data generation, fluent API client wrappers using RestSharp for backend service testing, and custom utilities for common testing scenarios. Implemented stability-first waiting strategies and intelligent retry patterns that achieved 98% pass rates on mature test suites, eliminating false failures and building team confidence in automation results.",
        "Integrated comprehensive CI/CD pipelines in Jenkins with parallel test execution across multiple agents, automatic flaky test detection and quarantine mechanisms, detailed HTML reporting with screenshots and videos for failures, and integration with Azure DevOps work items. Reduced feedback time for pull requests by 40% through optimized test selection and parallel execution strategies.",
        "Led adoption initiatives, including creating comprehensive documentation, writing runbooks for common scenarios, conducting hands-on training sessions, and providing ongoing mentoring to 6+ engineers across multiple teams. Teams successfully adopted utility classes, established code review practices, and integrated automation into their development workflows, demonstrating measurable shift-left quality improvements.",
      ],
      technologies: [
        "C#",
        ".NET",
        "Playwright",
        "MSTest",
        "RestSharp",
        "Jenkins",
        "Azure DevOps",
        "Docker",
        "SQL Server",
        "Git",
        "NuGet",
        "Selenium WebDriver",
      ],
    },
    {
      title: "QA Engineer",
      company: "Engineering Consulting Services (ECS)",
      location: "Raleigh, NC (Hybrid)",
      period: "April 2023 – January 2024",
      achievements: [
        "Refactored core test utilities and helper functions to improve code reusability and maintainability, increasing overall team velocity by 20%. Introduced design patterns, including the Builder pattern for test data creation and the Strategy pattern for configurable test behaviors, reducing code duplication by 35%.",
        "Converted manual API validation workflows into automated Postman collections with JavaScript-based assertions and comprehensive test coverage. Integrated Newman into Azure DevOps CI pipelines for automated execution on every build. This transformation decreased the manual testing backlog by 10% and improved the repeatability of regression testing cycles.",
        "Modernized legacy Selenium test suites by migrating from Page Objects to Page Factory pattern with more resilient locator strategies. Implemented explicit waits, custom wait conditions, and error recovery mechanisms that improved UI automation stability from 65% to a 95% pass rate. Reduced maintenance effort by 30% through better abstraction and reduced coupling to UI implementation details.",
      ],
      technologies: [
        "C#",
        "MSTest",
        "Selenium WebDriver",
        "RestSharp",
        "Postman",
        "Newman",
        "Azure DevOps",
        "Microsoft Dynamics 365",
        "SQL Server",
        "Git",
      ],
    },
    {
      title: "SDET / QA Test Automation Engineer",
      company: "Xsolis",
      location: "Remote",
      period: "October 2022 – April 2023",
      achievements: [
        "Automated complex healthcare data workflows including HL7 message processing, Protected Health Information (PHI) Extract-Transform-Load (ETL) pipelines, and clinical documentation validation. Built comprehensive test coverage for UI workflows and backend API services using Selenium WebDriver and SpecFlow with Behavior-Driven Development (BDD) approach using Gherkin syntax.",
        "Increased automated test coverage from 40% to 85% across critical healthcare compliance workflows, including patient admission, clinical documentation, and insurance authorization processes. This expansion reduced manual testing effort by 30% and provided faster feedback on regulatory compliance requirements.",
        "Collaborated with external vendor (EPAM) to align testing frameworks, establish shared coding standards, implement consistent code review practices, and create reusable component libraries. Contributed xUnit test coverage, shared Postman collections to accelerate cross-team service regression and API contract validation.",
        "Implemented comprehensive database validation using SQL queries across 50+ tables to ensure data integrity, referential constraints, and business rule enforcement throughout the ETL pipeline. Created automated data reconciliation reports comparing source systems with processed results.",
      ],
      technologies: [
        "C#",
        ".NET",
        "Selenium WebDriver",
        "SpecFlow (BDD)",
        "xUnit",
        "SQL Server",
        "Azure",
        "Postman",
        "Jira",
        "Confluence",
        "qTest",
        "Git",
      ],
    },
    {
      title: "SDET / QA Automation Engineer",
      company: "Fannie Mae",
      location: "Remote",
      period: "March 2021 – September 2022",
      achievements: [
        "Developed a comprehensive Java-based test automation framework using Selenium WebDriver, TestNG, and REST Assured, covering UI workflows, API endpoints, and database validations. Achieved 20% automated coverage on key mortgage processing module, including loan origination, underwriting workflows, and servicing operations, improving release velocity by 10%.",
        "Architected and deployed Jenkins CI/CD pipelines with Selenium Grid infrastructure supporting 50+ concurrent browser sessions across multiple operating systems and browser versions. Implemented parallel test execution, dynamic test distribution, and comprehensive reporting. Reduced regression test execution time by 15% through optimized test selection and parallel execution strategies.",
        "Built an automated API contract testing suite using REST Assured to validate service contracts across a microservices architecture, preventing breaking changes and ensuring backward compatibility. Integrated contract tests into the CI pipeline with automatic failure notifications to service owners.",
        "Created a comprehensive test data management framework, including database seeding, test data cleanup, and isolated test environments to ensure test independence and repeatability across multiple test runs.",
      ],
      technologies: [
        "Java",
        "Selenium WebDriver",
        "TestNG",
        "REST Assured",
        "Jenkins",
        "Selenium Grid",
        "Maven",
        "Git",
        "SQL",
        "REST APIs",
      ],
    },
  ],

  projects: {
    featured: [
      {
        name: "Elon AI (TUEL AI Platform)",
        description:
          "Live deployment of TUEL AI at Elon University with multi-tenant RAG and agentic workflows",
        technologies: [
          "Next.js 15",
          "FastAPI",
          "Vercel AI SDK",
          "LangChain",
          "LangGraph",
        ],
        status: "completed",
        year: "2024",
      },
      {
        name: "Tuel Animation Library",
        description:
          "Open-source React animation framework with 13 published NPM packages",
        technologies: ["React", "TypeScript", "Turborepo", "Storybook"],
        status: "in-progress",
        year: "2024",
      },
      {
        name: "North Glass LLC",
        description:
          "Production Next.js site with AI integration serving real customers",
        technologies: ["Next.js", "TypeScript", "Vercel"],
        status: "completed",
        year: "2024",
      },
    ],
    total: 13,
  },

  social: {
    linkedin: "https://linkedin.com/in/omerakben",
    github: "https://github.com/omerakben",
    twitter: "https://x.com/mrfrkkbn",
    portfolio: "https://omerakben.com",
  },

  interests: [
    "Artificial Intelligence & Machine Learning",
    "Agentic AI Systems & LLM Applications",
    "Full-Stack Development",
    "Test Automation & Quality Engineering",
    "Open Source Contribution",
    "Technical Writing & Documentation",
    "Mentoring & Teaching",
  ],

  about:
    "AI Full-Stack Software Engineer and EdTech Founder with 6+ years of SDET/QA automation experience. Creator of TUEL AI, a B2B educational technology platform deployed at Elon University with production metrics demonstrating real user impact. Specializes in building production-grade Retrieval-Augmented Generation (RAG) and agentic workflows using LangGraph, LangChain, and modern LLM APIs (OpenAI, Claude, Vertex AI). Combines strong Python (FastAPI) and TypeScript/React (Next.js, Vercel AI SDK) skills with deep testing and CI/CD expertise to ship reliable, capability-building AI applications. Focused on human-AI interaction that develops genuine user skill rather than engagement metrics. Known for system-level thinking: observability, automated evaluations (RAGAS, DeepEval), and shift-left quality baked into full-stack delivery.",
};

// Helper functions for agents
export const getContactInfo = () => ({
  email: facts.personal.email,
  phone: facts.personal.phone,
  location: facts.personal.location,
  linkedin: facts.social.linkedin,
  github: facts.social.github,
  twitter: facts.social.twitter,
});

export const getSkillsByCategory = (category: keyof typeof facts.skills) =>
  facts.skills[category];

export const getAllSkills = () => facts.skills;

export const getFeaturedProjects = () => facts.projects.featured;

export const getEducation = () => facts.education;

export const getCertifications = () => facts.certifications;

export const getWorkExperience = () => facts.experience;

export const getCurrentRole = () => facts.experience[0]; // Most recent position

export const getSocialLinks = () => facts.social;

export const getProfessionalSummary = () => facts.professional.summary;
