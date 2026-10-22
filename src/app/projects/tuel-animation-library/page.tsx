import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import { Github } from "@/components/brand-icons";
import {
  ArrowLeft,
  Box,
  Briefcase,
  CheckCircle2,
  Code,
  Cog,
  ExternalLink,
  Eye,
  FileText,
  Layers,
  Package,
  Palette,
  Rocket,
  ShoppingCart,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "Tuel - Professional React Animation Library | Omer Akben",
  description:
    "Open-source React animation library with 13 specialized NPM packages (@tuel/*). Features scroll animations, interactive galleries, Three.js integration. Built with TypeScript, Turborepo, Vitest, Playwright. Live demo + comprehensive documentation.",
  path: "/projects/tuel-animation-library",
});

export default function TuelAnimationLibraryPage() {
  const project = getProjectBySlug("tuel-animation-library");

  if (!project) {
    notFound();
  }

  const packageCategories = [
    {
      icon: Layers,
      title: "Core Animation",
      packages: [
        {
          name: "@tuel/motion",
          size: "6.9kb",
          desc: "Framer Motion primitives",
        },
        {
          name: "@tuel/scroll",
          size: "37.7kb",
          desc: "Scroll-triggered effects",
        },
        {
          name: "@tuel/gallery",
          size: "49.9kb",
          desc: "Image/video galleries",
        },
      ],
    },
    {
      icon: Zap,
      title: "Effects & Interaction",
      packages: [
        {
          name: "@tuel/text-effects",
          size: "7.2kb",
          desc: "Typography animations",
        },
        {
          name: "@tuel/interaction",
          size: "6.0kb",
          desc: "Mouse/cursor effects",
        },
        { name: "@tuel/ui", size: "6.0kb", desc: "Pre-built components" },
      ],
    },
    {
      icon: Box,
      title: "Advanced Integration",
      packages: [
        { name: "@tuel/gsap", size: "1.8kb", desc: "GSAP utilities" },
        { name: "@tuel/three", size: "4.5kb", desc: "Three.js components" },
      ],
    },
    {
      icon: Cog,
      title: "Foundation",
      packages: [
        {
          name: "@tuel/performance",
          size: "6.4kb",
          desc: "Optimization hooks",
        },
        { name: "@tuel/state", size: "6.0kb", desc: "Animation lifecycle" },
        { name: "@tuel/config", size: "2.0kb", desc: "Theme system" },
        { name: "@tuel/tokens", size: "4.8kb", desc: "Design tokens" },
        { name: "@tuel/utils", size: "1.4kb", desc: "Core utilities" },
      ],
    },
  ];

  const useCases = [
    {
      icon: ShoppingCart,
      title: "E-commerce Product Pages",
      description:
        "Smooth scroll reveals for product features, image galleries with lightbox, magnetic cursor effects on CTAs, parallax backgrounds for immersive shopping experiences.",
    },
    {
      icon: Rocket,
      title: "SaaS Landing Pages",
      description:
        "Horizontal scroll sections for feature showcases, animated hero text with split effects, sticky cards for pricing tiers, scroll-triggered animations that guide users through value propositions.",
    },
    {
      icon: Briefcase,
      title: "Portfolio Websites",
      description:
        "Interactive project showcases with image trails, 3D floating objects for visual interest, morphing shapes for section transitions, video galleries with custom controls.",
    },
    {
      icon: TrendingUp,
      title: "Marketing Sites",
      description:
        "Scroll minimap for intuitive navigation, parallax backgrounds creating depth, animated statistics counters, smooth page transitions, interactive hero sections.",
    },
    {
      icon: Palette,
      title: "Design Systems",
      description:
        "Pre-built UI components for consistent motion design, animation tokens for design-developer handoff, theme system for brand-aligned animations across products.",
    },
    {
      icon: Code,
      title: "Developer Tools",
      description:
        "Documentation sites with syntax-highlighted code blocks, interactive demos showing component behavior, smooth navigation transitions, accessible keyboard shortcuts.",
    },
  ];

  const technicalSections = [
    {
      title: "Monorepo Architecture",
      description:
        "Turborepo manages 13 packages with pnpm workspaces for efficient dependency sharing. Changesets automate versioning and changelog generation. GitHub Actions CI/CD publishes to npm on every release with automated testing and build validation.",
      technologies: ["Turborepo", "pnpm", "Changesets", "GitHub Actions"],
    },
    {
      title: "Package Development",
      description:
        "TypeScript strict mode with tsup for ESM/CJS builds. Framer Motion, GSAP, Three.js as peer dependencies to reduce bundle size. React 19 + Next.js 15 compatibility. Tailwind CSS integration for styling utilities.",
      technologies: [
        "TypeScript",
        "tsup",
        "Framer Motion",
        "GSAP",
        "Three.js",
        "React 19",
      ],
    },
    {
      title: "Quality Assurance",
      description:
        "Expanding test coverage from 5% to 80%+ with Vitest (unit) and Playwright (E2E). ESLint + Prettier for code consistency. Manual security audits fixing 9 XSS vulnerabilities and memory leaks. Zero TypeScript errors with strict mode enabled.",
      technologies: ["Vitest", "Playwright", "ESLint", "Prettier"],
    },
  ];

  const roadmapPhases = [
    {
      phase: 1,
      title: "Monorepo Setup",
      status: "completed",
      date: "Dec 2024",
    },
    {
      phase: 2,
      title: "Core Package Development",
      status: "completed",
      date: "Dec 2024",
    },
    {
      phase: 3,
      title: "NPM Publishing (v0.2.0)",
      status: "completed",
      date: "Jan 2025",
    },
    {
      phase: 4,
      title: "Documentation Site",
      status: "in-progress",
      date: "Feb 2025",
    },
    {
      phase: 5,
      title: "Security Hardening (9 XSS fixes)",
      status: "in-progress",
      date: "Mar 2025",
    },
    {
      phase: 6,
      title: "Test Coverage Expansion (80%+)",
      status: "planned",
      date: "Apr 2025",
    },
    {
      phase: 7,
      title: "API Documentation Completion",
      status: "planned",
      date: "May 2025",
    },
    {
      phase: 8,
      title: "Bundle Size Optimization (<100kb)",
      status: "planned",
      date: "May 2025",
    },
    {
      phase: 9,
      title: "WCAG AA Compliance",
      status: "planned",
      date: "Jun 2025",
    },
    {
      phase: 10,
      title: "v2.0.0 Production Release",
      status: "planned",
      date: "Jun 2025",
    },
  ];

  const liveResources = [
    {
      title: "Live Demo",
      subtitle: "Interactive component showcase",
      url: "https://tuel.vercel.app",
      icon: ExternalLink,
    },
    {
      title: "NPM Packages",
      subtitle: "13 published packages (@tuel/*)",
      url: "https://www.npmjs.com/search?q=%40tuel",
      icon: Package,
    },
    {
      title: "Documentation",
      subtitle: "API reference + usage guides",
      url: "https://tuel-lib.vercel.app",
      icon: FileText,
    },
    {
      title: "GitHub Repository",
      subtitle: "Source code + contribution guide",
      url: "https://github.com/omerakben/tuel",
      icon: Github,
    },
  ];

  const metrics = [
    {
      value: "13",
      label: "NPM Packages",
      sublabel: "Modular architecture",
    },
    {
      value: "v0.2.0",
      label: "Current Version",
      sublabel: "Alpha release (Jan 2025)",
    },
    {
      value: "5% → 80%",
      label: "Test Coverage Goal",
      sublabel: "Vitest + Playwright",
    },
    {
      value: "Jun 2025",
      label: "v2.0.0 Target",
      sublabel: "Production-ready",
    },
  ];

  const whyValuable = [
    {
      title: "Zero Config Defaults",
      description:
        "Beautiful animations out of the box with sensible defaults. Customize only when needed. Every component works immediately after installation—no configuration hell.",
    },
    {
      title: "Production-Grade Quality",
      description:
        "SSR-safe, accessible (WCAG AA goal), performant (60fps GPU acceleration). Built for real applications with features like prefers-reduced-motion support and keyboard navigation.",
    },
    {
      title: "Modular Architecture",
      description:
        "13 specialized packages—install only what you need. Tree-shakeable bundles ensure minimal impact on bundle size. Perfect for performance-conscious teams.",
    },
    {
      title: "Developer Experience",
      description:
        "Full TypeScript support with strict mode. Comprehensive documentation with interactive examples. Monorepo managed with Turborepo for fast builds and caching.",
    },
    {
      title: "Open Source Commitment",
      description:
        "MIT licensed with public roadmap transparency. Active development toward v2.0.0 with 80%+ test coverage goal. Community-driven with contribution guidelines.",
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
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              In Progress
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              Featured
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
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
            <Button asChild variant="outline" size="lg">
              <a
                href="https://www.npmjs.com/search?q=%40tuel"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Package aria-hidden="true" className="w-4 h-4" />
                NPM Packages
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://tuel-lib.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText aria-hidden="true" className="w-4 h-4" />
                Documentation
              </a>
            </Button>
          </div>
        </div>

        {/* The Challenge */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Challenge</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            React developers face a dilemma: CSS transitions are too basic for
            modern UX expectations, but mastering raw animation libraries
            (Framer Motion, GSAP, Three.js) requires deep expertise and
            significant time investment. Existing solutions lack
            production-ready defaults, SSR safety, and accessibility features
            built-in.
          </p>
          <p className="text-text-2 leading-relaxed">
            The challenge was to create a{" "}
            <strong className="text-text-1">modular animation library</strong>{" "}
            that delivers professional motion design without requiring animation
            expertise—while remaining tree-shakeable, accessible (WCAG AA
            compliant), and performant (60fps GPU-accelerated) for production
            applications.
          </p>
        </div>

        {/* The Solution */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Solution</h2>
          <p className="text-text-2 leading-relaxed mb-4">
            I developed <strong className="text-text-1">Tuel</strong>, an
            open-source React animation library that bridges the gap with 13
            specialized NPM packages (@tuel/*) providing zero-config defaults,
            SSR-safe components, and accessibility built-in. The monorepo
            architecture (Turborepo + pnpm workspaces) manages packages covering
            motion primitives, scroll effects, galleries, text animations,
            GSAP/Three.js integration, and performance utilities.
          </p>
          <p className="text-text-2 leading-relaxed">
            Published to npm with automated Changesets versioning and GitHub
            Actions CI/CD, Tuel is currently at{" "}
            <strong className="text-text-1">v0.2.0 (alpha)</strong> with active
            development toward v2.0.0 production release. The roadmap includes
            expanding test coverage from 5% to 80%+, fixing 9 XSS
            vulnerabilities, completing comprehensive documentation, and
            achieving WCAG AA compliance by June 2025.
          </p>
        </div>

        {/* Package Ecosystem Grid */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Package Ecosystem (13 Packages)
          </h2>
          <div className="space-y-6">
            {packageCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                      <Icon
                        aria-hidden="true"
                        className="w-5 h-5 text-brand-primary"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-text-1">
                      {category.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-13">
                    {category.packages.map((pkg, pkgIdx) => (
                      <div
                        key={pkgIdx}
                        className="flex items-center justify-between p-3 bg-surf-2 border border-border-line rounded-lg"
                      >
                        <div>
                          <code className="text-sm text-brand-primary font-mono">
                            {pkg.name}
                          </code>
                          <p className="text-text-3 text-xs mt-1">{pkg.desc}</p>
                        </div>
                        <span className="text-text-3 text-xs font-medium">
                          {pkg.size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
                Eliminate animation complexity for React developers by providing
                professional-grade, production-ready animation components that
                &quot;just work&quot;—no animation expertise required. Stop the
                choice between basic CSS transitions and mastering complex
                animation frameworks.
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
                Become the go-to animation library for React teams shipping
                polished user experiences, bridging the gap between design
                ambition and developer productivity. Scale from indie developers
                to enterprise teams with consistent motion design patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Why Tuel Stands Out */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Why Tuel Stands Out
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

        {/* Technical Implementation */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Technical Implementation
          </h2>
          <div className="space-y-4">
            {technicalSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-bold text-text-1 mb-2">
                  {section.title}
                </h3>
                <p className="text-text-2 mb-2">{section.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {section.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Roadmap */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Development Roadmap (v0.2.0 → v2.0.0)
          </h2>
          <div className="space-y-4">
            {roadmapPhases.map((phase) => {
              const statusColor =
                phase.status === "completed"
                  ? "text-green-400"
                  : phase.status === "in-progress"
                    ? "text-yellow-400"
                    : "text-text-3";
              const statusBg =
                phase.status === "completed"
                  ? "bg-green-500/10 border-green-500/20"
                  : phase.status === "in-progress"
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-surf-2 border-border-line";

              return (
                <div key={phase.phase} className="flex gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${statusColor}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-text-1">
                        Phase {phase.phase}: {phase.title}
                      </strong>
                      <span
                        className={`px-2 py-0.5 rounded text-xs border ${statusBg} ${statusColor}`}
                      >
                        {phase.status}
                      </span>
                      <span className="text-text-3 text-sm">{phase.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Resources */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Live Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-surf-2 border border-border-line rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                      <Icon
                        aria-hidden="true"
                        className="w-5 h-5 text-brand-primary"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-1">
                        {resource.title}
                      </h3>
                      <p className="text-text-3 text-sm">{resource.subtitle}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results & Impact */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Results & Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-surf-2 border border-border-line rounded-lg p-6"
              >
                <div className="text-3xl font-bold text-brand-primary mb-2">
                  {metric.value}
                </div>
                <div className="text-text-1 font-medium">{metric.label}</div>
                <div className="text-text-3 text-sm mt-1">
                  {metric.sublabel}
                </div>
              </div>
            ))}
          </div>

          <p className="text-text-2 mt-6 leading-relaxed">
            Tuel demonstrates end-to-end open-source project ownership with a
            focus on{" "}
            <strong className="text-text-1">developer experience</strong>,{" "}
            <strong className="text-text-1">modular architecture</strong>, and{" "}
            <strong className="text-text-1">production-grade quality</strong>.
            The monorepo structure (Turborepo + pnpm) with automated publishing
            (Changesets + GitHub Actions) showcases modern tooling expertise.
            Active development toward v2.0.0 with 80%+ test coverage, security
            hardening, and WCAG AA compliance demonstrates commitment to
            enterprise-ready open-source software.
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
