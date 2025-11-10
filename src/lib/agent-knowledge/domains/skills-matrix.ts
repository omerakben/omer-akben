/**
 * Skills Matrix - Comprehensive Technical Expertise
 *
 * Complete skills catalog organized by domain (frontend, backend, AI/ML, QA, DevOps).
 * Used by Skills Agent and when skill questions are detected.
 *
 * Token budget: ~3,000 tokens
 */

export const skillsMatrix = `
<section name="skills-matrix">
<purpose>Provide comprehensive technical skills and expertise matrix</purpose>
<domain>skills</domain>

# COMPREHENSIVE SKILLS MATRIX

## Programming Languages
- **Primary:** TypeScript, Python, JavaScript
- **Additional:** SQL, C#, Java

## Frontend Development
- **Frameworks:** React, Next.js (App Router 15), TypeScript/JavaScript
- **Styling:** Tailwind CSS 4, Server-Side Rendering (SSR), Incremental Static Regeneration (ISR)
- **Best Practices:** Accessibility (a11y), Performance Optimization, Responsive Design

## Backend & APIs
- **Python:** FastAPI, Django, Pydantic, SQLAlchemy
- **Node.js:** Express, RESTful APIs, GraphQL
- **Authentication:** OAuth2, JWT, NextAuth.js v5
- **Documentation:** OpenAPI/Swagger, API design patterns
- **Databases:** Object-Relational Mapping (ORM), SQL Schema Design

## AI/Generative AI Engineering
- **LLM Providers:** OpenAI API (GPT-4o, GPT-4o-mini), Anthropic Claude API, Vertex AI, Amazon Bedrock, Azure AI services
- **Frameworks:** LangChain, LangGraph (agentic workflows), Elasticsearch
- **RAG Systems:** Retrieval-Augmented Generation implementation
- **Vector Databases:** pgvector, FAISS, Pinecone, Weaviate
- **Advanced:** Prompt Engineering & Evaluation, Content Guardrails, Function/Tool Calling
- **Multi-Agent:** Parallel agent processing with asyncio

## Data & Databases
- **SQL:** PostgreSQL (with pgvector), SQL Server, MySQL
- **NoSQL:** MongoDB, Redis (caching)
- **Skills:** Schema Design, Data Migrations, Data Validation, SQL Queries & Optimization

## Cloud & DevOps
- **AWS:** Lambda, API Gateway, S3, Elastic Beanstalk
- **Azure:** Entra ID, Azure DevOps, Container Apps
- **Containers:** Docker, Kubernetes (environment parity)
- **CI/CD:** GitHub Actions, Jenkins, Azure Pipelines
- **Monitoring:** Observability (logging, metrics, tracing), Vercel Analytics

## QA & Test Automation (SDET)
- **End-to-End:** Playwright (primary), Selenium WebDriver, Cypress
- **API Testing:** REST Assured, Postman, Newman (CLI automation)
- **Unit Testing:** JUnit, TestNG, xUnit, MSTest, Vitest
- **BDD Frameworks:** Cucumber, SpecFlow (Gherkin syntax)
- **Performance:** JMeter (load testing)
- **Mobile:** Appium (cross-platform)
- **Test Strategy:** Test-Driven Development (TDD), Behavior-Driven Development (BDD), Shift-Left Quality

## Development Tools & Practices
- **Version Control:** Git, GitHub (workflows, actions)
- **IDEs:** VS Code (primary), IntelliJ
- **Collaboration:** Code Reviews, Technical Documentation, Agile/Scrum, Mentoring
- **Architecture:** System Design, Microservices, Monorepo management (Turborepo, pnpm workspaces)

# SKILL DEPTH BY CATEGORY

## Expert Level (5+ years, production experience)
- **Quality Assurance:** Playwright, Selenium WebDriver, test framework architecture
- **Backend Development:** Python (FastAPI, Django), PostgreSQL, RESTful APIs
- **Frontend Development:** React, Next.js, TypeScript, Tailwind CSS
- **CI/CD:** GitHub Actions, Azure Pipelines, deployment automation
- **Test Strategy:** TDD, BDD, shift-left quality practices

## Advanced Level (3-5 years, multiple projects)
- **AI/ML Engineering:** LangChain, LangGraph, OpenAI API, RAG systems
- **Cloud Platforms:** AWS (Lambda, S3, API Gateway), Azure DevOps
- **Databases:** PostgreSQL, SQL Server, Redis, vector databases (pgvector)
- **Authentication:** OAuth2, JWT, Firebase Auth, Azure Entra ID
- **API Testing:** REST Assured, Postman, API automation frameworks

## Proficient Level (1-3 years, active learning)
- **Advanced AI:** Multi-agent systems, parallel processing with asyncio
- **3D/Animation:** Three.js, Framer Motion, GSAP
- **Containerization:** Docker, Kubernetes basics
- **Monorepo Tools:** Turborepo, pnpm workspaces, Changesets
- **Performance:** Bundle optimization, code splitting, lazy loading

# SAMPLE SKILLS QUESTIONS & RESPONSES

**"What's your strongest technical skill?"**
"My strongest skill is **Quality Assurance & Test Automation** with 6+ years of SDET experience:

- **Playwright/Selenium expertise:** Built production frameworks for financial services and healthcare
- **Framework architecture:** Designed reusable test libraries with TypeScript/Python
- **CI/CD integration:** GitHub Actions, Jenkins, Azure Pipelines
- **Test strategy:** TDD, BDD, shift-left quality practices

My SDET foundation means I build testable architectures from day one, enabling teams to ship faster with fewer regressions. Check out [/projects/capstone-deadline](/projects/capstone-deadline) to see 64/64 backend tests and Playwright visual testing in action."

**"Do you have AI/ML experience?"**
"Yes! I have extensive **AI/ML engineering experience** with production deployments:

**LLM & Frameworks:**
- OpenAI API (GPT-4o, GPT-4o-mini), Anthropic Claude API
- LangChain, LangGraph (agentic workflows)
- RAG systems with vector search (pgvector)

**Projects Demonstrating AI Expertise:**
- **Elon AI Agent** - Parallel multi-agent system (3-4x speedup)
- **Tuel AI Chatbot** - Full-stack RAG platform with multi-provider support
- **Genesis Test Copilot** - AI-powered test automation

I build end-to-end AI features with Next.js/TypeScript frontend and FastAPI/Python backend. Visit [/projects](/projects) and filter by AI/ML to see detailed case studies. Which AI capability interests you most?"

**"What frontend frameworks do you know?"**
"I specialize in **modern React/Next.js** development with production experience:

**Core Stack:**
- React 19, Next.js 15 (App Router), TypeScript
- Tailwind CSS 4, shadcn/ui component library
- Server-Side Rendering (SSR), Incremental Static Regeneration (ISR)

**Projects Showcasing Frontend:**
- **DEADLINE** - Next.js 15 with A- (92/100) UI/UX grade
- **Tuel Animation Library** - React animation library with 13 NPM packages
- **This Portfolio** - Next.js 15 with 8 brightness modes, AI chatbot

I focus on accessibility (WCAG compliance), performance optimization, and mobile-responsive design. Visit [/skills](/skills) to see the interactive tech showcase with live examples."

**"Are you full-stack or specialized?"**
"I'm **T-shaped: full-stack with deep SDET specialization**.

**Breadth (Full-Stack):**
- Frontend: React, Next.js 15, TypeScript, Tailwind CSS
- Backend: FastAPI, Django, PostgreSQL, Redis
- AI/ML: LangChain, LangGraph, OpenAI API, RAG systems
- DevOps: GitHub Actions, Docker, AWS, Railway, Vercel

**Depth (Quality Engineering):**
- 6+ years SDET experience with Playwright, Selenium, test frameworks
- Built production QA systems for financial services and healthcare
- Test strategy: TDD, BDD, CI/CD integration, shift-left quality

**In Practice:**
I design and ship features end-to-end (product thinking), and my SDET roots ensure I build testable architectures from day one. Teams ship faster with fewer regressions. Check out [/projects/capstone-deadline](/projects/capstone-deadline) for a full-stack example with 64/64 tests passing."

**"What testing tools do you use?"**
"I have 6+ years of **QA/SDET experience** with comprehensive testing tools:

**End-to-End Testing:**
- **Playwright** (primary) - Modern TypeScript/Python frameworks
- **Selenium WebDriver** - Built .NET 8 production framework (TUEL)
- **Cypress** - Component and integration testing

**API Testing:**
- REST Assured - Java-based API automation
- Postman + Newman - CLI automation pipelines
- Playwright API testing - Modern approach

**Unit Testing:**
- Vitest (JavaScript/TypeScript), pytest (Python)
- JUnit, TestNG, xUnit, MSTest (.NET)

**BDD Frameworks:**
- Cucumber (Java), SpecFlow (C#) with Gherkin syntax

**Projects Demonstrating Testing:**
- **DEADLINE** - 64/64 backend tests passing (pytest)
- **TUEL Selenium Framework** - Production .NET 8 framework
- **Genesis Test Copilot** - AI-powered test generation

Visit [/projects](/projects) to see testing implementations. Need details on any specific tool or methodology?"

</section>
`.trim();
