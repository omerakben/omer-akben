/**
 * Status Page Data Configuration
 *
 * Centralized data source for the /status page including hero content, capabilities,
 * metrics, milestones, roadmap, lessons learned, and feature spotlights.
 *
 * @module data/status
 *
 * @example
 * ```tsx
 * import { statusData } from '@/data/status';
 *
 * // Access hero content
 * const { title, subtitle, ctas } = statusData.hero;
 *
 * // Access capabilities
 * statusData.capabilities.map(cap => <CapabilityCard {...cap} />);
 * ```
 */

/**
 * Persona types for contextual content targeting
 */
export type Persona = "recruiters" | "engineers" | "curious";

/**
 * Capability card data structure
 */
export interface Capability {
  /** Unique identifier for the capability */
  id: string;
  /** Display title */
  title: string;
  /** Brief description */
  summary: string;
  /** Optional badge text (e.g., "MVP", "New", "Live") */
  badge?: string;
  /** Optional navigation link */
  link?: string;
}

/**
 * Metric badge data structure
 */
export interface MetricBadge {
  /** Metric label (e.g., "Deploy", "Commit") */
  label: string;
  /** Metric value (can be enriched at runtime) */
  value: string;
  /** Optional tooltip text for additional context */
  tooltip?: string;
}

/**
 * Milestone data structure
 */
export interface Milestone {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Milestone title */
  title: string;
  /** Array of detail strings describing accomplishments */
  details: string[];
}

/**
 * Roadmap data structure with three phases
 */
export interface Roadmap {
  /** Current focus items */
  now: string[];
  /** Upcoming planned items */
  next: string[];
  /** Future vision items */
  later: string[];
}

/**
 * Lesson learned data structure
 */
export interface Lesson {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Observation or insight note */
  note: string;
}

/**
 * How-to-use prompt block for specific persona
 */
export interface HowToUse {
  /** Target persona */
  persona: Persona;
  /** Array of suggested prompts for this persona */
  prompts: string[];
}

/**
 * Spotlight feature link
 */
export interface SpotlightLink {
  /** Link label text */
  label: string;
  /** URL to navigate to */
  href: string;
}

/**
 * Feature spotlight data structure
 */
export interface Spotlight {
  /** Unique identifier for the spotlight */
  id: string;
  /** Feature title */
  title: string;
  /** Brief summary */
  summary: string;
  /** Optional badge text (e.g., "New", "Beta") */
  badge?: string;
  /** Array of detail strings */
  details: string[];
  /** Optional navigation link */
  link?: SpotlightLink;
}

/**
 * Complete status page data structure
 */
export interface StatusData {
  /** Hero section content */
  hero: {
    /** Main heading */
    title: string;
    /** Subtitle description */
    subtitle: string;
    /** Call-to-action URLs */
    ctas: {
      /** URL to open chat */
      chatHref: string;
      /** URL to download resume */
      resumeHref: string;
    };
  };
  /** Mission statement */
  mission: string;
  /** Vision statement */
  vision: string;
  /** Array of capability cards */
  capabilities: Capability[];
  /** Array of metric badges (values can be enriched at runtime) */
  metrics: MetricBadge[];
  /** Array of chronological milestones */
  milestones: Milestone[];
  /** Three-phase roadmap */
  roadmap: Roadmap;
  /** Array of lessons learned */
  lessons: Lesson[];
  /** Persona-specific how-to-use blocks */
  howToUse: HowToUse[];
  /** Array of feature spotlights */
  spotlights: Spotlight[];
}

/**
 * Status page data singleton
 *
 * This object serves as the single source of truth for all status page content.
 * Metrics with placeholder values (e.g., "__BUILD_DATE__") are enriched at runtime
 * by the enrichMetrics() utility function.
 */
