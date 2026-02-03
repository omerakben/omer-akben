import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import {
  ArrowLeft,
  Brain,
  Building2,
  CheckCircle2,
  Code,
  ExternalLink,
  FileSearch,
  GitBranch,
  Layers,
  Network,
  Search,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "Elon AI Agent - Business Plan Generator",
  description:
    "AI-powered business plan generator with parallel agent processing achieving 3-4x speedup. Production-validated by North Glass LLC. Developed for Elon University with FastAPI and OpenAI. [ELON UNIVERSITY PROPERTY - PRIVATE REPOSITORY]",
  path: "/projects/elon-ai-agent",
});

export default function ElonAIAgentPage() {
  const project = getProjectBySlug("elon-ai-agent");

  if (!project) {
    notFound();
  }

  const features = [
    {
      icon: Zap,
      title: "Parallel Agent Processing",
      description:
        "7 specialized sub-agents running concurrently via Python asyncio for 3-4x speedup over sequential processing. Generates comprehensive business plans in under 60 seconds.",
    },
    {
      icon: GitBranch,
      title: "Three-Phase Workflow",
      description:
        "Clarification phase validates inputs, parallel generation distributes work across agents, and review phase ensures quality with 0-10 scoring system.",
    },
    {
      icon: Search,
      title: "Web Search Integration",
      description:
        "Real-time market research through web search tools provides citation-rich, data-backed insights for competitive analysis and industry trends.",
    },
    {
      icon: Code,
      title: "Code Interpreter Tools",
      description:
        "Financial modeling and calculations powered by code execution capabilities for accurate projections and business metrics.",
    },
    {
      icon: Shield,
      title: "JSON Schema Validation",
      description:
        "Structured output validation ensures consistent, parseable business plans with guaranteed section completeness and formatting.",
    },
    {
      icon: Brain,
      title: "Quality Assurance System",
      description:
        "Automated review agent scores each section 0-10, identifies gaps, and triggers regeneration for substandard content before final delivery.",
    },
  ];

  const technicalHighlights = [
    "FastAPI backend with async/await patterns for high concurrency",
    "OpenAI GPT-4 with function calling for agent orchestration",
    "Python asyncio for parallel agent execution (3-4x speedup)",
    "Three-phase workflow: clarification → parallel generation → review",
    "7 specialized sub-agents: Executive Summary, Market Analysis, Operations, Marketing, Financial, Risk, Appendix",
    "Web search integration via Tavily API for market research",
    "Code interpreter tools for financial calculations",
    "JSON Schema validation with Pydantic models",
    "Quality assurance with 0-10 scoring per section",
    "Next.js 15 frontend for business plan input forms",
    "Azure Container Apps deployment with FastAPI docs endpoint",
    "Production validation by North Glass LLC (real business use)",
  ];

  const sevenAgents = [
    {
      name: "Executive Summary Agent",
      description:
        "Synthesizes company vision, mission, and key objectives into compelling executive overview",
    },
    {
      name: "Market Analysis Agent",
      description:
        "Conducts competitive research, identifies target markets, and analyzes industry trends with web search",
    },
    {
      name: "Operations Agent",
      description:
        "Designs operational processes, supply chain logistics, and organizational structure",
    },
    {
      name: "Marketing Agent",
      description:
        "Develops go-to-market strategy, pricing models, and customer acquisition channels",
    },
    {
      name: "Financial Agent",
      description:
        "Builds financial projections, revenue models, and funding requirements using code interpreter",
    },
    {
      name: "Risk Agent",
      description:
        "Identifies potential risks, regulatory compliance needs, and mitigation strategies",
    },
    {
      name: "Appendix Agent",
      description:
        "Compiles supporting documents, citations, and supplementary data for comprehensive reference",
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

        {/* University Property Warning - Top of Page */}
        <div className="bg-yellow-500/10 border-4 border-yellow-500/60 rounded-lg p-4 mb-8 shadow-lg">
          <div className="flex gap-3">
            <Building2
              aria-hidden="true"
              className="w-6 h-6 text-yellow-400 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-text-1 mb-2">
                Elon University Intellectual Property
              </h3>
              <div className="text-text-2 text-sm space-y-2">
                <p>
                  This project, along with the Elon AI platform (TUEL AI), AI
                  Toolbox, ElonGPT, and LSB Applied AI Studio, was developed
                  for Elon University and remains their intellectual property.
                </p>
                <p>
                  All source code is maintained in private repositories. Please
                  respect Elon University&apos;s property and do not attempt to
                  access, replicate, or distribute these systems without
                  authorization.
                </p>
                <p>
                  Demo access is provided for portfolio demonstration purposes
                  only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              AI
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              Production
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
            {project.demoUrl && (
              <Button asChild size="lg">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden="true" className="w-4 h-4" />
                  View API Docs
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" disabled>
              <span className="opacity-50 cursor-not-allowed">
                <Shield aria-hidden="true" className="w-4 h-4" />
                Private Repository
              </span>
            </Button>
          </div>
        </div>

        {/* The Challenge */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Challenge</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            Creating comprehensive business plans is time-intensive and requires
            expertise across multiple domains: market analysis, financial
            modeling, operations planning, and risk assessment. Traditional
            consultants charge thousands of dollars and take weeks to deliver.
            Entrepreneurs and small businesses need faster, more affordable
            solutions without sacrificing quality.
          </p>
          <p className="text-text-2 leading-relaxed">
            The challenge was to build an{" "}
            <strong className="text-text-1">
              AI-powered business plan generator
            </strong>{" "}
            that could produce professional, citation-rich business plans in
            under 60 seconds while maintaining accuracy and comprehensiveness.
            The system needed to handle complex parallel processing, integrate
            real-time web research, and ensure quality through automated
            validation.
          </p>
        </div>

        {/* The Solution */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Solution</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            I developed an{" "}
            <strong className="text-text-1">
              AI-powered business plan generator
            </strong>{" "}
            using <strong className="text-text-1">FastAPI</strong> and{" "}
            <strong className="text-text-1">OpenAI GPT-4</strong> with a
            parallel agent architecture. The system employs{" "}
            <strong className="text-text-1">7 specialized sub-agents</strong>{" "}
            running concurrently via Python asyncio, achieving{" "}
            <strong className="text-text-1">3-4x speedup</strong> over
            sequential processing.
          </p>
          <p className="text-text-2 leading-relaxed">
            A <strong className="text-text-1">three-phase workflow</strong>{" "}
            (clarification → parallel generation → review) ensures quality:
            input validation, distributed agent execution, and automated scoring
            (0-10 per section) with regeneration for substandard content. Web
            search integration provides citation-rich market research, while
            code interpreter tools enable accurate financial projections. The
            system was{" "}
            <strong className="text-text-1">
              production-validated by North Glass LLC
            </strong>
            , demonstrating real-world business value.
          </p>
        </div>

        {/* Parallel Agent Architecture */}
        <div className="mb-8">
          <div className="bg-surf-1 border border-border-line rounded-[20px] overflow-hidden">
            <div className="p-4 border-b border-border-line">
              <h3 className="text-lg font-bold text-text-1">
                Parallel Agent Architecture
              </h3>
            </div>
            <div className="p-8">
              <div className="bg-surf-0 border border-border-line rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-text-2 font-mono whitespace-pre">
                  {`
┌─────────────────────────────────────────────────────────────────┐
│                     USER INPUT (via Next.js 15)                 │
│  Company name, industry, target market, funding needs, vision   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1: CLARIFICATION                       │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Clarification Agent (OpenAI GPT-4)                    │     │
│  │  • Validates business concept feasibility              │     │
│  │  • Identifies missing information                      │     │
│  │  • Structures data for downstream agents               │     │
│  └────────────────────────────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 2: PARALLEL GENERATION (asyncio)             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ Executive        │  │ Market Analysis  │  │ Operations    │  │
│  │ Summary Agent    │  │ Agent            │  │ Agent         │  │
│  │ • Vision/mission │  │ • Competitive    │  │ • Processes   │  │
│  │ • Key objectives │  │   landscape      │  │ • Supply      │  │
│  │                  │  │ • Web search     │  │   chain       │  │
│  └──────────────────┘  └──────────────────┘  └───────────────┘  │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ Marketing        │  │ Financial        │  │ Risk          │  │
│  │ Agent            │  │ Agent            │  │ Agent         │  │
│  │ • GTM strategy   │  │ • Projections    │  │ • Mitigation  │  │
│  │ • Pricing        │  │ • Code           │  │ • Compliance  │  │
│  │ • Acquisition    │  │   interpreter    │  │               │  │
│  └──────────────────┘  └──────────────────┘  └───────────────┘  │
│                                                                 │
│  ┌──────────────────┐                                           │
│  │ Appendix Agent   │                                           │
│  │ • Citations      │                                           │
│  │ • Supporting     │                                           │
│  │   documents      │                                           │
│  └──────────────────┘                                           │
│                                                                 │
│  All agents run concurrently via Python asyncio → 3-4x speedup  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 3: REVIEW & QA                        │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Quality Assurance Agent (OpenAI GPT-4)                │     │
│  │  • Scores each section 0-10 (completeness, accuracy)   │     │
│  │  • Identifies gaps and inconsistencies                 │     │
│  │  • Triggers regeneration for scores < 7                │     │
│  │  • JSON Schema validation via Pydantic                 │     │
│  └────────────────────────────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 COMPREHENSIVE BUSINESS PLAN OUTPUT              │
│  • Executive Summary  • Market Analysis  • Operations Plan      │
│  • Marketing Strategy • Financial Projections • Risk Assessment │
│  • Appendix with Citations                                      │
│  Generated in < 60 seconds with citation-rich content           │
└─────────────────────────────────────────────────────────────────┘`}
                </pre>
              </div>
              <div className="mt-4 text-sm text-text-3 space-y-2">
                <p>
                  <strong className="text-text-2">Performance:</strong> Parallel
                  execution via asyncio achieves 3-4x speedup over sequential
                  processing. 7 agents run concurrently, reducing total
                  generation time from ~3-4 minutes to under 60 seconds.
                </p>
                <p>
                  <strong className="text-text-2">Quality:</strong> Automated QA
                  agent scores each section 0-10, triggers regeneration for
                  scores below 7, and validates JSON Schema compliance before
                  final delivery.
                </p>
                <p>
                  <strong className="text-text-2">Integration:</strong> Web
                  search (Tavily API) for market research, code interpreter for
                  financial calculations, FastAPI backend with Next.js 15
                  frontend.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <Icon
                    className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-text-1 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-2">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seven Specialized Agents */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Seven Specialized Agents
          </h2>
          <p className="text-text-2 mb-6">
            Each agent focuses on a specific business plan section, running in
            parallel for maximum efficiency:
          </p>
          <div className="space-y-4">
            {sevenAgents.map((agent, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                    <span className="text-brand-primary font-bold text-sm">
                      {idx + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-1 mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-text-2 text-sm">{agent.description}</p>
                </div>
              </div>
            ))}
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
                  <strong>FastAPI</strong> backend with async/await patterns
                  enables high-concurrency agent orchestration.{" "}
                  <strong>Python asyncio</strong> manages parallel execution of
                  7 specialized sub-agents. <strong>OpenAI GPT-4</strong> with
                  function calling provides agent intelligence and tool use (web
                  search, code interpreter). <strong>Pydantic models</strong>{" "}
                  enforce JSON Schema validation for structured output.
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
                  <strong>Next.js 15</strong> frontend with TypeScript for type
                  safety. Business plan input forms with validation and
                  user-friendly error handling. Real-time progress indicators
                  during generation. Responsive design for mobile and desktop
                  access.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-1 mb-3 flex items-center gap-2">
                <Network aria-hidden="true" className="w-5 h-5" />
                AI Integration
              </h3>
              <div className="pl-7 space-y-2 text-text-2">
                <p>
                  <strong>OpenAI GPT-4</strong> for agent intelligence with
                  function calling. <strong>Tavily API</strong> for web search
                  and market research. <strong>Code interpreter tools</strong>{" "}
                  for financial calculations and projections.{" "}
                  <strong>Three-phase workflow</strong> ensures quality:
                  clarification, parallel generation, and review.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-1 mb-3 flex items-center gap-2">
                <FileSearch aria-hidden="true" className="w-5 h-5" />
                Deployment & Infrastructure
              </h3>
              <div className="pl-7 space-y-2 text-text-2">
                <p>
                  <strong>Azure Container Apps</strong> deployment with
                  auto-scaling capabilities.{" "}
                  <strong>FastAPI documentation</strong> endpoint provides
                  interactive API exploration.{" "}
                  <strong>Production validation</strong> by North Glass LLC
                  demonstrates real-world business value.
                </p>
              </div>
            </div>
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

        {/* Results & Impact */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Results & Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                3-4x
              </div>
              <div className="text-text-2 text-sm">
                Speedup vs Sequential Processing
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                &lt;60s
              </div>
              <div className="text-text-2 text-sm">Total Generation Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                7
              </div>
              <div className="text-text-2 text-sm">Specialized Sub-Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                100%
              </div>
              <div className="text-text-2 text-sm">Production Validation</div>
            </div>
          </div>
        </div>

        {/* Acknowledgment Section */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Acknowledgment
          </h2>
          <div className="text-text-2 leading-relaxed space-y-4">
            <p>
              This project was developed during my time at Elon University as
              part of their AI initiative, which includes several innovative
              projects:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <Link
                  href="/projects/elon-ai"
                  className="underline hover:text-text-1"
                >
                  <strong>Elon AI Platform</strong>
                </Link>{" "}
                - Live TUEL AI deployment
              </li>
              <li>
                <strong>Elon AI Agent</strong> - Business Plan Generator (this
                project)
              </li>
              <li>
                <Link
                  href="/projects/elon-ai-toolbox"
                  className="underline hover:text-text-1"
                >
                  <strong>AI Toolbox</strong>
                </Link>{" "}
                - Comprehensive AI tools catalog
              </li>
              <li>
                <a
                  href="https://www.elon.edu/u/ai/elongpt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-text-1"
                >
                  <strong>ElonGPT</strong>
                </a>{" "}
                - University information assistant
              </li>
              <li>
                <Link
                  href="/projects/lsb-ai-studio"
                  className="underline hover:text-text-1"
                >
                  <strong>LSB Applied AI Studio</strong>
                </Link>{" "}
                - Business AI education platform
              </li>
            </ul>
            <p>
              All projects are delivered for Elon University and are maintained
              in private repositories for institutional/client IP.
            </p>
            <p>
              I&apos;m grateful for the opportunity to work on these innovative
              AI solutions and showcase the technical approaches through this
              portfolio while respecting the university&apos;s ownership and
              privacy requirements.
            </p>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
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
