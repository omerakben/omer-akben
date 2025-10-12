import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  ExternalLink,
  Eye,
  Github,
  Layers,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "DEADLINE - Developer Command Center | Omer Akben",
  description:
    "A comprehensive case study of DEADLINE, a production-deployed developer operations platform with zero-signup demo mode and polymorphic artifact management.",
};

export default function DeadlineCaseStudyPage() {
  const project = getProjectBySlug("capstone-deadline");

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surf-0 py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Back button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-text-2 hover:text-text-1 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
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
                  <ExternalLink className="w-4 h-4" />
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
                  <Github className="w-4 h-4" />
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
            <strong className="text-text-1">centralized command center</strong>{" "}
            that could organize these polymorphic artifacts while providing
            instant demo access for recruiters and technical evaluators.
          </p>
        </div>

        {/* The Solution */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Solution</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            I developed <strong className="text-text-1">DEADLINE</strong>, a
            full-stack developer operations platform that serves as a unified
            command center for development artifacts. The platform features a{" "}
            <strong className="text-text-1">zero-signup demo mode</strong> that
            allows recruiters and evaluators to experience the full application
            instantly using pre-populated sample workspaces.
          </p>
          <p className="text-text-2 leading-relaxed">
            Built with Django 5 + PostgreSQL (Railway) and Next.js 15 (Vercel),
            DEADLINE implements a{" "}
            <strong className="text-text-1">polymorphic artifact system</strong>{" "}
            that handles environment variables, AI prompts, and documentation
            links with environment-aware management (DEV/STAGING/PROD),
            comprehensive tagging, and masked sensitive values for security. The
            UI underwent rigorous Playwright visual testing, achieving an{" "}
            <strong className="text-text-1">A- grade (92/100)</strong> with
            professional micro-interactions.
          </p>
        </div>

        {/* Architecture Diagram Placeholder */}
        {project.image && (
          <div className="mb-8">
            <div className="bg-surf-1 border border-border-line rounded-[20px] overflow-hidden">
              <div className="p-4 border-b border-border-line">
                <h3 className="text-lg font-bold text-text-1">
                  Application Architecture
                </h3>
              </div>
              <div className="p-8 flex items-center justify-center min-h-[400px] text-text-3">
                <div className="text-center">
                  <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Architecture diagram coming soon</p>
                  <p className="text-sm mt-2">
                    Django 5 + Railway ↔ Next.js 15 + Vercel
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Features */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">Key Features</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Zero-Signup Demo Mode
                </h3>
                <p className="text-text-2">
                  Instant access for recruiters via prominent &ldquo;Launch
                  Demo&rdquo; button. Session-based authentication with
                  pre-populated sample workspaces demonstrating real-world
                  DevOps workflows. Demo data resets daily for consistent
                  evaluation experience.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-purple-400" />
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
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  Security & Privacy
                </h3>
                <p className="text-text-2">
                  Masked sensitive values (API keys, secrets) with
                  reveal-on-hover functionality. Workspace isolation ensures
                  multi-tenancy with Firebase Authentication. Session-based demo
                  tokens with automatic expiration. Environment-aware artifact
                  visibility prevents production secret exposure.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-400" />
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
                  <Eye className="w-5 h-5 text-orange-400" />
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
              <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
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
              <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
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
              <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
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
              <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
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
              <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
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
              <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
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
                0
              </div>
              <div className="text-text-1 font-medium">Code Quality Issues</div>
              <div className="text-text-3 text-sm mt-1">
                Zero ESLint warnings or TypeScript errors
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
            <strong className="text-text-1">recruiter accessibility</strong>,
            and <strong className="text-text-1">security-first design</strong>.
            The zero-signup demo mode removes friction for technical evaluators
            while showcasing real-world DevOps workflows.
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
