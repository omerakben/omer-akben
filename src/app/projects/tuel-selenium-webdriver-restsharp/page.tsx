import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Code,
  ExternalLink,
  FileText,
  Github,
  Layers,
  Shield,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "TUEL Selenium WebDriver + RestSharp Test Framework | Omer Akben",
  description:
    "Open-source .NET 8 automation framework blending Selenium WebDriver UI suites with RestSharp API coverage, centralized configuration, Azure AD auth, and Docker-ready CI pipelines.",
  path: "/projects/tuel-selenium-webdriver-restsharp",
});

export default function TuelSeleniumWebDriverRestSharpPage() {
  const project = getProjectBySlug("tuel-selenium-webdriver-restsharp");

  if (!project) {
    notFound();
  }

  const missionHighlights = [
    "Modernize a legacy financial-services test harness into a vendor-neutral .NET 8 baseline.",
    "Offer a plug-and-play starting point for teams that need combined API + UI automation.",
    "Prove SDET craft with observable, secure defaults (logging, masking, auditability).",
    "Publish reusable documentation so new contributors can ship in under a day.",
  ];

  const useCases = [
    {
      icon: Briefcase,
      title: "Regulated Enterprises",
      description:
        "Banks, fintech, healthcare teams can enforce Azure AD flows, Key Vault-managed secrets, and auditable logging without writing boilerplate from scratch.",
    },
    {
      icon: Code,
      title: "Full-Stack SDET Squads",
      description:
        "API and UI engineers can share a single repo with Page Object patterns, RestSharp clients, and environment-aware configuration that scales from laptops to Selenium Grid.",
    },
    {
      icon: Shield,
      title: "Security-Conscious Pipelines",
      description:
        "SecretManager references (env://, kv://, enc://) plus HTTPS-first Docker configs keep tokens masked, even when running parallel suites in CI.",
    },
    {
      icon: Zap,
      title: "Modernization Programs",
      description:
        "Teams replacing brittle Thread.Sleep calls or Console.WriteLine debugging get smart waits, retry helpers, and structured logging with minimal code churn.",
    },
  ];

  const architecturePillars = [
    {
      icon: Layers,
      title: "Layered Test Stack",
      description:
        "Discrete API (RestSharp) and UI (Selenium WebDriver) layers share domain models - Products, Orders, Customers, Templates, Pricing - so scenarios stay business-focused.",
    },
    {
      icon: Shield,
      title: "Security & Auth",
      description:
        "Multiple OAuth flows (Azure Entra client credentials, ROPC, local JWT) plus enforced HTTPS in Docker keep test credentials aligned with production controls.",
    },
    {
      icon: FileText,
      title: "Configuration Governance",
      description:
        "TestConfiguration.cs centralizes every timeout, retry, and logging toggle with environment overrides (`dev`, `staging`, `prod`) and encrypted secrets when needed.",
    },
    {
      icon: CheckCircle2,
      title: "Observability",
      description:
        "TestLogger outputs structured logs with masking, color-coded console traces, and hooks for future sinks so failures read like incident timelines.",
    },
  ];

  const implementationWins = [
    {
      title: "Thread.Sleep Eradication",
      status: "Completed",
      impact: "2-5x faster UI suites",
      details:
        "UIHelper, Base.cs, and LoginPOM now rely on WebDriverWait-based helpers (`WaitVisible`, `WaitForPageTransition`) plus async-friendly retry logic.",
    },
    {
      title: "Centralized Configuration",
      status: "Completed",
      impact: "Consistent timeouts & security",
      details:
        "TestConfiguration.cs exposes typed getters for every timeout, retry, and security flag, so Docker, local, and CI runs stay in sync.",
    },
    {
      title: "Structured Logging",
      status: "Completed",
      impact: "Faster debugging",
      details:
        "TestLogger standardizes Trace->Critical levels, masks secrets automatically, and colorizes console output for healthier on-call triage.",
    },
    {
      title: "Security Hardening",
      status: "Completed",
      impact: "Production-ready defaults",
      details:
        "HTTPS-by-default docker-compose, forced secure BaseURL/BaseurlAPI settings, and audit logging stubs ensure no plaintext secrets escape.",
    },
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      label: "Critical Fixes",
      status: "Completed",
      details:
        "LoginPOM + Base.cs migrations removed Thread.Sleep and validated the new helper patterns across priority flows.",
    },
    {
      phase: "Phase 2",
      label: "Remaining Thread.Sleep",
      status: "Completed",
      details:
        "All 45 legacy Thread.Sleep calls across HealthCheck, Dashboard, Members, and validator suites migrated to smart waits and retry helpers.",
    },
    {
      phase: "Phase 3",
      label: "Console Output Cleanup",
      status: "Completed",
      details:
        "26 Console.WriteLine instances replaced with TestLogger so every event now emits structured, masked output.",
    },
    {
      phase: "Phase 4",
      label: "Zero-Warning Build",
      status: "Completed",
      details:
        "Compiler warnings triaged and resolved, giving the framework a clean build and CI gate.",
    },
  ];

  const metrics = [
    "95%+ suite reliability with <5 minute full-run target",
    "Smart waits and pooling eliminate Thread.Sleep entirely across suites",
    "Structured logging coverage across suites with masked secrets and timeline output",
    "Dockerized `dotnet test` workflow mirrors local, CI, and Selenium Grid runs",
  ];

  return (
    <main className="min-h-screen bg-surf-0 py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-text-2 hover:text-text-1 mb-8 transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
              QA Automation
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-300 border border-green-500/30">
              Completed
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              Open Source
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

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Mission & Delivery Outcomes
          </h2>
          <p className="text-text-2 leading-relaxed mb-6">
            Transit to Fully Open-Source TUEL is my reference implementation for how
            modern SDET teams should structure Selenium + RestSharp codebases.
            The initiative graduates a legacy financial solution into a
            reusable, observability-first framework that any enterprise can fork,
            containerize, and trust inside regulated pipelines. Each delivery
            phase is shipped and documented—smart waits, centralized
            configuration, structured logging, and security hardening all landed
            with matching guides so teams can adopt the stack without churn.
          </p>
          <ul className="grid gap-3 md:grid-cols-2">
            {missionHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-text-2 leading-relaxed"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="w-5 h-5 text-green-400 shrink-0 mt-0.5"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-surf-1 border border-border-line rounded-[20px] p-6"
            >
              <useCase.icon aria-hidden="true" className="w-5 h-5 mb-3 text-brand-primary" />
              <h3 className="text-xl font-semibold text-text-1 mb-2">
                {useCase.title}
              </h3>
              <p className="text-text-2 leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">Architecture Pillars</h2>
          <p className="text-text-2 leading-relaxed mb-6">
            Every layer is battle-tested across API suites, UI flows, authentication,
            configuration, and observability so the framework behaves predictably
            whether you run it locally, inside Docker, or against Selenium Grid.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {architecturePillars.map((pillar) => (
              <div key={pillar.title} className="bg-surf-0 border border-border-subtle rounded-2xl p-6">
                <pillar.icon aria-hidden="true" className="w-5 h-5 text-brand-primary mb-3" />
                <h3 className="text-lg font-semibold text-text-1 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-text-2 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">Implementation Wins</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {implementationWins.map((win) => (
              <div key={win.title} className="bg-surf-0 border border-border-subtle rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-text-1">{win.title}</h3>
                  <span className="text-sm font-medium text-green-300">
                    {win.status}
                  </span>
                </div>
                <p className="text-sm text-text-2 mb-2">{win.impact}</p>
                <p className="text-text-2 leading-relaxed">{win.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">Delivery Phases</h2>
          <div className="space-y-4">
            {roadmap.map((item) => (
              <div
                key={item.phase}
                className="bg-surf-0 border border-border-subtle rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-text-1/10 text-text-1 rounded-full">
                    {item.phase}
                  </span>
                  <span className="text-sm text-text-2">{item.label}</span>
                  <span className="ml-auto text-sm font-medium text-brand-primary">
                    {item.status}
                  </span>
                </div>
                <p className="text-text-2 leading-relaxed">{item.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">Operational Metrics</h2>
          <p className="text-text-2 leading-relaxed mb-6">
            Quality gates are enforced through dotnet test, Docker Compose, and
            GitHub workflows. Suites are expected to execute under five minutes,
            maintain 95%+ stability, and expose actionable reporting (screenshots,
            structured logs, performance metrics) for every failure.
          </p>
          <ul className="space-y-3">
            {metrics.map((metric) => (
              <li key={metric} className="flex items-start gap-3 text-text-2">
                <CheckCircle2
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary shrink-0 mt-0.5"
                />
                {metric}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
