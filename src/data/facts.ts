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
    title: "Full-Stack Developer • AI Engineer • SDET",
    location: "Raleigh, NC",
    timezone: "EST (UTC-5)",
    email: "me@omerakben.com",
    phone: "(267) 512-4566",
  },

  professional: {
    yearsOfExperience: 6,
    currentRole: "Full-Stack AI Engineer",
    currentCompany: "Freelance",
    summary:
      "Full-Stack AI Engineer with 6+ years spanning QA/SDET and product delivery. Builds LLM-powered web applications end-to-end with React/Next.js (TypeScript) frontends and Python (FastAPI/Django) backends, shipping Retrieval-Augmented Generation (RAG) and agentic features via LangChain/LangGraph and vector search (pgvector/FAISS/Pinecone). Delivers production-grade reliability through Playwright/Selenium automation, REST API testing, and Continuous Integration/Continuous Delivery (CI/CD) pipelines using GitHub Actions, Jenkins, Azure DevOps, and Docker. Cloud experience on AWS (Lambda, API Gateway, S3) and Azure (Entra ID, Azure DevOps). Domain expertise in fintech and healthcare with HIPAA/PHI compliance and HL7 data processing. Combines engineering rigor with SDET-grade quality practices, including Test-Driven Development (TDD), Behavior-Driven Development (BDD), and shift-left testing strategies.",
    specializations: [
      "AI Engineering & LLM Applications",
      "Full-Stack Development (React/Next.js + Python)",
      "QA Test Automation & SDET",
      "Retrieval-Augmented Generation (RAG)",
      "Test-Driven Development (TDD) & Behavior-Driven Development (BDD)",
      "CI/CD Architecture & DevOps",
    ],
    availability: "Available for new opportunities",
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
    languages: ["Python", "TypeScript", "JavaScript", "C#", "Java", "SQL"],

    // Frontend Development
    frontend: [
      "React",
      "Next.js",
      "TypeScript/JavaScript",
      "Tailwind CSS",
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
      "SQL Schema Design",
    ],

    // AI/Generative AI
    aiml: [
      "OpenAI API",
      "Anthropic Claude API",
      "Vertex AI",
      "Amazon Bedrock",
      "Azure AI services",
      "Elasticsearch",
      "LangChain",
      "LangGraph",
      "Retrieval-Augmented Generation (RAG)",
      "Prompt Engineering & Evaluation",
      "Vector Databases (pgvector, FAISS, Pinecone, Weaviate)",
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
      "AWS (Lambda, API Gateway, S3)",
      "Azure (Entra ID, Azure DevOps)",
      "Docker",
      "Kubernetes (environment parity)",
      "Git/GitHub",
      "CI/CD (GitHub Actions, Jenkins, Azure Pipelines)",
      "Observability (logging, metrics, tracing)",
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
      year: "2019 - 2020",
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
      title: "AI Full-Stack Software Engineer",
      company: "Freelance",
      location: "Remote (Raleigh, NC)",
      period: "January 2024 – Present",
      achievements: [
        "Built a multi-tenant AI chat platform for higher education using Next.js (TypeScript) and FastAPI, integrating OpenAI and Anthropic Claude APIs via LangChain and LangGraph orchestration frameworks with Retrieval-Augmented Generation (RAG) over pgvector. The platform reduced average support response time by 60% through intelligent query routing, conversation memory, and context-aware responses. Implemented role-based access control (RBAC) with Microsoft Entra ID, comprehensive audit logging, and content guardrails for sensitive information.",
        "Engineered end-to-end retrieval pipelines including document chunking strategies, metadata filtering, and hybrid search combining vector similarity with keyword matching. Developed an evaluation harness tracking answer accuracy, context recall, and hallucination rates. Iteratively improved top-K retrieval precision by 25% while maintaining P95 latency under 2 seconds through caching strategies and query optimization.",
        "Implemented comprehensive Playwright end-to-end and API test suites integrated into CI/CD pipelines (GitHub Actions and Azure DevOps) with parallel execution, automatic retries on transient failures, and visual regression testing. Achieved 95%+ stability on critical user flows, including authentication, chat interactions, and document uploads. Test coverage prevented multiple production regressions during rapid development cycles of features.",
        "Designed RESTful APIs (FastAPI and Node.js/Express) following OpenAPI 3.0 specifications with Pydantic validation, typed client generation, and structured error taxonomy. Implemented comprehensive logging with correlation IDs, distributed tracing, and performance metrics. Reached 90%+ unit and integration test coverage on critical paths, including authentication, authorization, and data processing endpoints.",
        "Delivered 15+ workflow automations using Zapier, n8n, and Make that integrated Google Workspace, CRM systems, and LLM-based data extraction. Reduced repetitive operational tasks by 60% through intelligent routing, automatic categorization, and status tracking. Built monitoring dashboards, implemented retry logic with exponential backoff, and created comprehensive audit trails for compliance requirements.",
        "Maintained personal portfolio (omerakben.com) built with Next.js and TypeScript, implementing performance budgets (Lighthouse scores consistently above 95), Playwright smoke and regression test suites in CI/CD, and analytics for user experience insights. Deployed on Vercel with automated preview environments for pull requests.",
      ],
      technologies: [
        "TypeScript",
        "Next.js",
        "React",
        "Node.js",
        "Python",
        "FastAPI",
        "Django",
        "OpenAI API",
        "Anthropic Claude API",
        "LangChain",
        "LangGraph",
        "Playwright",
        "Jest",
        "Docker",
        "GitHub Actions",
        "Azure DevOps",
        "PostgreSQL (pgvector)",
        "FAISS",
        "MongoDB",
        "Redis",
        "AWS (Lambda, API Gateway, S3)",
        "Azure (Entra ID)",
        "Zapier",
        "n8n",
        "Git",
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
        name: "Elon AI Chat Builder",
        description:
          "Enterprise AI chatbot platform for Elon University enabling faculty and staff to create custom AI assistants with knowledge base integration",
        technologies: ["Next.js", "OpenAI", "Supabase", "TypeScript", "Vercel"],
        status: "completed",
        year: "2024",
      },
      {
        name: "AI Toolbar — Chrome Extension",
        description:
          "Productivity Chrome extension with AI-powered tools for text summarization, translation, and content generation",
        technologies: ["Chrome API", "React", "OpenAI", "TypeScript"],
        status: "completed",
        year: "2024",
      },
      {
        name: "Genesis Test Copilot",
        description:
          "AI-powered test automation assistant that generates Playwright tests from natural language descriptions",
        technologies: ["Playwright", "LangChain", "FastAPI", "Python"],
        status: "completed",
        year: "2024",
      },
    ],
    total: 6,
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
    "Full-Stack AI Engineer with 6+ years spanning QA/SDET and product delivery. Builds LLM-powered web applications end-to-end with React/Next.js (TypeScript) frontends and Python (FastAPI/Django) backends, shipping Retrieval-Augmented Generation (RAG) and agentic features via LangChain/LangGraph and vector search (pgvector/FAISS/Pinecone). Delivers production-grade reliability through Playwright/Selenium automation, REST API testing, and Continuous Integration/Continuous Delivery (CI/CD) pipelines using GitHub Actions, Jenkins, Azure DevOps, and Docker. Cloud experience on AWS (Lambda, API Gateway, S3) and Azure (Entra ID, Azure DevOps). Domain expertise in fintech and healthcare with HIPAA/PHI compliance and HL7 data processing. Combines engineering rigor with SDET-grade quality practices, including Test-Driven Development (TDD), Behavior-Driven Development (BDD), and shift-left testing strategies.",
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
