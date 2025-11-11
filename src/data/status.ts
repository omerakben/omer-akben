export type Persona = "recruiters" | "engineers" | "curious";

export interface Capability {
  id: string;
  title: string;
  summary: string;
  badge?: string;
  link?: string;
}

export interface MetricBadge {
  label: string;
  value: string;
  tooltip?: string;
}

export interface Milestone {
  date: string;
  title: string;
  details: string[];
}

export interface Roadmap {
  now: string[];
  next: string[];
  later: string[];
}

export interface Lesson {
  date: string;
  note: string;
}

export interface HowToUse {
  persona: Persona;
  prompts: string[];
}

export interface SpotlightLink {
  label: string;
  href: string;
}

export interface Spotlight {
  id: string;
  title: string;
  summary: string;
  badge?: string;
  details: string[];
  link?: SpotlightLink;
}

export interface StatusData {
  hero: {
    title: string;
    subtitle: string;
    ctas: {
      chatHref: string;
      resumeHref: string;
    };
  };
  mission: string;
  vision: string;
  capabilities: Capability[];
  metrics: MetricBadge[];
  milestones: Milestone[];
  roadmap: Roadmap;
  lessons: Lesson[];
  howToUse: HowToUse[];
  spotlights: Spotlight[];
}

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
      summary: "10 projects, skills matrix, journey timeline, credentials",
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
      summary: "856 tests, 0 TS errors, 6 automated gates in CI/CD",
      badge: "Live",
    },
    {
      id: "performance",
      title: "Performance",
      summary: "7.73KB homepage, 90% bundle reduction, sub-second loads",
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
      date: "2025-11-10",
      title: "Skills Agent & Auto-Merge Workflow",
      details: [
        "Implemented specialized Skills Agent for technical inquiries",
        "Automated PR merging with quality gate enforcement",
        "XAI API key integration in CI/CD pipeline",
      ],
    },
    {
      date: "2025-11-09",
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
