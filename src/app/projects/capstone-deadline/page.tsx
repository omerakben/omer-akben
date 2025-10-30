import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Github,
  Layers,
  Search,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "DEADLINE - Developer Command Center | Omer Akben",
  description:
    "Production full-stack capstone project: Secure workspace management for environment variables, prompts, and documentation. Django + Next.js + Firebase + PostgreSQL. Live on Railway & Vercel. A- (92/100) UI/UX grade.",
  path: "/projects/capstone-deadline",
});

export default function DeadlineCaseStudyPage() {
  const project = getProjectBySlug("capstone-deadline");

  if (!project) {
    notFound();
  }

  const useCases = [
    {
      icon: Users,
      title: "Development Teams",
      description:
        "Centralize microservices ENV variables. Junior devs find staging credentials instantly instead of pinging seniors. Onboard new team members with pre-configured workspace templates.",
    },
    {
      icon: Zap,
      title: "AI/ML Engineers",
      description:
        "Store prompt templates (system prompts, few-shot examples) with version history. Tag by model (GPT-4, Claude) or use case (summarization, classification).",
    },
    {
      icon: CheckCircle2,
      title: "Engineering Onboarding",
      description:
        "New hires clone workspace template with all docs, ENV vars, and code snippets pre-loaded. First-day productivity—no more 'where do I find the API key?' questions.",
    },
    {
      icon: FileText,
      title: "Documentation Hub",
      description:
        "Replace scattered Confluence/Notion pages with tagged DOC_LINKs. API docs, runbooks, architectural diagrams—all searchable in one place.",
    },
    {
      icon: Shield,
      title: "Audit Compliance",
      description:
        "Track every ENV_VAR reveal for HIPAA, SOC 2, GDPR compliance. Immutable logs show who accessed what secret, when, and from where.",
    },
    {
      icon: Search,
      title: "Remote Teams",
      description:
        "Async-first knowledge sharing—no more 'can someone DM me the API key?' in Slack. Workspace permissions for multi-tenant access control.",
    },
  ];

  const technicalHighlights = [
    "Django 5 REST API + Next.js 15 App Router (monorepo structure)",
    "Firebase Admin SDK token verification with workspace isolation (owner_uid scoping)",
    "Polymorphic artifact model: ENV_VAR (encrypted), PROMPT (plaintext), DOC_LINK (URL + metadata)",
    "Immutable ArtifactAccessLog + rate limiting (10 reveals/min, 60 searches/hour)",
    "64 backend tests (models, views, serializers, permissions) - 100% passing",
    "Playwright visual testing achieving A- (92/100) UI/UX grade",
    "PostgreSQL + Railway deployment + Vercel Edge hosting",
    "OpenAPI/Swagger documentation at /api/docs/ and OpenAPI schema at /api/schema/",
    "Firebase Authentication (Email/Password + Google OAuth) required for security",
  ];

  const whyValuable = [
    {
      title: "Security First",
      description:
        "Masked ENV variables with explicit reveal tracking. Immutable audit logs capture user, IP, and timestamp. Rate limiting prevents credential harvesting attacks. Workspace isolation ensures zero data leakage between teams.",
    },
    {
      title: "Multi-Environment Management",
      description:
        "Separate DEV/STAGING/PROD configurations per workspace. No more 'which .env did I update?' confusion. Environment-scoped artifact visibility.",
    },
    {
      title: "Knowledge Centralization",
      description:
        "Store reusable prompts (AI prompts, SQL templates) and documentation links alongside environment config. Everything searchable with comprehensive tagging.",
    },
    {
      title: "Developer Experience",
      description:
        "Responsive Next.js 15 UI validated across mobile/tablet/desktop. OpenAPI documentation with Swagger UI. Import/export for backups. Professional micro-interactions (A- grade).",
    },
    {
      title: "Production-Grade Quality",
      description:
        "64/64 backend tests passing (pytest). Zero linting errors, zero TypeScript errors. Live deployments on Railway (backend) + Vercel (frontend). Achieved A- (92/100) in Playwright visual testing.",
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
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Full-Stack
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              Completed
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              Featured
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-4">
            {project.title}
          </h1>

          <p className="text-xl text-text-2 mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <Button asChild size="lg">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden="true" className="w-4 h-4" />
                  View Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline" size="lg">
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
          </div>
        </div>

        {/* The Challenge */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Challenge</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            Software developers manage hundreds of critical artifacts across
            multiple projects: environment variables, API keys, database URLs,
            AI prompts, documentation links, and configuration snippets. These
            artifacts are scattered across .env files, Notion docs, Slack
            threads, and developer notebooks, making them difficult to find,
            share, and keep secure.
          </p>
          <p className="text-text-2 leading-relaxed">
            Traditional solutions like password managers aren&apos;t designed
            for development workflows, and cloud secret managers are often
            overkill for individual developers or small teams. The challenge was
            to create a{" "}
            <strong className="text-text-1">
              secure, centralized command center
            </strong>{" "}
            that could organize these polymorphic artifacts with proper
            authentication, workspace isolation, and audit logging for
            compliance requirements.
          </p>
        </div>

        {/* The Solution */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Solution</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            I developed <strong className="text-text-1">DEADLINE</strong>, a
            production-ready full-stack developer operations platform that
            serves as a unified command center for development artifacts. Built
            with{" "}
            <strong className="text-text-1">Firebase Authentication</strong>{" "}
            (Email/Password + Google OAuth), the platform ensures secure access
            while providing robust workspace isolation.
          </p>
          <p className="text-text-2 leading-relaxed">
            Built with Django 5 + PostgreSQL (Railway) and Next.js 15 (Vercel),
            DEADLINE implements a{" "}
            <strong className="text-text-1">polymorphic artifact system</strong>{" "}
            that handles environment variables (encrypted storage), AI prompts,
            and documentation links with environment-aware management
            (DEV/STAGING/PROD), comprehensive tagging, masked sensitive values
            with explicit reveal tracking, and immutable audit logs for
            compliance. The UI underwent rigorous Playwright visual testing,
            achieving an{" "}
            <strong className="text-text-1">A- grade (92/100)</strong> with
            professional micro-interactions (hover states, loading feedback,
            accessible focus rings).
          </p>
        </div>

        {/* Dashboard Screenshot */}
        <figure className="mb-8">
          <Image
            src="/deadline_img/deadline-dashboard.png"
            alt="DEADLINE dashboard showing workspace overview with artifact counts, environment filters, and recent activity feed"
            width={3456}
            height={1926}
            className="rounded-[20px] border border-border-line w-full h-auto"
            priority={false}
            quality={90}
            loading="lazy"
          />
          <figcaption className="text-text-3 text-sm mt-3 text-center">
            Dashboard Overview: Multi-tenant workspace management with real-time artifact tracking
          </figcaption>
        </figure>

        {/* Application Architecture */}
        <div className="mb-8">
          <div className="bg-surf-1 border border-border-line rounded-[20px] overflow-hidden">
            <div className="p-4 border-b border-border-line">
              <h3 className="text-lg font-bold text-text-1">
                Application Architecture
              </h3>
            </div>
            <div className="p-8">
              <div className="bg-surf-0 border border-border-line rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-text-2 font-mono whitespace-pre">
                  {`
┌─────────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         Next.js 15 App (Vercel Edge)                    │    │
│  │  - React 19 UI Components                               │    │
│  │  - TypeScript + Tailwind CSS                            │    │
│  │  - Firebase Client SDK (Auth)                           │    │
│  │  - Server Actions & API Routes                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                  Authentication Layer                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Firebase Authentication                       │   │
│  │  ┌────────────────┐      ┌──────────────────┐            │   │
│  │  │ Email/Password │      │  Google OAuth    │            │   │
│  │  └────────────────┘      └──────────────────┘            │   │
│  │                                                          │   │
│  │  Firebase Admin SDK (Backend) ←→ Firebase Client SDK     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Token Validation
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    Backend Layer (Railway)                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         Django 5 REST API (DRF)                         │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  API Endpoints                                   │   │    │
│  │  │  - /api/v1/artifacts/ (CRUD)                     │   │    │
│  │  │  - /api/v1/artifacts/reveal/ (ENV_VAR reveal)    │   │    │
│  │  │  - /api/v1/audit-logs/ (Immutable logs)          │   │    │
│  │  │  - /api/docs/ (Swagger UI)                       │   │    │
│  │  │  - /api/schema/ (OpenAPI)                        │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Core Features                                   │   │    │
│  │  │  - Polymorphic Artifact Model (ContentType)      │   │    │
│  │  │  - Workspace Isolation (owner_uid scoping)       │   │    │
│  │  │  - Rate Limiting (django-ratelimit)              │   │    │
│  │  │  - Encryption (cryptography.fernet)              │   │    │
│  │  │  - Audit Logging (immutable records)             │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                   Data Layer (Railway)                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL Database                        │    │
│  │                                                         │    │
│  │  Tables:                                                │    │
│  │  - artifacts (polymorphic: ENV_VAR, PROMPT, DOC_LINK)   │    │
│  │  - audit_logs (immutable reveal tracking)               │    │
│  │  - users (Firebase UID references)                      │    │
│  │                                                         │    │
│  │  Managed by: Alembic migrations                         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

                   Deployment & Quality Assurance

┌─────────────────────────────────────────────────────────────────┐
│  Production Deployments                                         │
│  - Frontend: https://deadline-demo.vercel.app (Vercel Edge)     │
│  - Backend: https://deadline-production.up.railway.app (Railway)│
│                                                                 │
│  Testing & Quality                                              │
│  - Backend: pytest (64/64 tests passing)                        │
│  - Frontend: Playwright (A- grade, 92/100 UI/UX)                │
│  - API Docs: Swagger UI + OpenAPI 3.0 schema                    │
└─────────────────────────────────────────────────────────────────┘`}
                </pre>
              </div>
              <div className="mt-4 text-sm text-text-3">
                <p className="mb-2">
                  <strong className="text-text-2">Data Flow:</strong> User
                  authenticates via Firebase → Frontend sends API requests with
                  Firebase token → Backend validates token and owner_uid →
                  Applies workspace isolation → Performs database operations →
                  Returns filtered results
                </p>
                <p>
                  <strong className="text-text-2">Security:</strong> All ENV_VAR
                  values encrypted at rest, masked in UI, reveal tracking via
                  immutable audit logs, rate limiting on sensitive endpoints
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
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Shield
                    aria-hidden="true"
                    className="w-5 h-5 text-brand-primary"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Firebase Authentication & Security
                </h3>
                <p className="text-text-2">
                  Secure sign-up and login via{" "}
                  <strong>Firebase Authentication</strong> (Email/Password +
                  Google OAuth). Workspace isolation ensures multi-tenant
                  security with owner_uid scoping. Rate limiting (10
                  reveals/min, 60 searches/hour) prevents credential harvesting.
                  Immutable audit logs track every ENV_VAR reveal with user, IP,
                  and timestamp for HIPAA/SOC 2/GDPR compliance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Layers
                    aria-hidden="true"
                    className="w-5 h-5 text-purple-400"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Polymorphic Artifact System
                </h3>
                <p className="text-text-2">
                  Unified interface for managing three artifact types: ENV_VAR
                  (environment variables with key/value), PROMPT (AI prompt
                  templates with title/content), and DOC_LINK (documentation
                  URLs with notes). Each artifact supports environment scoping
                  (DEV/STAGING/PROD), comprehensive tagging, and search.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Eye aria-hidden="true" className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Masked Secrets & Audit Trails
                </h3>
                <p className="text-text-2">
                  ENV_VAR values are masked by default (e.g.,{" "}
                  <code>••••••••</code>) with explicit reveal-on-click. Every
                  reveal is logged immutably with user identity, IP address, and
                  timestamp. Environment-aware visibility (DEV/STAGING/PROD)
                  prevents accidental production secret exposure. Django{" "}
                  <code>django-ratelimit</code> prevents abuse.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Users aria-hidden="true" className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Workspace Management
                </h3>
                <p className="text-text-2">
                  Multi-tenant architecture with workspace isolation. Each
                  workspace contains artifacts organized by environment and
                  tags. Create, edit, and delete workspaces with real-time
                  updates. Dashboard provides workspace overview with artifact
                  counts and recent activity.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Eye aria-hidden="true" className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  UI/UX Excellence
                </h3>
                <p className="text-text-2">
                  Achieved A- grade (92/100) in Playwright visual testing.
                  Professional micro-interactions: hover states with scale
                  effects, loading feedback, accessible focus rings (#2563EB).
                  Mobile-responsive design validated across desktop (1512px),
                  tablet (768px), and mobile (375px) viewports. Custom 404 page
                  with helpful navigation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Screenshot */}
        <figure className="mb-8">
          <Image
            src="/deadline_img/deadline-workspace.png"
            alt="DEADLINE workspace interface displaying polymorphic artifacts (ENV_VAR, PROMPT, DOC_LINK) with environment scoping, tags, and reveal tracking"
            width={3456}
            height={1926}
            className="rounded-[20px] border border-border-line w-full h-auto"
            priority={false}
            quality={90}
            loading="lazy"
          />
          <figcaption className="text-text-3 text-sm mt-3 text-center">
            Workspace View: Environment-scoped artifact management with masked secrets and audit logging
          </figcaption>
        </figure>

        {/* Technical Implementation */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Technical Implementation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-text-1 mb-2">
                Backend Architecture
              </h3>
              <p className="text-text-2 mb-2">
                Django 5 REST API deployed on Railway with PostgreSQL database.
                Implements Django REST Framework for API endpoints, Firebase
                Admin SDK for authentication verification, and polymorphic
                artifact models using Django&apos;s ContentType framework.
                Alembic migrations manage schema evolution.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  Django 5
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  DRF
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  PostgreSQL
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  Railway
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  Alembic
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-1 mb-2">
                Frontend Stack
              </h3>
              <p className="text-text-2 mb-2">
                Next.js 15 App Router with React 19 deployed on Vercel. Uses
                React Hook Form for validation, Tailwind CSS for styling, and
                Radix UI primitives (shadcn/ui) for accessible components.
                Firebase SDK handles client-side authentication with session
                tokens. Context API manages global state.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  Next.js 15
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  React 19
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  Tailwind CSS
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  Vercel
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-1 mb-2">
                Quality Assurance
              </h3>
              <p className="text-text-2 mb-2">
                Comprehensive UI/UX testing with Playwright MCP visual
                automation. Achieved A- grade (92/100) with validation across
                desktop/tablet/mobile viewports. ESLint with zero warnings,
                TypeScript strict mode, and React Hook Form validation ensure
                code quality. Custom 404 error page with illustration.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  Playwright
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  ESLint
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">
                  Visual Testing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Process */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Development Process
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5"
              />
              <div>
                <strong className="text-text-1">
                  Phase 1: Architecture & Design
                </strong>
                <p className="text-text-2 text-sm mt-1">
                  Designed Django models with polymorphic artifact system.
                  Planned REST API endpoints and authentication flow. Created
                  Next.js frontend scaffolding with App Router structure.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5"
              />
              <div>
                <strong className="text-text-1">
                  Phase 2: Backend Implementation
                </strong>
                <p className="text-text-2 text-sm mt-1">
                  Built Django REST API with DRF serializers. Implemented
                  Firebase Admin SDK authentication middleware. Created
                  PostgreSQL schema with Alembic migrations. Deployed to Railway
                  with environment configuration.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5"
              />
              <div>
                <strong className="text-text-1">
                  Phase 3: Frontend Development
                </strong>
                <p className="text-text-2 text-sm mt-1">
                  Built Next.js pages with TypeScript. Integrated Firebase
                  Authentication with session management. Created React Hook
                  Form validation for all artifact types. Implemented Tailwind
                  CSS styling with responsive design.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5"
              />
              <div>
                <strong className="text-text-1">
                  Phase 4: Demo Mode & UI Polish
                </strong>
                <p className="text-text-2 text-sm mt-1">
                  Implemented zero-signup demo authentication with session
                  tokens. Created Django management command for demo data
                  seeding. Added prominent &ldquo;Launch Demo&rdquo; CTA with
                  recruiter-focused UX. Seeded sample workspaces with realistic
                  artifacts.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5"
              />
              <div>
                <strong className="text-text-1">
                  Phase 5: Visual Testing & Optimization
                </strong>
                <p className="text-text-2 text-sm mt-1">
                  Conducted Playwright visual testing across all viewports.
                  Implemented Priority 1 improvements: hover states, loading
                  feedback, focus rings. Validated mobile responsiveness (375px,
                  768px, 1512px). Achieved A- grade with zero ESLint warnings.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5"
              />
              <div>
                <strong className="text-text-1">
                  Phase 6: Production Deployment
                </strong>
                <p className="text-text-2 text-sm mt-1">
                  Deployed backend to Railway with PostgreSQL provisioning.
                  Deployed frontend to Vercel with custom domain. Configured
                  CORS and environment variables. Tested end-to-end
                  authentication and demo mode in production.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Mission & Vision
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-text-1 mb-2 flex items-center gap-2">
                <Zap
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary"
                />
                Mission
              </h3>
              <p className="text-text-2 leading-relaxed">
                Eliminate developer context-switching chaos by centralizing
                scattered artifacts (ENV variables, AI prompts, documentation
                links) into a secure, workspace-isolated command center. Stop
                Slack archeology, .env confusion, and lost prompt templates.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-1 mb-2 flex items-center gap-2">
                <Eye
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary"
                />
                Vision
              </h3>
              <p className="text-text-2 leading-relaxed">
                Become the trusted single source of truth for developer
                knowledge artifacts, enabling teams to ship faster with less
                cognitive overhead. Scale from solo developers to enterprise
                teams with security-first principles (Firebase auth, audit logs,
                workspace isolation).
              </p>
            </div>
          </div>
        </div>

        {/* Why DEADLINE Matters */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Why DEADLINE Matters
          </h2>
          <div className="space-y-6">
            {whyValuable.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                    <CheckCircle2
                      aria-hidden="true"
                      className="w-4 h-4 text-brand-primary"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-World Use Cases */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Real-World Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <div key={idx} className="flex gap-4">
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
          <ul className="space-y-3">
            {technicalHighlights.map((highlight, idx) => (
              <li key={idx} className="flex gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5"
                />
                <span className="text-text-2">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Live Deployments */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Live Deployments
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surf-2 border border-border-line rounded-lg">
              <div>
                <h3 className="text-lg font-bold text-text-1">
                  Frontend (Vercel)
                </h3>
                <p className="text-text-3 text-sm">
                  Next.js 15 + Firebase Auth (Email/Password + Google OAuth)
                </p>
              </div>
              <Button asChild variant="outline">
                <a
                  href="https://deadline-demo.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden="true" className="w-4 h-4" />
                  Visit
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-surf-2 border border-border-line rounded-lg">
              <div>
                <h3 className="text-lg font-bold text-text-1">
                  Backend API (Railway)
                </h3>
                <p className="text-text-3 text-sm">
                  Django 5 REST Framework + PostgreSQL
                </p>
              </div>
              <Button asChild variant="outline">
                <a
                  href="https://deadline-production.up.railway.app/api/v1/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden="true" className="w-4 h-4" />
                  API
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-surf-2 border border-border-line rounded-lg">
              <div>
                <h3 className="text-lg font-bold text-text-1">
                  API Documentation
                </h3>
                <p className="text-text-3 text-sm">
                  OpenAPI/Swagger UI + ReDoc
                </p>
              </div>
              <Button asChild variant="outline">
                <a
                  href="https://deadline-production.up.railway.app/api/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText aria-hidden="true" className="w-4 h-4" />
                  Docs
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Results & Impact */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Results & Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surf-2 border border-border-line rounded-lg p-6">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                A-
              </div>
              <div className="text-text-1 font-medium">UI/UX Grade</div>
              <div className="text-text-3 text-sm mt-1">
                92/100 in Playwright visual testing
              </div>
            </div>

            <div className="bg-surf-2 border border-border-line rounded-lg p-6">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                64/64
              </div>
              <div className="text-text-1 font-medium">
                Backend Tests Passing
              </div>
              <div className="text-text-3 text-sm mt-1">
                Models, views, serializers, permissions
              </div>
            </div>

            <div className="bg-surf-2 border border-border-line rounded-lg p-6">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                3
              </div>
              <div className="text-text-1 font-medium">Artifact Types</div>
              <div className="text-text-3 text-sm mt-1">
                ENV_VAR, PROMPT, DOC_LINK polymorphism
              </div>
            </div>

            <div className="bg-surf-2 border border-border-line rounded-lg p-6">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                100%
              </div>
              <div className="text-text-1 font-medium">Mobile Responsive</div>
              <div className="text-text-3 text-sm mt-1">
                Validated across all device sizes
              </div>
            </div>
          </div>

          <p className="text-text-2 mt-6 leading-relaxed">
            DEADLINE demonstrates production-ready full-stack development with a
            focus on{" "}
            <strong className="text-text-1">developer experience</strong>,{" "}
            <strong className="text-text-1">security-first design</strong>, and{" "}
            <strong className="text-text-1">
              compliance-ready audit logging
            </strong>
            . Firebase Authentication ensures secure access while workspace
            isolation prevents data leakage between teams. Rate limiting and
            immutable audit logs make it enterprise-ready for HIPAA/SOC 2/GDPR
            compliance.
          </p>
        </div>

        {/* Technologies */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-surf-2 text-text-2 rounded-full text-sm border border-border-line"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
