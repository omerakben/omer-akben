import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = createMetadata({
  title: "Elon AI — TUEL AI Platform",
  description:
    "Flagship TUEL AI deployment at Elon University: multi-tenant RAG, agentic workflows, and measurable learning impact.",
  path: "/projects/elon-ai",
});

const metrics = [
  {
    value: "20M+",
    label: "Tokens Processed",
    detail: "Production usage at Elon University",
  },
  {
    value: "95%",
    label: "Satisfaction",
    detail: "62/65 positive ratings",
  },
  {
    value: "2%",
    label: "Error Rate",
    detail: "Across 100+ sessions",
  },
  {
    value: "16+",
    label: "Learning Tools",
    detail: "Flashcards, quizzes, concept maps",
  },
  {
    value: "35+",
    label: "Audit Actions",
    detail: "FERPA-grade governance",
  },
  {
    value: "P95 < 2s",
    label: "Retrieval Latency",
    detail: "Hybrid RAG pipeline",
  },
];

const capabilityHighlights = [
  "7-layer prompt system with source citations and guardrails",
  "Multi-tenant isolation with Microsoft Entra ID RBAC",
  "Hybrid search (pgvector + keyword) with semantic caching",
  "Agentic workflows for student services and learning support",
  "Faculty controls for AI behavior and content boundaries",
  "Evaluation harness with RAGAS + LangSmith tracing",
];

const architectureHighlights = [
  "Frontend: Next.js 15 + React 19 with Vercel AI SDK streaming",
  "Backend: FastAPI services with OpenAI, Claude, Grok, and Gemini routing",
  "Data: pgvector + Upstash Vector, Neon Postgres, Drizzle ORM",
  "Security: Entra ID SSO, row-level isolation, 35+ audit actions",
  "Ops: GitHub Actions CI, Playwright E2E + API test coverage",
];

const outcomes = [
  "60% reduction in support response time through RAG + routing",
  "25% improvement in retrieval precision with hybrid search tuning",
  "Production reliability validated by pilot faculty usage",
];

export default function ElonAiProjectPage() {
  const project = getProjectBySlug("elon-ai");

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surf-0 py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-text-2 hover:text-text-1 mb-8 transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />
          Back to Projects
        </Link>

        <Card className="mb-8 border-border-line bg-surf-1">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-brand-primary mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-text-1 mb-2">
                  Elon University Intellectual Property
                </h2>
                <p className="text-sm text-text-2">
                  This flagship deployment is delivered for Elon University and
                  remains institutional/client IP. Source code is maintained in
                  private repositories for authorized partners only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge variant="outline" className="text-sm">
              AI Platform
            </Badge>
            <Badge variant="outline" className="text-sm">
              EdTech
            </Badge>
            <Badge variant="outline" className="text-sm">
              Production
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-text-2 max-w-3xl mb-6">
            TUEL AI&apos;s flagship deployment at Elon University, built to
            deliver trustworthy, citation-backed learning support at scale.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink aria-hidden="true" className="w-4 h-4" />
                Live Deployment
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://tuel.ai/#demo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Sparkles aria-hidden="true" className="w-4 h-4" />
                Try TUEL AI Demo
              </a>
            </Button>
          </div>
        </div>

        {project.image && (
          <div className="mb-10">
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              width={1200}
              height={675}
              className="rounded-2xl border border-border-line"
              priority
            />
          </div>
        )}

        <Card className="mb-10 border-border-line">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Gauge className="w-5 h-5 text-brand-primary" />
              Production Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-border-line bg-surf-1 p-4"
                >
                  <div className="text-3xl font-bold text-text-1 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm font-medium text-text-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-text-3 mt-1">
                    {metric.detail}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-text-3">
              Full matrix:{" "}
              <a
                href="https://elon-ai.app/features-matrix"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-text-1"
              >
                100+ features across 13 categories
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <Card className="border-border-line">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-primary" />
                Capability Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-text-2">
                {capabilityHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border-line">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-primary" />
                Architecture Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-text-2">
                {architectureHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10 border-border-line">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              Outcomes & Reliability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-text-2">
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-10 border-border-line">
          <CardHeader>
            <CardTitle className="text-2xl">Related Elon Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-text-2 space-y-2">
            <p>
              Explore the broader Elon University AI initiative built alongside
              this flagship deployment.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/projects/elon-ai-agent"
                className="underline hover:text-text-1"
              >
                Elon AI Agent
              </Link>
              <Link
                href="/projects/elon-ai-toolbox"
                className="underline hover:text-text-1"
              >
                Elon AI Toolbox
              </Link>
              <Link
                href="/projects/elongpt"
                className="underline hover:text-text-1"
              >
                ElonGPT
              </Link>
              <Link
                href="/projects/lsb-ai-studio"
                className="underline hover:text-text-1"
              >
                LSB Applied AI Studio
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-line">
          <CardHeader>
            <CardTitle className="text-2xl">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="text-text-2">
            {project.startDate && (
              <div>
                <span className="font-medium">Started:</span>{" "}
                {project.startDate}
              </div>
            )}
            {project.endDate && (
              <div>
                <span className="font-medium">Status:</span> {project.endDate}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
