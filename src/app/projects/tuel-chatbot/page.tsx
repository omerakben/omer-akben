import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import {
  ArrowLeft,
  Bot,
  Brain,
  CheckCircle2,
  Cloud,
  FileText,
  Github,
  Layers,
  Lock,
  MessageSquare,
  Search,
  Server,
  Share2,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "Tuel AI Chatbot Builder",
  description:
    "Enterprise-grade AI chatbot platform for educational institutions. Multi-provider support (OpenAI, Gemini, OpenRouter), RAG with Azure AI Search, OAuth authentication, BYOK encryption. Full-stack Next.js 15 + FastAPI with comprehensive Azure PaaS architecture ready for production deployment.",
  path: "/projects/tuel-chatbot",
});

export default function TuelChatbotCaseStudyPage() {
  const project = getProjectBySlug("tuel-chatbot");

  if (!project) {
    notFound();
  }

  const useCases = [
    {
      icon: Users,
      title: "University Course Assistants",
      description:
        "Professors upload syllabi and lecture notes. Students ask questions 24/7 with RAG-powered context-aware answers. Share tokens enable collaborative access for study groups.",
    },
    {
      icon: Brain,
      title: "Research Lab Support",
      description:
        "Lab teams ingest research papers via file upload or URL scraping. Members query methodology and findings. Vector search provides semantic understanding across documents.",
    },
    {
      icon: FileText,
      title: "Department FAQ Automation",
      description:
        "Admissions offices upload student handbooks and policy documents. Automated responses to common questions reduce staff workload. Analytics track popular topics for content improvement.",
    },
    {
      icon: CheckCircle2,
      title: "Student Onboarding",
      description:
        "New student orientation materials ingested into chatbot. Campus policy Q&A available 24/7. Multi-provider AI ensures response quality and availability.",
    },
    {
      icon: Search,
      title: "Library Reference Desk",
      description:
        "Library resources and catalogs ingested for semantic search. Citation assistance and research guidance automation. Reduce reference desk volume during peak periods.",
    },
    {
      icon: MessageSquare,
      title: "IT Help Desk Triage",
      description:
        "Common technical issues database powers self-service troubleshooting. Reduce ticket volume through AI-powered first-line support. Share tokens for department-specific knowledge bases.",
    },
  ];

  const technicalHighlights = [
    "FastAPI 0.115 + Next.js 15 App Router in monorepo architecture",
    "Multi-provider AI: OpenAI (GPT-4o, GPT-3.5-turbo), Google Gemini, OpenRouter with BYOK encryption",
    "RAG implementation with Azure AI Search (Basic tier) for vector storage and semantic search",
    "Real-time streaming responses via Server-Sent Events (SSE) with token-by-token rendering",
    "OAuth authentication (NextAuth.js v5 + Azure AD) with role-based access control (Admin/Instructor/Student)",
    "Share token system for public chatbot access with analytics and rate limiting",
    "BYOK encryption (Fernet) for user API keys stored in Azure Key Vault",
    "PostgreSQL 15 Flexible Server with SQLAlchemy ORM + Alembic migrations (8 major migrations)",
    "Azure Container Apps with auto-scaling (0→10 replicas) and managed identities",
    "File uploads (10MB limit) + URL scraping via Firecrawl integration",
    "Redis distributed cache (C0 tier) for rate limiting and session management",
    "Application Insights with OpenTelemetry instrumentation for observability",
    "100% Azure PaaS services: Static Web Apps, Container Apps, PostgreSQL, Redis, AI Search, Blob Storage, Key Vault",
    "Docker Compose for local development + GitHub Actions CI/CD pipelines",
    "Pre-commit hooks (ruff + black for Python, lint-staged for TypeScript)",
  ];

  const whyValuable = [
    {
      title: "Educational AI Democratization",
      description:
        "Lowers barriers for instructors to create custom AI assistants without engineering expertise. Multi-provider support ensures flexibility and vendor independence. RAG enables context-aware responses from course materials.",
    },
    {
      title: "Enterprise-Grade Security",
      description:
        "Managed identities eliminate hardcoded secrets. BYOK encryption protects user API keys. Workspace isolation ensures multi-tenant security. OAuth authentication with Azure AD integration provides enterprise SSO compatibility.",
    },
    {
      title: "Azure Cloud Architecture Expertise",
      description:
        "Comprehensive 851-line architecture document showcasing Azure PaaS mastery. Cost-transparent infrastructure ($222-497/month). 282 lines of Bicep IaC with 9 modular deployments. Production-ready security model with Key Vault and managed identities.",
    },
    {
      title: "Full-Stack Excellence",
      description:
        "Modern Next.js 15 App Router with React 19 Server Components. FastAPI backend with async/await patterns. PostgreSQL with Alembic migrations. Real-time streaming with SSE. TypeScript strict mode across frontend.",
    },
    {
      title: "Production Readiness Transparency",
      description:
        "Honest assessment: staging-ready MVP with 8-12 week production timeline. Detailed TODO.md tracking 31 issues (9 critical). Test coverage roadmap from 20% to 70% target. Demonstrates professional planning rigor and security awareness.",
    },
  ];

  return (
    <main className="min-h-screen bg-surf-0 py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Back button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-text-2 hover:text-text-1 mb-8 transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              AI
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              In Development
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Full-Stack
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-4">
            {project.title}
          </h1>

          <p className="text-xl text-text-2 mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <Button asChild size="lg">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github aria-hidden="true" className="w-4 h-4" />
                  View Source
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com/omerakben/tuel-ai-chatbot/blob/main/AZURE_ARCHITECTURE.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText aria-hidden="true" className="w-4 h-4" />
                Architecture Docs
              </a>
            </Button>
          </div>
        </div>

        {/* The Challenge */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Challenge</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            Educational institutions face significant barriers in deploying
            custom AI assistants for their unique needs. Instructors lack
            engineering expertise to build chatbots, while commercial solutions
            are expensive, inflexible, and vendor-locked. Integrating
            document-specific knowledge (syllabi, research papers, handbooks)
            requires complex RAG (Retrieval Augmented Generation)
            implementation, which is beyond most institutions&apos; technical
            capabilities.
          </p>
          <p className="text-text-2 leading-relaxed">
            Security and compliance requirements for educational data demand
            enterprise-grade authentication, workspace isolation, and audit
            logging. Cost transparency is critical for budget-constrained
            institutions. The challenge was to create a{" "}
            <strong className="text-text-1">production-ready platform</strong>{" "}
            that democratizes AI chatbot creation while maintaining security,
            scalability, and cost efficiency through comprehensive Azure cloud
            architecture.
          </p>
        </div>

        {/* The Solution */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Solution</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            I developed{" "}
            <strong className="text-text-1">Tuel AI Chatbot Builder</strong>, a
            full-stack platform enabling instructors to create custom AI
            assistants without coding. Built with{" "}
            <strong className="text-text-1">FastAPI 0.115 + Next.js 15</strong>{" "}
            in a monorepo architecture, the platform supports{" "}
            <strong className="text-text-1">multi-provider AI</strong> (OpenAI,
            Google Gemini, OpenRouter) with Bring-Your-Own-Key (BYOK) encryption
            for vendor independence.
          </p>
          <p className="text-text-2 leading-relaxed">
            The platform implements <strong className="text-text-1">RAG</strong>{" "}
            via Azure AI Search for vector storage, enabling semantic search
            across uploaded files (PDF, TXT, DOCX) and scraped URLs (via
            Firecrawl). Real-time streaming responses use Server-Sent Events
            (SSE), while OAuth authentication (NextAuth.js v5 + Azure AD)
            provides enterprise SSO compatibility. A comprehensive{" "}
            <strong className="text-text-1">Azure PaaS architecture</strong>{" "}
            (851 lines of documentation, 282 lines of Bicep IaC) showcases
            production-grade planning with cost transparency ($222-497/month)
            and zero-server management approach.
          </p>
        </div>

        {/* Landing Page Screenshot */}
        <figure className="mb-8">
          <Image
            src="/tuel_chatbot_img/tuel_ai_landing_page.png"
            alt="Tuel AI Chatbot Builder landing page showing platform overview with multi-provider AI support, RAG implementation, and Azure architecture highlights"
            width={3840}
            height={2160}
            className="rounded-[20px] border border-border-line w-full h-auto"
            priority={true}
            quality={90}
          />
          <figcaption className="text-text-3 text-sm mt-3 text-center">
            Landing Page: Platform overview showcasing multi-provider AI, RAG
            capabilities, and Azure cloud architecture
          </figcaption>
        </figure>

        {/* Project Status & Timeline */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Project Status & Development Timeline
          </h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <div className="font-semibold text-text-1">
                  Phase 1: Core Platform (Completed)
                </div>
                <div className="text-text-2 text-sm">
                  Monorepo structure, FastAPI backend, Next.js frontend, Docker
                  Compose local development
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <div className="font-semibold text-text-1">
                  Phase 2: Multi-Provider AI (Completed)
                </div>
                <div className="text-text-2 text-sm">
                  OpenAI, Google Gemini, OpenRouter integration with BYOK
                  encryption (Fernet)
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <div className="font-semibold text-text-1">
                  Phase 3: RAG Integration (Completed)
                </div>
                <div className="text-text-2 text-sm">
                  Azure AI Search vector store, file uploads (10MB limit), URL
                  scraping, semantic search
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              </div>
              <div>
                <div className="font-semibold text-text-1">
                  Phase 4: Azure Migration (In Progress)
                </div>
                <div className="text-text-2 text-sm">
                  Container Apps deployment, PostgreSQL migration, Key Vault
                  integration, Application Insights setup
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-text-3 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-text-1">
                  Phase 5: Production Hardening (Planned - 8-12 weeks)
                </div>
                <div className="text-text-2 text-sm">
                  Security fixes (9 critical items), test coverage 20% → 70%,
                  circuit breaker patterns, background job queue
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex gap-3">
              <Target
                aria-hidden="true"
                className="w-5 h-5 text-yellow-400 flex-shrink-0"
              />
              <div>
                <div className="font-semibold text-text-1 mb-2">
                  Current Status: MVP Ready for Staging
                </div>
                <div className="text-text-2 text-sm space-y-1">
                  <div>
                    <strong>Staging-Ready:</strong> Features complete,
                    infrastructure deployed, end-to-end functionality working
                  </div>
                  <div>
                    <strong>Production Timeline:</strong> 8-12 weeks for
                    security hardening and quality gates
                  </div>
                  <div>
                    <strong>Test Coverage:</strong> 20% current → 70% target
                    (unit + integration + E2E)
                  </div>
                  <div>
                    <strong>Target Launch:</strong> Q1 2026 with full production
                    readiness
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Demo Screenshot */}
        <figure className="mb-8">
          <Image
            src="/tuel_chatbot_img/demo_chat_page.png"
            alt="Tuel AI Chatbot conversation interface showing real-time streaming responses, file upload capabilities, and multi-turn dialogue with RAG-powered context"
            width={3840}
            height={2160}
            className="rounded-[20px] border border-border-line w-full h-auto"
            priority={false}
            quality={90}
            loading="lazy"
          />
          <figcaption className="text-text-3 text-sm mt-3 text-center">
            Chat Interface: Real-time streaming responses with RAG-powered
            context from uploaded documents
          </figcaption>
        </figure>

        {/* Architecture Diagram */}
        <div className="mb-8">
          <div className="bg-surf-1 border border-border-line rounded-[20px] overflow-hidden">
            <div className="p-4 border-b border-border-line">
              <h3 className="text-lg font-bold text-text-1">
                Azure Cloud Architecture
              </h3>
            </div>
            <div className="p-8">
              <div className="bg-surf-0 border border-border-line rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-text-2 font-mono whitespace-pre">
                  {`
┌──────────────────────────────────────────────────────────────────┐
│                    INTERNET / USERS (tuel.ai)                    │
└────────────────────┬─────────────────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   GoDaddy DNS Records   │
        │  CNAME: www → Static WA │
        │  A: @ → Static WA       │
        └────────────┬────────────┘
                     │
┌────────────────────▼─────────────────────────────────────────────┐
│         FRONTEND TIER (Next.js 15 + React 19)                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Azure Static Web Apps (Standard)                        │    │
│  │  • Next.js App Router with SSR + SSG                     │    │
│  │  • Global CDN (Microsoft edge network)                   │    │
│  │  • Free SSL certificate (auto-renewal)                   │    │
│  │  • NextAuth.js v5 (Azure AD OAuth)                       │    │
│  │  • Real-time streaming UI (SSE)                          │    │
│  └──────────────────┬───────────────────────────────────────┘    │
└─────────────────────┼────────────────────────────────────────────┘
                      │ HTTPS API calls (/api/v1/*)
                      │
┌─────────────────────▼────────────────────────────────────────────┐
│         BACKEND TIER (FastAPI 0.115 + Python 3.11)               │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Azure Container Apps (Consumption Plan)                 │    │
│  │  • Auto-scaling (0→10 replicas)                          │    │
│  │  • Custom domain: api.tuel.ai                            │    │
│  │  • Managed certificates (SSL)                            │    │
│  │  • Managed Identity for passwordless access              │    │
│  │  • Health probes: /health                                │    │
│  │  • Secrets from Key Vault                                │    │
│  └──────────┬─────────────────────┬─────────────────────────┘    │
└─────────────┼─────────────────────┼──────────────────────────────┘
              │                     │
    ┌─────────▼──────────┐  ┌───────▼──────────┐
    │  Azure Key Vault   │  │ Container        │
    │  • SECRET_KEY      │  │ Registry (ACR)   │
    │  • ENCRYPTION_KEY  │  │ • Backend image  │
    │  • DB credentials  │  │ • Auto-build     │
    │  • AI API keys     │  └──────────────────┘
    └────────┬───────────┘
             │
┌────────────▼──────────────────────────────────────────────────────┐
│                        DATA & AI TIER                             │
│  ┌──────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │ PostgreSQL 15    │  │ Redis Cache     │  │ Blob Storage    │   │
│  │ Flexible Server  │  │ (C0 tier)       │  │ (Hot tier)      │   │
│  │ • B1ms burstable │  │ • 250MB cache   │  │ • User uploads  │   │
│  │ • 20GB storage   │  │ • Rate limiting │  │ • Chatbot files │   │
│  │ • SQLAlchemy ORM │  │ • Session mgmt  │  │ • 10MB max      │   │
│  │ • 8 migrations   │  └─────────────────┘  └─────────────────┘   │
│  └──────────────────┘                                             │
│                                                                   │
│  ┌──────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │ Azure OpenAI     │  │ Azure AI Search │  │ Application     │   │
│  │ Service          │  │ (Basic tier)    │  │ Insights        │   │
│  │ • GPT-4o         │  │ • Vector store  │  │ • OpenTelemetry │   │
│  │ • GPT-3.5-turbo  │  │ • Semantic      │  │ • 30-day logs   │   │
│  │ • Embeddings     │  │   search (RAG)  │  │ • Distributed   │   │
│  │ • text-ada-002   │  │ • 15GB storage  │  │   tracing       │   │
│  └──────────────────┘  └─────────────────┘  └─────────────────┘   │
└───────────────────────────────────────────────────────────────────┘

                      Alternative AI Providers

┌───────────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │ Google Gemini    │  │ OpenRouter      │  │ Firecrawl       │   │
│  │ (via API)        │  │ (BYOK)          │  │ (URL scraping)  │   │
│  └──────────────────┘  └─────────────────┘  └─────────────────┘   │
└───────────────────────────────────────────────────────────────────┘

                    Security & Compliance

┌───────────────────────────────────────────────────────────────────┐
│  • Managed Identities (Azure Entra ID) - Zero hardcoded secrets   │
│  • BYOK Encryption (Fernet) - User API keys encrypted at rest     │
│  • Workspace Isolation (owner_uid scoping) - Multi-tenant secure  │
│  • Rate Limiting (Redis) - Prevent abuse (10MB uploads, API)      │
│  • OAuth 2.0 (NextAuth.js v5 + Azure AD) - Enterprise SSO         │
│  • Immutable Audit Logs - Compliance tracking (future)            │
└───────────────────────────────────────────────────────────────────┘`}
                </pre>
              </div>
              <div className="mt-4 text-sm text-text-3 space-y-2">
                <p>
                  <strong className="text-text-2">Data Flow:</strong> User
                  authenticates via Azure AD → Frontend sends API requests →
                  Container Apps backend validates via NextAuth → Applies
                  workspace isolation → Queries PostgreSQL/Redis/AI Search →
                  Streams response via SSE
                </p>
                <p>
                  <strong className="text-text-2">Security:</strong> All secrets
                  in Key Vault, managed identities eliminate hardcoded
                  credentials, BYOK encryption for user API keys, workspace
                  isolation prevents data leakage
                </p>
                <p>
                  <strong className="text-text-2">Cost:</strong> $222-497/month
                  (scales with usage), 100% PaaS services, zero server
                  management, consumption-based pricing for Container Apps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">Key Features</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Bot aria-hidden="true" className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Multi-Provider AI Support
                </h3>
                <p className="text-text-2">
                  Integrated with{" "}
                  <strong>OpenAI (GPT-4o, GPT-3.5-turbo)</strong>,{" "}
                  <strong>Google Gemini</strong>, and{" "}
                  <strong>OpenRouter</strong> for vendor independence. Dynamic
                  provider switching based on cost, performance, and
                  availability. BYOK (Bring-Your-Own-Key) encryption via Fernet
                  protects user API keys stored in Azure Key Vault. Real-time
                  streaming responses using Server-Sent Events (SSE).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Brain
                    aria-hidden="true"
                    className="w-5 h-5 text-purple-400"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  RAG (Retrieval Augmented Generation)
                </h3>
                <p className="text-text-2">
                  File uploads (PDF, TXT, DOCX) with 10MB limit per file. URL
                  scraping via Firecrawl integration for web content ingestion.
                  Vector embeddings using{" "}
                  <strong>text-embedding-ada-002</strong> stored in{" "}
                  <strong>Azure AI Search (Basic tier)</strong>. Semantic search
                  across documents for context-aware responses.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Shield
                    aria-hidden="true"
                    className="w-5 h-5 text-green-400"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  OAuth Authentication & Security
                </h3>
                <p className="text-text-2">
                  <strong>NextAuth.js v5</strong> integration with{" "}
                  <strong>Azure AD OAuth</strong> for enterprise SSO
                  compatibility. Role-based access control
                  (Admin/Instructor/Student). Session management with thread IDs
                  for conversation persistence. Workspace isolation via
                  owner_uid scoping ensures multi-tenant security.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Share2
                    aria-hidden="true"
                    className="w-5 h-5 text-orange-400"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Share Token System
                </h3>
                <p className="text-text-2">
                  Public chatbot access via unique share tokens. Analytics
                  tracking for usage metrics and popular queries. Rate limiting
                  per token prevents abuse. Customizable expiration for
                  time-limited access. Ideal for course-specific assistants
                  shared with students.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Sparkles
                    aria-hidden="true"
                    className="w-5 h-5 text-blue-400"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Real-Time Streaming Responses
                </h3>
                <p className="text-text-2">
                  Server-Sent Events (SSE) for token-by-token response
                  rendering. Progress indicators during AI generation.
                  Conversation threading with thread IDs. Multi-turn dialogue
                  support with context preservation. Responsive UI across
                  mobile, tablet, and desktop.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Lock
                    aria-hidden="true"
                    className="w-5 h-5 text-yellow-400"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  BYOK Encryption & Key Vault
                </h3>
                <p className="text-text-2">
                  Fernet encryption for user API keys stored at rest. Azure Key
                  Vault integration for secrets management (SECRET_KEY,
                  ENCRYPTION_KEY, database credentials). Managed identities
                  eliminate hardcoded secrets. Immutable audit logging for
                  compliance (planned feature).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Technical Implementation
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-1 mb-3 flex items-center gap-2">
                <Server aria-hidden="true" className="w-5 h-5" />
                Backend Architecture
              </h3>
              <div className="pl-7 space-y-2 text-text-2">
                <p>
                  <strong>FastAPI 0.115</strong> with async/await patterns for
                  high-performance API endpoints.{" "}
                  <strong>SQLAlchemy ORM</strong> +{" "}
                  <strong>Alembic migrations</strong> (8 major migrations
                  tracking schema evolution). PostgreSQL 15 Flexible Server
                  (production) / SQLite (local dev). Redis distributed cache (C0
                  tier, 250MB) for rate limiting and session management.
                  OpenTelemetry instrumentation for Application Insights
                  observability.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-1 mb-3 flex items-center gap-2">
                <Layers aria-hidden="true" className="w-5 h-5" />
                Frontend Stack
              </h3>
              <div className="pl-7 space-y-2 text-text-2">
                <p>
                  <strong>Next.js 15 App Router</strong> with{" "}
                  <strong>React 19 Server Components</strong> for optimal
                  performance. NextAuth.js v5 authentication with Azure AD OAuth
                  integration. TypeScript with strict mode for type safety.
                  Real-time streaming UI using Server-Sent Events (SSE).
                  Responsive design system with mobile-first approach.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-1 mb-3 flex items-center gap-2">
                <Cloud aria-hidden="true" className="w-5 h-5" />
                Azure Infrastructure (100% PaaS)
              </h3>
              <div className="pl-7 space-y-2 text-text-2">
                <p>
                  <strong>Container Apps</strong> with auto-scaling (0→10
                  replicas, consumption-based pricing).{" "}
                  <strong>Static Web Apps</strong> (Standard tier) for Next.js
                  with global CDN. <strong>PostgreSQL Flexible Server</strong>{" "}
                  (B1ms burstable, 20GB storage). <strong>Redis Cache</strong>{" "}
                  (C0 tier) for distributed caching.{" "}
                  <strong>Azure AI Search</strong> (Basic tier, 15GB) for vector
                  storage. <strong>Blob Storage</strong> (Hot tier) for file
                  uploads. <strong>Key Vault</strong> for secrets management.{" "}
                  <strong>Application Insights</strong> for monitoring and
                  telemetry.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-1 mb-3 flex items-center gap-2">
                <Shield aria-hidden="true" className="w-5 h-5" />
                Security Model
              </h3>
              <div className="pl-7 space-y-2 text-text-2">
                <p>
                  <strong>Managed identities</strong> (Azure Entra ID) for
                  passwordless access to Azure resources. BYOK encryption
                  (Fernet) for user API keys stored in database. Workspace
                  isolation via owner_uid scoping prevents multi-tenant data
                  leakage. Rate limiting (10MB uploads, request throttling via
                  Redis). OAuth 2.0 authentication with Azure AD for enterprise
                  SSO. CORS configuration restricts cross-origin access.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Azure Infrastructure Breakdown */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Azure Infrastructure Cost Breakdown
          </h2>
          <p className="text-text-2 mb-6">
            Cost-transparent architecture with 100% Azure PaaS services. No
            server management, auto-scaling, and consumption-based pricing.
            Estimated monthly cost: <strong>$222-497</strong> (scales with
            usage).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-line">
                  <th className="text-left text-text-1 font-semibold py-3 px-2">
                    Service
                  </th>
                  <th className="text-left text-text-1 font-semibold py-3 px-2">
                    Tier
                  </th>
                  <th className="text-left text-text-1 font-semibold py-3 px-2">
                    Purpose
                  </th>
                  <th className="text-right text-text-1 font-semibold py-3 px-2">
                    Monthly Cost
                  </th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">Static Web Apps</td>
                  <td className="py-3 px-2">Standard</td>
                  <td className="py-3 px-2">Next.js hosting + CDN</td>
                  <td className="py-3 px-2 text-right">$9</td>
                </tr>
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">Container Apps</td>
                  <td className="py-3 px-2">Consumption</td>
                  <td className="py-3 px-2">FastAPI auto-scale (0→10)</td>
                  <td className="py-3 px-2 text-right">$50-150</td>
                </tr>
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">PostgreSQL Flexible Server</td>
                  <td className="py-3 px-2">B1ms</td>
                  <td className="py-3 px-2">Primary database</td>
                  <td className="py-3 px-2 text-right">$12-25</td>
                </tr>
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">Azure OpenAI Service</td>
                  <td className="py-3 px-2">Pay-per-use</td>
                  <td className="py-3 px-2">GPT-4o, embeddings</td>
                  <td className="py-3 px-2 text-right">$50-200</td>
                </tr>
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">Azure AI Search</td>
                  <td className="py-3 px-2">Basic</td>
                  <td className="py-3 px-2">Vector store (RAG)</td>
                  <td className="py-3 px-2 text-right">$75</td>
                </tr>
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">Redis Cache</td>
                  <td className="py-3 px-2">C0 (250MB)</td>
                  <td className="py-3 px-2">Rate limiting, sessions</td>
                  <td className="py-3 px-2 text-right">$16</td>
                </tr>
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">Blob Storage</td>
                  <td className="py-3 px-2">Hot</td>
                  <td className="py-3 px-2">File uploads</td>
                  <td className="py-3 px-2 text-right">$5-10</td>
                </tr>
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">Key Vault</td>
                  <td className="py-3 px-2">Standard</td>
                  <td className="py-3 px-2">Secrets management</td>
                  <td className="py-3 px-2 text-right">$0.03</td>
                </tr>
                <tr className="border-b border-border-line">
                  <td className="py-3 px-2">Application Insights</td>
                  <td className="py-3 px-2">Free tier</td>
                  <td className="py-3 px-2">Telemetry, monitoring</td>
                  <td className="py-3 px-2 text-right">$0-5</td>
                </tr>
                <tr>
                  <td className="py-3 px-2">Container Registry</td>
                  <td className="py-3 px-2">Basic</td>
                  <td className="py-3 px-2">Docker images</td>
                  <td className="py-3 px-2 text-right">$5</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border-line">
                  <td
                    colSpan={3}
                    className="py-3 px-2 text-right font-semibold text-text-1"
                  >
                    Total Estimated Monthly Cost:
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-brand-primary">
                    $222-497
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-4 text-sm text-text-3">
            <p>
              Infrastructure as Code: <strong>851 lines</strong> of Azure
              architecture documentation + <strong>282 lines</strong> of Bicep
              IaC with 9 modular deployments
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-surf-1 border border-border-line rounded-[20px] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target
                aria-hidden="true"
                className="w-6 h-6 text-brand-primary"
              />
              <h2 className="text-2xl font-bold text-text-1">Mission</h2>
            </div>
            <p className="text-text-2 leading-relaxed">
              Democratize AI chatbot creation for educational institutions
              through a secure, scalable, multi-provider platform that requires
              zero coding expertise while maintaining enterprise-grade quality.
            </p>
          </div>

          <div className="bg-surf-1 border border-border-line rounded-[20px] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles
                aria-hidden="true"
                className="w-6 h-6 text-brand-primary"
              />
              <h2 className="text-2xl font-bold text-text-1">Vision</h2>
            </div>
            <p className="text-text-2 leading-relaxed">
              Become the industry standard for educational AI assistants with
              comprehensive RAG, BYOK support, Azure-native architecture, and
              transparent cost modeling that scales from individual instructors
              to entire university systems.
            </p>
          </div>
        </div>

        {/* Production Readiness Assessment */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Production Readiness Assessment
          </h2>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-green-400"
              />
              <h3 className="text-lg font-semibold text-text-1">
                Current Status: Staging-Ready MVP
              </h3>
            </div>
            <p className="text-text-2 mb-4">
              The platform is feature-complete and infrastructure-deployed for
              staging environments. Comprehensive Azure architecture planning
              demonstrates production-grade expertise.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-text-1 mb-2">
                ✅ Strengths (Production-Grade Components)
              </h4>
              <ul className="space-y-1 text-text-2 text-sm pl-5">
                <li>
                  Feature-complete core functionality (multi-provider AI, RAG,
                  OAuth, share tokens)
                </li>
                <li>
                  Comprehensive 851-line Azure architecture document with cost
                  analysis
                </li>
                <li>
                  282 lines of Bicep Infrastructure as Code (IaC) with 9 modular
                  deployments
                </li>
                <li>
                  Multi-provider AI working end-to-end (OpenAI, Gemini,
                  OpenRouter)
                </li>
                <li>RAG implementation with Azure AI Search vector storage</li>
                <li>
                  OAuth authentication functional (NextAuth.js v5 + Azure AD)
                </li>
                <li>
                  Docker Compose + GitHub Actions CI/CD pipelines configured
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-1 mb-2">
                🔄 Remaining Work for Production (8-12 weeks)
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-red-400 mb-1">
                    Critical Security Issues (9 Priority 1 items)
                  </div>
                  <ul className="space-y-1 text-text-2 text-sm pl-5">
                    <li>Enforce strong SECRET_KEY validation (no defaults)</li>
                    <li>Remove default admin password &quot;changeme&quot;</li>
                    <li>Add ENCRYPTION_KEY production validation</li>
                    <li>Implement request body size limits (10MB)</li>
                    <li>
                      Add SSRF protection for URL ingestion (block internal IPs)
                    </li>
                    <li>
                      Restrict CORS to specific origins (currently too
                      permissive)
                    </li>
                    <li>Enforce PostgreSQL in production (no SQLite)</li>
                    <li>Add per-user file upload quotas</li>
                    <li>Strengthen AUTH secret generation</li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-yellow-400 mb-1">
                    Performance & Scale (7 Priority 2 items)
                  </div>
                  <ul className="space-y-1 text-text-2 text-sm pl-5">
                    <li>Migrate to distributed Redis cache (from in-memory)</li>
                    <li>Add message history pagination</li>
                    <li>Implement circuit breaker for AI providers</li>
                    <li>Set up background job queue (Celery recommended)</li>
                    <li>Enhance health check to verify dependencies</li>
                    <li>Move share tokens to headers (not URL params)</li>
                    <li>Add connection pooling optimization</li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-1">
                    Testing & Quality (Coverage Gap)
                  </div>
                  <ul className="space-y-1 text-text-2 text-sm pl-5">
                    <li>Current test coverage: ~20% (Target: 70%+)</li>
                    <li>Need comprehensive unit tests for services layer</li>
                    <li>Integration tests for AI provider interactions</li>
                    <li>E2E tests for critical user flows</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex gap-3">
                <Zap
                  aria-hidden="true"
                  className="w-5 h-5 text-blue-400 flex-shrink-0"
                />
                <div className="text-sm text-text-2">
                  <strong className="text-text-1">
                    Estimated Production Timeline:
                  </strong>{" "}
                  8-12 weeks of focused work to address all 31 identified
                  issues. This timeline demonstrates{" "}
                  <strong>professional planning rigor</strong> and{" "}
                  <strong>security-first mindset</strong> rather than rushing to
                  production prematurely.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Real-World Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                      <Icon
                        aria-hidden="true"
                        className="w-5 h-5 text-brand-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-1 mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-text-2 text-sm">{useCase.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Technical Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {technicalHighlights.map((highlight, index) => (
              <div key={index} className="flex gap-2 items-start">
                <CheckCircle2
                  aria-hidden="true"
                  className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5"
                />
                <span className="text-text-2 text-sm">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Matters */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Why This Project Matters
          </h2>
          <div className="space-y-4">
            {whyValuable.map((item, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-text-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Resources */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Documentation & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 bg-surf-0 border border-border-line rounded-lg hover:border-brand-primary/50 transition-colors"
            >
              <Github
                aria-hidden="true"
                className="w-6 h-6 text-brand-primary flex-shrink-0"
              />
              <div>
                <div className="font-semibold text-text-1 mb-1">
                  GitHub Repository
                </div>
                <div className="text-text-2 text-sm">
                  Monorepo with frontend + backend, Docker Compose, CI/CD
                  pipelines
                </div>
              </div>
            </a>

            <a
              href="https://github.com/omerakben/tuel-ai-chatbot/blob/main/AZURE_ARCHITECTURE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 bg-surf-0 border border-border-line rounded-lg hover:border-brand-primary/50 transition-colors"
            >
              <Cloud
                aria-hidden="true"
                className="w-6 h-6 text-brand-primary flex-shrink-0"
              />
              <div>
                <div className="font-semibold text-text-1 mb-1">
                  Azure Architecture (851 lines)
                </div>
                <div className="text-text-2 text-sm">
                  Complete blueprint: services, cost, security, deployment
                  strategy
                </div>
              </div>
            </a>

            <a
              href="https://github.com/omerakben/tuel-ai-chatbot/blob/main/AZURE_DELIVERY_SUMMARY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 bg-surf-0 border border-border-line rounded-lg hover:border-brand-primary/50 transition-colors"
            >
              <FileText
                aria-hidden="true"
                className="w-6 h-6 text-brand-primary flex-shrink-0"
              />
              <div>
                <div className="font-semibold text-text-1 mb-1">
                  Delivery Summary (423 lines)
                </div>
                <div className="text-text-2 text-sm">
                  Deliverables overview: Bicep IaC, GitHub Actions, monitoring
                  setup
                </div>
              </div>
            </a>

            <a
              href="https://github.com/omerakben/tuel-ai-chatbot/blob/main/TODO.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 bg-surf-0 border border-border-line rounded-lg hover:border-brand-primary/50 transition-colors"
            >
              <CheckCircle2
                aria-hidden="true"
                className="w-6 h-6 text-brand-primary flex-shrink-0"
              />
              <div>
                <div className="font-semibold text-text-1 mb-1">
                  Production Roadmap (559 lines)
                </div>
                <div className="text-text-2 text-sm">
                  Detailed tracking: 31 issues, security fixes, test coverage
                  targets
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Results & Impact */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Results & Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                2,360+
              </div>
              <div className="text-text-2 text-sm">
                Lines of Infrastructure Docs + IaC
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                8
              </div>
              <div className="text-text-2 text-sm">
                Database Migrations (Alembic)
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                3
              </div>
              <div className="text-text-2 text-sm">AI Providers Integrated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                100%
              </div>
              <div className="text-text-2 text-sm">Azure PaaS Services</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                $222-497
              </div>
              <div className="text-text-2 text-sm">
                Transparent Monthly Cost
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                0→10
              </div>
              <div className="text-text-2 text-sm">Auto-Scale Replicas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                31
              </div>
              <div className="text-text-2 text-sm">
                Issues Tracked for Production
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                Q1 2026
              </div>
              <div className="text-text-2 text-sm">
                Target Production Launch
              </div>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js 15",
              "React 19",
              "TypeScript",
              "FastAPI 0.115",
              "Python 3.11",
              "SQLAlchemy",
              "Alembic",
              "PostgreSQL 15",
              "Redis",
              "NextAuth.js v5",
              "Azure AD OAuth",
              "Azure Container Apps",
              "Azure Static Web Apps",
              "Azure AI Search",
              "Azure OpenAI Service",
              "Azure Key Vault",
              "Azure Blob Storage",
              "Application Insights",
              "OpenTelemetry",
              "Docker",
              "GitHub Actions",
              "Bicep IaC",
              "OpenAI GPT-4o",
              "Google Gemini",
              "OpenRouter",
              "Firecrawl",
              "Fernet Encryption",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-sm bg-surf-0 border border-border-line text-text-2"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Back to Projects */}
        <div className="text-center pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-text-2 hover:text-text-1 transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4" />
            Back to All Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