export const statusData: StatusData = {
  hero: {
    title: "Live Status & Roadmap",
    subtitle:
      "This portfolio is a production MVP - fully usable today and improved continuously. Here's what's live, what just shipped, and what's next.",
    ctas: {
      chatHref: "/?openChat=1",
      resumeHref: "/assets/Omer_Akben_Resume.pdf",
    },
  },
  mission:
    "Build a transparent, production-grade AI portfolio that demonstrates real engineering: measurable performance, strong quality gates, and an agentic assistant that can pre-screen and guide visitors.",
  vision:
    "A personal AI platform that clones my knowledge, answers domain questions, and helps recruiters and collaborators move faster with trustworthy context.",
  capabilities: [
    {
      id: "portfolio",
      title: "Portfolio Core",
      summary: "13 projects, skills matrix, journey timeline, credentials",
      badge: "MVP",
      link: "/projects",
    },
    {
      id: "brightness",
      title: "8-Mode Brightness System",
      summary: "Auto + manual modes with AA contrast across all modes",
      badge: "MVP",
      link: "/",
    },
    {
      id: "agentic",
      title: "AI Assistant (Ozzy)",
      summary: "12 tools, episodic memory, proactive engagement",
      badge: "MVP",
      link: "/",
    },
    {
      id: "sidebar-pin",
      title: "Pinned Sidebar Assistant",
      summary: "Desktop visitors can pin Ozzy (320-800px) and keep browsing without overlap.",
      badge: "New",
      link: "/status#sidebar-pin",
    },
    {
      id: "tools",
      title: "Server-Side Tools",
      summary: "Resume downloads, project navigation, contact collection",
      badge: "Live",
    },
    {
      id: "memory",
      title: "Memory Systems",
      summary: "Vector search (Upstash), semantic memory, thread persistence",
      badge: "Live",
    },
    {
      id: "quality",
      title: "Quality Gates",
      summary: "813 tests (813 passing), 0 TS errors, 6 automated gates in CI/CD",
      badge: "Live",
    },
    {
      id: "performance",
      title: "Performance",
      summary: "7.19KB homepage, 90% bundle reduction, sub-second loads",
      badge: "Live",
    },
    {
      id: "accessibility",
      title: "Accessibility",
      summary: "WCAG 2A compliant, keyboard nav, screen reader support",
      badge: "Live",
    },
  ],
  metrics: [
    {
      label: "Deploy",
      value: "__BUILD_DATE__",
      tooltip: "Server build timestamp",
    },
    {
      label: "Commit",
      value: "__GIT_SHA__",
      tooltip: "Current commit (short SHA)",
    },
    {
      label: "Perf Snapshot",
      value: "__PERF_SCORE__",
      tooltip: "Recent lab run / score",
    },
    {
      label: "Routes a11y",
      value: "8/8",
      tooltip: "Routes checked for WCAG AA",
    },
  ],
  milestones: [
    {
      date: "2026-02-03",
      title: "Elon AI Case Study + Resume Refresh",
      details: [
        "Launched dedicated Elon AI case study with flagship visuals and outcomes",
        "Refreshed resume, role narrative, and flagship TUEL AI positioning",
        "Added updated LinkedIn recommendations to homepage testimonials",
      ],
    },
    {
      date: "2025-11-10",
      title: "Skills Agent & Auto-Merge Workflow",
      details: [
        "Implemented specialized Skills Agent for technical inquiries",
        "Automated PR merging with quality gate enforcement",
        "XAI API key integration in CI/CD pipeline",
      ],
    },
    {
      date: "2025-11-07",
      title: "XAI Grok Migration for Follow-ups",
      details: [
        "Migrated follow-up generation to grok-2-1212 primary",
        "GPT-4o-mini fallback for reliability",
        "A/B testing infrastructure",
      ],
    },
    {
      date: "2025-11-07",
      title: "Contact Collection v2",
      details: [
        "Email delivery via Resend provider",
        "Disposable email guard",
        "5/IP/24h rate limits",
      ],
    },
    {
      date: "2025-11-06",
      title: "UI Improvements & AI Tool Descriptions",
      details: [
        "Enhanced tool descriptions for better UX",
        "Improved visual hierarchy",
        "Accessibility refinements",
      ],
    },
  ],
  roadmap: {
    now: [
      "Ongoing case study polish for Elon AI + TUEL AI (metrics, visuals, recruiter-ready narrative)",
      "Sustained testimonial refresh with verified LinkedIn recommendations",
      "Pre-screen flow: \"Ask Ozzy 10 recruiter questions\" (one click)",
      "Perf snapshot card using server tool to collect metrics",
      "Richer summaries based on curated knowledge snippets",
    ],
    next: [
      '\"Upload JD -> tailored pitch\" flow in chat',
      "Shareable conversation link for recruiters",
      "Project spotlight cards with outcomes + links",
    ],
    later: [
      "Multi-agent research -> summary -> email draft pipeline",
      "Private recruiter portal with structured notes/downloads",
    ],
  },
  lessons: [
    {
      date: "2025-11-09",
      note: "XAI Grok models show 40% faster response times vs GPT-4o-mini for follow-ups",
    },
    {
      date: "2025-11-07",
      note: "Raised contact rate limit to handle real sharing behavior (3->5 per 24h)",
    },
    {
      date: "2025-11-06",
      note: "Pinned desktop sidebar keeps recruiters in-context while scrolling long pages (20% longer sessions).",
    },
    {
      date: "2025-10-21",
      note: "Axe scans need hydration-aware waits to avoid false fails in E2E tests",
    },
    {
      date: "2025-10-15",
      note: "WIP modal is useful when it is honest and non-blocking",
    },
  ],
  howToUse: [
    {
      persona: "recruiters",
      prompts: [
        "Give me a 60-second pitch for a Cloud/AI Solution Engineer role.",
        "Link your best 3 projects for enterprise AI + full-stack outcomes.",
        "Pin Ozzy on desktop and narrate the Projects page while I skim.",
        "Show work authorization summary and provide the one-pager resume.",
      ],
    },
    {
      persona: "engineers",
      prompts: [
        "Open the repo and summarize the app architecture & stack.",
        "List the server tools available and what each can do.",
        "Summarize the performance strategy and size budgets.",
        "When pinned, explain how layout shift margins keep content visible.",
      ],
    },
    {
      persona: "curious",
      prompts: [
        "What makes the brightness control unique across the site?",
        "Explain what \"agentic AI\" means here with examples.",
        "What's shipping next month and why should I check back?",
      ],
    },
  ],
  spotlights: [
    {
      id: "sidebar-pin",
      title: "Pinned Ozzy Sidebar",
      summary: "Desktop visitors can lock Ozzy to the right edge, keep the main layout scrollable, and resize between 320-800px without covering content.",
      badge: "New",
      details: [
        "Automatic content margin + hydration-safe layout adjustments",
        "Local persistence remembers pin + width per device",
        "Keyboard shortcut Cmd/Ctrl + Shift + N opens a fresh pinned chat",
      ],
      link: {
        label: "See pinning guidance",
        href: "/status#sidebar-pin",
      },
    },
  ],
};
