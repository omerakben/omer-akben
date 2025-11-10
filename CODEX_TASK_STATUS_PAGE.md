# CODEX AUTONOMOUS TASK: /status Page & WIP Banner Production Implementation

**Task ID:** STATUS-PAGE-V2-20251110
**Priority:** HIGH
**Quality Standard:** A++ • Zero Tolerance Policy
**Estimated Complexity:** Medium (6-8 hours)
**Risk Level:** Low-Medium (well-defined, clear patterns)

---

## 🎯 MISSION OBJECTIVE

Transform the existing basic `/status` page and WIP banner into a production-grade, data-driven system that:

1. Shows live deployment metrics (git SHA, build date, performance)
2. Provides persona-specific content (recruiters/engineers/curious)
3. Implements SHA-keyed banner persistence (re-shows on new deploys)
4. Tracks analytics for all user interactions
5. Maintains WCAG 2A accessibility across all 8 brightness modes
6. Passes all 6 quality gates with zero errors

---

## 📊 VERIFIED PROJECT STATE (AS OF 2025-11-10)

### Current Metrics

```yaml
git_sha: bda9c6b
build_date: "2025-11-10 09:42:57 UTC"
branch: pre-deployment
tests_unit: 856 (855 passing + 1 skip)
tests_e2e: pending_verification
bundle_homepage: 7.73 KB / 40 KB limit ✅
ai_tools_count: 12 (NOT 11 as docs state)
tech_stack:
  nextjs: 15.5.4
  react: 19.1.0
  typescript: 5
  tailwind: 4
  vitest: 3.2.4
  playwright: 1.56.1
```

### Existing Files (DON'T DELETE)

```
✅ src/app/status/page.tsx (158 lines) - REFACTOR, don't delete
✅ src/components/wip-banner.tsx (46 lines) - ENHANCE, don't delete
✅ src/lib/wip-context.tsx (101 lines) - MODIFY for SHA-awareness
✅ src/components/ui/banner.tsx (84 lines) - KEEP as-is
✅ src/components/wip-banner.test.tsx (270 lines) - EXPAND tests
```

---

## 🏗️ IMPLEMENTATION PHASES (EXECUTE IN ORDER)

## PHASE 1: Foundation & Data Layer

### 1.1 Create `src/data/status.ts`

**Purpose:** Single source of truth for all status page content

**Implementation:**

```typescript
// src/data/status.ts
export type Persona = 'recruiters' | 'engineers' | 'curious';

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
  date: string; // ISO (yyyy-mm-dd)
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
}

export const statusData: StatusData = {
  hero: {
    title: 'Live Status & Roadmap',
    subtitle:
      'This portfolio is a production MVP—fully usable today and improved continuously. Here's what's live, what just shipped, and what's next.',
    ctas: {
      chatHref: '/?openChat=1',
      resumeHref: '/assets/Omer_Akben_Resume.pdf'
    }
  },
  mission:
    'Build a transparent, production-grade AI portfolio that demonstrates real engineering: measurable performance, strong quality gates, and an agentic assistant that can pre-screen and guide visitors.',
  vision:
    'A personal AI platform that clones my knowledge, answers domain questions, and helps recruiters and collaborators move faster with trustworthy context.',
  capabilities: [
    {
      id: 'portfolio',
      title: 'Portfolio Core',
      summary: '10 projects, skills matrix, journey timeline, credentials',
      badge: 'MVP',
      link: '/projects'
    },
    {
      id: 'brightness',
      title: '8-Mode Brightness System',
      summary: 'Auto + manual modes with AA contrast across all modes',
      badge: 'MVP',
      link: '/'
    },
    {
      id: 'agentic',
      title: 'AI Assistant (Ozzy)',
      summary: '12 tools, episodic memory, proactive engagement',
      badge: 'MVP',
      link: '/'
    },
    {
      id: 'tools',
      title: 'Server-Side Tools',
      summary: 'Resume downloads, project navigation, contact collection',
      badge: 'Live'
    },
    {
      id: 'memory',
      title: 'Memory Systems',
      summary: 'Vector search (Upstash), semantic memory, thread persistence',
      badge: 'Live'
    },
    {
      id: 'quality',
      title: 'Quality Gates',
      summary: '856 tests, 0 TS errors, 6 automated gates in CI/CD',
      badge: 'Live'
    },
    {
      id: 'performance',
      title: 'Performance',
      summary: '7.73KB homepage, 90% bundle reduction, sub-second loads',
      badge: 'Live'
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      summary: 'WCAG 2A compliant, keyboard nav, screen reader support',
      badge: 'Live'
    }
  ],
  metrics: [
    {
      label: 'Deploy',
      value: '__BUILD_DATE__',
      tooltip: 'Server build timestamp'
    },
    {
      label: 'Commit',
      value: '__GIT_SHA__',
      tooltip: 'Current commit (short SHA)'
    },
    {
      label: 'Perf Snapshot',
      value: '__PERF_SCORE__',
      tooltip: 'Recent lab run / score'
    },
    {
      label: 'Routes a11y',
      value: '8/8',
      tooltip: 'Routes checked for WCAG AA'
    }
  ],
  milestones: [
    {
      date: '2025-11-10',
      title: 'Skills Agent & Auto-Merge Workflow',
      details: [
        'Implemented specialized Skills Agent for technical inquiries',
        'Automated PR merging with quality gate enforcement',
        'XAI API key integration in CI/CD pipeline'
      ]
    },
    {
      date: '2025-11-09',
      title: 'XAI Grok Migration for Follow-ups',
      details: [
        'Migrated follow-up generation to grok-2-1212 primary',
        'GPT-4o-mini fallback for reliability',
        'A/B testing infrastructure'
      ]
    },
    {
      date: '2025-11-07',
      title: 'Contact Collection v2',
      details: [
        'Email delivery via Resend provider',
        'Disposable email guard',
        '5/IP/24h rate limits'
      ]
    },
    {
      date: '2025-11-06',
      title: 'UI Improvements & AI Tool Descriptions',
      details: [
        'Enhanced tool descriptions for better UX',
        'Improved visual hierarchy',
        'Accessibility refinements'
      ]
    }
  ],
  roadmap: {
    now: [
      'Pre-screen flow: "Ask Ozzy 10 recruiter questions" (one click)',
      'Perf snapshot card using server tool to collect metrics',
      'Richer summaries based on curated knowledge snippets'
    ],
    next: [
      '"Upload JD → tailored pitch" flow in chat',
      'Shareable conversation link for recruiters',
      'Project spotlight cards with outcomes + links'
    ],
    later: [
      'Multi-agent research → summary → email draft pipeline',
      'Private recruiter portal with structured notes/downloads'
    ]
  },
  lessons: [
    {
      date: '2025-11-09',
      note: 'XAI Grok models show 40% faster response times vs GPT-4o-mini for follow-ups'
    },
    {
      date: '2025-11-07',
      note: 'Raised contact rate limit to handle real sharing behavior (3→5 per 24h)'
    },
    {
      date: '2025-10-21',
      note: 'Axe scans need hydration-aware waits to avoid false fails in E2E tests'
    },
    {
      date: '2025-10-15',
      note: 'WIP modal is useful when it is honest and non-blocking'
    }
  ],
  howToUse: [
    {
      persona: 'recruiters',
      prompts: [
        'Give me a 60-second pitch for a Cloud/AI Solution Engineer role.',
        'Link your best 3 projects for enterprise AI + full-stack outcomes.',
        'Show work authorization summary and provide the one-pager résumé.'
      ]
    },
    {
      persona: 'engineers',
      prompts: [
        'Open the repo and summarize the app architecture & stack.',
        'List the server tools available and what each can do.',
        'Summarize the performance strategy and size budgets.'
      ]
    },
    {
      persona: 'curious',
      prompts: [
        'What makes the brightness control unique across the site?',
        'Explain what "agentic AI" means here with examples.',
        'What's shipping next month and why should I check back?'
      ]
    }
  ]
};
```

**Validation:**

- All interfaces export correctly
- statusData matches StatusData type
- No TypeScript errors
- No hardcoded strings that should be dynamic

---

### 1.2 Create `src/lib/status/metrics.ts`

**Purpose:** Live metrics functions for build info and performance

**Implementation:**

```typescript
// src/lib/status/metrics.ts

export interface DeployInfo {
  sha: string;
  buildDate: string;
}

/**
 * Get current deployment information (git SHA and build timestamp)
 */
export function getDeployInfo(): DeployInfo {
  return {
    sha: process.env.NEXT_PUBLIC_GIT_SHA ?? 'local',
    buildDate: process.env.NEXT_PUBLIC_BUILD_DATE ?? 'dev'
  };
}

/**
 * Get performance snapshot from latest metrics
 * TODO: Wire up to actual performance tool/API in future
 */
export async function getPerfSnapshot(): Promise<string> {
  // Placeholder - will be wired to actual perf metrics later
  return 'n/a';
}

/**
 * Replace placeholder values in metrics array with live data
 */
export async function enrichMetrics(
  metrics: Array<{ label: string; value: string; tooltip?: string }>
): Promise<Array<{ label: string; value: string; tooltip?: string }>> {
  const info = getDeployInfo();
  const perf = await getPerfSnapshot();

  return metrics.map((m) => {
    if (m.label === 'Commit') {
      return { ...m, value: info.sha };
    }
    if (m.label === 'Deploy') {
      return { ...m, value: info.buildDate };
    }
    if (m.label === 'Perf Snapshot') {
      return { ...m, value: perf };
    }
    return m;
  });
}
```

**Validation:**

- Functions export correctly
- TypeScript types are strict (no `any`)
- Handles missing env vars gracefully

---

### 1.3 Update `next.config.ts` for build-time env vars

**Purpose:** Inject git SHA and build date at build time

**Implementation:**

```typescript
// next.config.ts
// Find the env section and ADD these entries:

env: {
  // ... existing env vars ...

  // Build-time deployment info (injected by Vercel automatically)
  NEXT_PUBLIC_GIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
                        process.env.NEXT_PUBLIC_GIT_SHA ||
                        'local',
  NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
},
```

**Alternative (if above doesn't work):**
Update `package.json` build script:

```json
"build": "NEXT_PUBLIC_GIT_SHA=$(git rev-parse --short HEAD) NEXT_PUBLIC_BUILD_DATE=\"$(date -u +'%Y-%m-%d %H:%M UTC')\" next build"
```

**Validation:**

- No build errors
- Env vars accessible in components
- Works on both local and Vercel deployments

---

### 1.4 Create `src/data/status.test.ts`

**Purpose:** Validate status data structure and types

**Implementation:**

```typescript
// src/data/status.test.ts
import { describe, it, expect } from 'vitest';
import { statusData, type StatusData, type Persona } from './status';

describe('statusData', () => {
  it('should have valid structure', () => {
    expect(statusData).toBeDefined();
    expect(statusData.hero).toBeDefined();
    expect(statusData.capabilities).toBeDefined();
    expect(statusData.metrics).toBeDefined();
    expect(statusData.milestones).toBeDefined();
    expect(statusData.roadmap).toBeDefined();
    expect(statusData.lessons).toBeDefined();
    expect(statusData.howToUse).toBeDefined();
  });

  it('should have valid hero with CTAs', () => {
    expect(statusData.hero.title).toBeTruthy();
    expect(statusData.hero.subtitle).toBeTruthy();
    expect(statusData.hero.ctas.chatHref).toBeTruthy();
    expect(statusData.hero.ctas.resumeHref).toBeTruthy();
  });

  it('should have at least 7 capabilities', () => {
    expect(statusData.capabilities.length).toBeGreaterThanOrEqual(7);
    statusData.capabilities.forEach((cap) => {
      expect(cap.id).toBeTruthy();
      expect(cap.title).toBeTruthy();
      expect(cap.summary).toBeTruthy();
    });
  });

  it('should have 4 metric badges', () => {
    expect(statusData.metrics).toHaveLength(4);
    statusData.metrics.forEach((metric) => {
      expect(metric.label).toBeTruthy();
      expect(metric.value).toBeTruthy();
    });
  });

  it('should have at least 3 milestones', () => {
    expect(statusData.milestones.length).toBeGreaterThanOrEqual(3);
    statusData.milestones.forEach((milestone) => {
      expect(milestone.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(milestone.title).toBeTruthy();
      expect(milestone.details.length).toBeGreaterThan(0);
    });
  });

  it('should have roadmap with now/next/later', () => {
    expect(statusData.roadmap.now.length).toBeGreaterThan(0);
    expect(statusData.roadmap.next.length).toBeGreaterThan(0);
    expect(statusData.roadmap.later.length).toBeGreaterThan(0);
  });

  it('should have lessons with dates', () => {
    expect(statusData.lessons.length).toBeGreaterThan(0);
    statusData.lessons.forEach((lesson) => {
      expect(lesson.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(lesson.note).toBeTruthy();
    });
  });

  it('should have howToUse for all 3 personas', () => {
    const personas: Persona[] = ['recruiters', 'engineers', 'curious'];
    personas.forEach((persona) => {
      const entry = statusData.howToUse.find((h) => h.persona === persona);
      expect(entry).toBeDefined();
      expect(entry!.prompts.length).toBeGreaterThan(0);
    });
  });
});
```

**Validation:**

- Run `npm test` - all tests pass
- No TypeScript errors

---

## PHASE 2: WIP Banner Enhancement

### 2.1 Update `src/components/wip-banner.tsx`

**Purpose:** SHA-keyed persistence, analytics, show on all pages except /status

**Implementation:**

```typescript
// src/components/wip-banner.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { posthog } from '@/lib/analytics/posthog-client';
import { cn } from '@/lib/utils';

export type WipBannerVariant = 'neutral' | 'playful';
export type WipBannerIcon = 'info' | 'egg';

interface WipBannerProps {
  variant?: WipBannerVariant;
  icon?: WipBannerIcon;
  statusHref?: string;
  versionKey: string;
}

export function WipBanner({
  variant = 'neutral',
  icon = 'info',
  statusHref = '/status',
  versionKey,
}: WipBannerProps) {
  const pathname = usePathname();
  const storageKey = useMemo(() => `wip-dismissed:${versionKey}`, [versionKey]);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Hide on /status page
  const shouldShow = pathname !== statusHref;

  useEffect(() => {
    setIsMounted(true);

    if (typeof window === 'undefined' || !shouldShow) {
      return;
    }

    try {
      const dismissed = localStorage.getItem(storageKey);
      if (!dismissed) {
        setIsVisible(true);
        // Track banner view
        posthog.capture('status_banner.view', {
          sha: versionKey,
          variant,
          icon,
          path: pathname,
        });
      }
    } catch (error) {
      console.error('[WIPBanner] Failed to load state:', error);
      setIsVisible(true); // Show by default on error
    }
  }, [storageKey, shouldShow, versionKey, variant, icon, pathname]);

  // Handle Escape key
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  if (!isMounted || !isVisible || !shouldShow) {
    return null;
  }

  const copy =
    variant === 'playful'
      ? {
          prefix: 'Still cooking.',
          main: 'Some features are in the pan.',
        }
      : {
          prefix: 'Site under active development.',
          main: 'Some features are still being built.',
        };

  const handleDismiss = () => {
    try {
      localStorage.setItem(storageKey, '1');
    } catch (error) {
      console.error('[WIPBanner] Failed to save state:', error);
    }
    setIsVisible(false);

    // Track dismissal
    posthog.capture('status_banner.dismiss', {
      sha: versionKey,
      variant,
      icon,
      path: pathname,
    });
  };

  const handleViewStatus = () => {
    try {
      localStorage.setItem(storageKey, '1');
    } catch (error) {
      console.error('[WIPBanner] Failed to save state:', error);
    }

    // Track click
    posthog.capture('status_banner.click_view_status', {
      sha: versionKey,
      variant,
      icon,
      path: pathname,
    });
  };

  const Icon = () => (
    <span
      aria-hidden="true"
      className="h-5 w-5 grid place-items-center shrink-0"
    >
      {icon === 'egg' ? (
        '🍳'
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      )}
    </span>
  );

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Site status"
      className={cn(
        'w-full border-b',
        'bg-[var(--surf-1)] text-[var(--text-1)]',
        'border-[var(--border-line)]'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-3 justify-center md:justify-between">
          <div className="flex items-center gap-2">
            <Icon />
            <div className="text-sm leading-6">
              <span className="sr-only">Site status: </span>
              <strong>{copy.prefix}</strong> {copy.main}{' '}
              <Link
                href={statusHref}
                onClick={handleViewStatus}
                className={cn(
                  'underline underline-offset-2',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2',
                  'hover:text-[var(--brand-primary)] transition-colors'
                )}
              >
                View status
              </Link>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss site status banner"
            onClick={handleDismiss}
            className={cn(
              'h-10 w-10 min-w-[40px] min-h-[40px]',
              'grid place-items-center rounded-md',
              'hover:bg-[var(--surf-2)] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2',
              'text-lg font-bold'
            )}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
```

**Key Changes:**

- ✅ SHA-keyed storage (`wip-dismissed:<sha>`)
- ✅ Shows on ALL pages except `/status`
- ✅ PostHog analytics (view, click, dismiss)
- ✅ Escape key dismissal
- ✅ Variant and icon support
- ✅ Hydration-safe with isMounted
- ✅ Brightness token compliance

**Validation:**

- No TypeScript errors
- No hydration mismatches
- Accessibility maintained

---

### 2.2 Update `src/lib/wip-context.tsx`

**Purpose:** Make context SHA-aware for version-keyed state

**CRITICAL:** Only modify the storage key logic - keep existing structure

**Implementation:**

```typescript
// src/lib/wip-context.tsx
// ONLY UPDATE the storage key part in useEffect:

// OLD:
const storedBanner = localStorage.getItem('wip_banner_dismissed');

// NEW:
const gitSha = process.env.NEXT_PUBLIC_GIT_SHA || 'local';
const storedBanner = localStorage.getItem(`wip-dismissed:${gitSha}`);

// Apply same pattern for modal if needed
```

**Validation:**

- Context still works
- No breaking changes
- Existing tests still pass

---

### 2.3 Update `src/components/wip-banner.test.tsx`

**Purpose:** Add tests for new SHA-keyed features

**Implementation:**

```typescript
// src/components/wip-banner.test.tsx
// ADD these new tests at the end of existing test suite:

describe('WipBanner - SHA-keyed persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should use SHA in storage key', () => {
    const sha = 'abc123';
    render(<WipBanner versionKey={sha} />);

    const dismissButton = screen.getByLabelText(/dismiss/i);
    fireEvent.click(dismissButton);

    expect(localStorage.getItem(`wip-dismissed:${sha}`)).toBe('1');
  });

  it('should re-show banner when SHA changes', () => {
    localStorage.setItem('wip-dismissed:oldsha', '1');

    const { rerender } = render(<WipBanner versionKey="newsha" />);

    // Should be visible for new SHA
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should hide on /status page', () => {
    // Mock usePathname to return /status
    vi.mock('next/navigation', () => ({
      usePathname: () => '/status',
    }));

    render(<WipBanner versionKey="test" />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should track analytics on dismiss', () => {
    const mockCapture = vi.fn();
    vi.spyOn(require('@/lib/analytics/posthog-client'), 'posthog', 'get').mockReturnValue({
      capture: mockCapture,
    });

    render(<WipBanner versionKey="test" />);

    const dismissButton = screen.getByLabelText(/dismiss/i);
    fireEvent.click(dismissButton);

    expect(mockCapture).toHaveBeenCalledWith(
      'status_banner.dismiss',
      expect.objectContaining({ sha: 'test' })
    );
  });

  it('should dismiss on Escape key', () => {
    render(<WipBanner versionKey="test" />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
```

**Validation:**

- All new tests pass
- Existing tests still pass
- Run `npm test` - 856+ passing

---

## PHASE 3: Status Page Components

### 3.1 Create `src/components/status/StatusHero.tsx`

```typescript
// src/components/status/StatusHero.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatusHeroProps {
  title: string;
  subtitle: string;
  ctas: {
    chatHref: string;
    resumeHref: string;
  };
}

export function StatusHero({ title, subtitle, ctas }: StatusHeroProps) {
  return (
    <section
      className={cn(
        'w-full py-16 sm:py-20',
        'bg-[var(--surf-0)]',
        'border-b border-[var(--border-line)]'
      )}
      aria-labelledby="status-hero-title"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1
          id="status-hero-title"
          className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-1)] mb-4"
        >
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-[var(--text-2)] mb-8 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href={ctas.chatHref}>Open Chat</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={ctas.resumeHref} target="_blank" rel="noopener noreferrer">
              Download Résumé
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

**Test: `src/components/status/StatusHero.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusHero } from './StatusHero';

describe('StatusHero', () => {
  const mockProps = {
    title: 'Test Title',
    subtitle: 'Test subtitle',
    ctas: {
      chatHref: '/?openChat=1',
      resumeHref: '/resume.pdf',
    },
  };

  it('should render title and subtitle', () => {
    render(<StatusHero {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('should render both CTA buttons', () => {
    render(<StatusHero {...mockProps} />);
    expect(screen.getByRole('link', { name: /open chat/i })).toHaveAttribute(
      'href',
      '/?openChat=1'
    );
    expect(screen.getByRole('link', { name: /download résumé/i })).toHaveAttribute(
      'href',
      '/resume.pdf'
    );
  });
});
```

---

### 3.2 Create `src/components/status/PersonaSwitch.tsx`

```typescript
// src/components/status/PersonaSwitch.tsx
'use client';

import { cn } from '@/lib/utils';
import type { Persona } from '@/data/status';

interface PersonaSwitchProps {
  personas: Array<{ id: Persona; label: string }>;
  active: Persona;
  onChange: (persona: Persona) => void;
}

export function PersonaSwitch({ personas, active, onChange }: PersonaSwitchProps) {
  return (
    <div
      role="tablist"
      aria-label="Select persona"
      className="flex flex-wrap gap-2 justify-center"
    >
      {personas.map((persona) => (
        <button
          key={persona.id}
          role="tab"
          aria-selected={active === persona.id}
          aria-controls={`persona-content-${persona.id}`}
          onClick={() => onChange(persona.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2',
            active === persona.id
              ? 'bg-[var(--brand-primary)] text-white'
              : 'bg-[var(--surf-1)] text-[var(--text-2)] hover:bg-[var(--surf-2)]'
          )}
        >
          {persona.label}
        </button>
      ))}
    </div>
  );
}
```

**Test: `src/components/status/PersonaSwitch.test.tsx`**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonaSwitch } from './PersonaSwitch';

describe('PersonaSwitch', () => {
  const mockPersonas = [
    { id: 'recruiters' as const, label: 'Recruiters' },
    { id: 'engineers' as const, label: 'Engineers' },
    { id: 'curious' as const, label: 'Curious' },
  ];

  it('should render all personas', () => {
    const onChange = vi.fn();
    render(<PersonaSwitch personas={mockPersonas} active="recruiters" onChange={onChange} />);

    expect(screen.getByRole('tab', { name: 'Recruiters' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Engineers' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Curious' })).toBeInTheDocument();
  });

  it('should highlight active persona', () => {
    const onChange = vi.fn();
    render(<PersonaSwitch personas={mockPersonas} active="engineers" onChange={onChange} />);

    const engineersTab = screen.getByRole('tab', { name: 'Engineers' });
    expect(engineersTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should call onChange when persona clicked', () => {
    const onChange = vi.fn();
    render(<PersonaSwitch personas={mockPersonas} active="recruiters" onChange={onChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Engineers' }));
    expect(onChange).toHaveBeenCalledWith('engineers');
  });
});
```

---

### 3.3 Create `src/components/status/CapabilityGrid.tsx`

```typescript
// src/components/status/CapabilityGrid.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Capability } from '@/data/status';

interface CapabilityGridProps {
  items: Capability[];
}

export function CapabilityGrid({ items }: CapabilityGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((cap) => {
        const CardWrapper = cap.link ? Link : 'div';
        const wrapperProps = cap.link ? { href: cap.link } : {};

        return (
          <CardWrapper
            key={cap.id}
            {...wrapperProps}
            className={cn(
              'p-4 rounded-lg border',
              'bg-[var(--surf-1)] border-[var(--border-line)]',
              'transition-all',
              cap.link && 'hover:bg-[var(--surf-2)] hover:border-[var(--brand-primary)] cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2'
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-[var(--text-1)]">{cap.title}</h3>
              {cap.badge && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--brand-primary)] text-white">
                  {cap.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-2)]">{cap.summary}</p>
          </CardWrapper>
        );
      })}
    </div>
  );
}
```

**Test: `src/components/status/CapabilityGrid.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CapabilityGrid } from './CapabilityGrid';

describe('CapabilityGrid', () => {
  const mockCapabilities = [
    { id: '1', title: 'Feature 1', summary: 'Summary 1', badge: 'MVP' },
    { id: '2', title: 'Feature 2', summary: 'Summary 2', link: '/feature2' },
  ];

  it('should render all capabilities', () => {
    render(<CapabilityGrid items={mockCapabilities} />);
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });

  it('should render badges when present', () => {
    render(<CapabilityGrid items={mockCapabilities} />);
    expect(screen.getByText('MVP')).toBeInTheDocument();
  });

  it('should render link when provided', () => {
    render(<CapabilityGrid items={mockCapabilities} />);
    const feature2 = screen.getByText('Feature 2').closest('a');
    expect(feature2).toHaveAttribute('href', '/feature2');
  });
});
```

---

### 3.4 Create remaining components (SAME PATTERN)

**Files to create:**

- `src/components/status/MetricsRow.tsx` + test
- `src/components/status/Milestones.tsx` + test
- `src/components/status/Roadmap.tsx` + test
- `src/components/status/Lessons.tsx` + test
- `src/components/status/HowToUse.tsx` + test

**Follow the same patterns:**

1. Use brightness tokens (`var(--surf-*)`, `var(--text-*)`)
2. Include accessibility (aria-labels, focus rings)
3. Write unit tests for each
4. No hardcoded colors
5. Responsive design
6. TypeScript strict mode

**I'm providing streamlined versions - implement following patterns above:**

```typescript
// src/components/status/MetricsRow.tsx
export function MetricsRow({ items }: { items: MetricBadge[] }) {
  // Grid of metric badges with tooltips
}

// src/components/status/Milestones.tsx
export function Milestones({ items }: { items: Milestone[] }) {
  // Timeline/list of milestones, newest first
  // Sort by date descending
}

// src/components/status/Roadmap.tsx
export function Roadmap({ data }: { data: Roadmap }) {
  // 3 columns: Now / Next / Later
  // Bullet lists for each
}

// src/components/status/Lessons.tsx
export function Lessons({ items }: { items: Lesson[] }) {
  // List of lessons with dates
  // Sort by date descending
}

// src/components/status/HowToUse.tsx
export function HowToUse({ persona, blocks }: { persona: Persona; blocks: HowToUse[] }) {
  // Filter by persona
  // Copy-to-clipboard buttons for prompts
  // Track analytics on copy
}
```

---

### 3.5 Refactor `src/app/status/page.tsx`

**Purpose:** Data-driven page using all new components

```typescript
// src/app/status/page.tsx
'use client';

import { useState } from 'react';
import { statusData, type Persona } from '@/data/status';
import { enrichMetrics } from '@/lib/status/metrics';
import { StatusHero } from '@/components/status/StatusHero';
import { PersonaSwitch } from '@/components/status/PersonaSwitch';
import { CapabilityGrid } from '@/components/status/CapabilityGrid';
import { MetricsRow } from '@/components/status/MetricsRow';
import { Milestones } from '@/components/status/Milestones';
import { Roadmap } from '@/components/status/Roadmap';
import { Lessons } from '@/components/status/Lessons';
import { HowToUse } from '@/components/status/HowToUse';
import { posthog } from '@/lib/analytics/posthog-client';
import { useEffect, useState as useReactState } from 'react';

export default function StatusPage() {
  const [activePersona, setActivePersona] = useState<Persona>('recruiters');
  const [enrichedMetrics, setEnrichedMetrics] = useState(statusData.metrics);

  useEffect(() => {
    // Enrich metrics with live data
    enrichMetrics(statusData.metrics).then(setEnrichedMetrics);
  }, []);

  const handlePersonaChange = (persona: Persona) => {
    setActivePersona(persona);
    posthog.capture('status_page.persona_switch', { persona });
  };

  const personas = [
    { id: 'recruiters' as Persona, label: 'Recruiters' },
    { id: 'engineers' as Persona, label: 'Engineers' },
    { id: 'curious' as Persona, label: 'Curious' },
  ];

  return (
    <div className="min-h-screen bg-[var(--surf-0)]" data-testid="status-page">
      <StatusHero
        title={statusData.hero.title}
        subtitle={statusData.hero.subtitle}
        ctas={statusData.hero.ctas}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Mission & Vision */}
        <section aria-labelledby="mission-vision">
          <h2 id="mission-vision" className="sr-only">
            Mission and Vision
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2">
                Mission
              </h3>
              <p className="text-lg text-[var(--text-1)]">{statusData.mission}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2">
                Vision
              </h3>
              <p className="text-lg text-[var(--text-1)]">{statusData.vision}</p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section aria-labelledby="metrics-heading">
          <h2
            id="metrics-heading"
            className="text-2xl font-bold text-[var(--text-1)] mb-6"
          >
            Live Metrics
          </h2>
          <MetricsRow items={enrichedMetrics} />
        </section>

        {/* Capabilities */}
        <section aria-labelledby="capabilities-heading">
          <h2
            id="capabilities-heading"
            className="text-2xl font-bold text-[var(--text-1)] mb-6"
          >
            What's Live
          </h2>
          <CapabilityGrid items={statusData.capabilities} />
        </section>

        {/* Milestones */}
        <section aria-labelledby="milestones-heading">
          <h2
            id="milestones-heading"
            className="text-2xl font-bold text-[var(--text-1)] mb-6"
          >
            Recent Milestones
          </h2>
          <Milestones items={statusData.milestones} />
        </section>

        {/* Roadmap */}
        <section aria-labelledby="roadmap-heading">
          <h2
            id="roadmap-heading"
            className="text-2xl font-bold text-[var(--text-1)] mb-6"
          >
            Roadmap
          </h2>
          <Roadmap data={statusData.roadmap} />
        </section>

        {/* Lessons */}
        <section aria-labelledby="lessons-heading">
          <h2
            id="lessons-heading"
            className="text-2xl font-bold text-[var(--text-1)] mb-6"
          >
            Lessons Learned
          </h2>
          <Lessons items={statusData.lessons} />
        </section>

        {/* How to Use (Persona-specific) */}
        <section aria-labelledby="how-to-use-heading">
          <h2
            id="how-to-use-heading"
            className="text-2xl font-bold text-[var(--text-1)] mb-6"
          >
            How to Use Ozzy
          </h2>
          <div className="mb-6">
            <PersonaSwitch
              personas={personas}
              active={activePersona}
              onChange={handlePersonaChange}
            />
          </div>
          <HowToUse persona={activePersona} blocks={statusData.howToUse} />
        </section>
      </main>
    </div>
  );
}
```

**Validation:**

- Page renders without errors
- All sections visible
- Persona switching works
- Metrics show live data
- No hydration errors

---

## PHASE 4: Testing & Quality Gates

### 4.1 Create E2E Test: `e2e/status.spec.ts`

```typescript
// e2e/status.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BRIGHTNESS_MODES = ['-3', '-2', '-1', '0', '+1', '+2', '+3'];

test.describe('Status Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/status', { waitUntil: 'networkidle' });
    // Wait for hydration
    await page.waitForSelector('[data-testid="status-page"]');
    await page.waitForTimeout(500);
  });

  test('should render all main sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /live status/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /live metrics/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /what's live/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /recent milestones/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /roadmap/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /lessons learned/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /how to use/i })).toBeVisible();
  });

  test('should have working CTAs', async ({ page }) => {
    const chatButton = page.getByRole('link', { name: /open chat/i });
    await expect(chatButton).toHaveAttribute('href', '/?openChat=1');

    const resumeButton = page.getByRole('link', { name: /download résumé/i });
    await expect(resumeButton).toHaveAttribute('href', /resume\.pdf/i);
  });

  test('should switch personas', async ({ page }) => {
    // Click Engineers persona
    await page.getByRole('tab', { name: /engineers/i }).click();
    await page.waitForTimeout(300);

    // Should show engineer-specific content
    await expect(
      page.getByText(/open the repo and summarize/i)
    ).toBeVisible();
  });

  test('should display live metrics', async ({ page }) => {
    // Check for metric labels
    await expect(page.getByText(/deploy/i)).toBeVisible();
    await expect(page.getByText(/commit/i)).toBeVisible();
    await expect(page.getByText(/perf snapshot/i)).toBeVisible();
  });

  test.describe('Accessibility (WCAG 2A)', () => {
    for (const mode of BRIGHTNESS_MODES) {
      test(`should pass axe in brightness mode ${mode}`, async ({ page }) => {
        // Set brightness mode
        await page.evaluate((m) => {
          document.documentElement.setAttribute('data-brightness', m);
        }, mode);

        await page.waitForTimeout(300);

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
  });

  test('should have no hydration errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const hydrationErrors = consoleErrors.filter(
      (error) =>
        error.includes('Hydration') ||
        error.includes('hydration') ||
        error.includes('did not match')
    );

    expect(hydrationErrors).toHaveLength(0);
  });
});
```

**Validation:**

- Run `npm run test:e2e -- e2e/status.spec.ts`
- All tests pass
- No accessibility violations
- No hydration errors

---

### 4.2 Run All Quality Gates

**Execute in sequence:**

```bash
# 1. Lint
npm run lint
# Expected: 0 errors, 0 warnings

# 2. Type check
npx tsc --noEmit
# Expected: 0 errors

# 3. Unit tests
npm test
# Expected: 856+ passing (all new tests included)

# 4. Build
npm run build
# Expected: Success

# 5. Bundle size
npm run size
# Expected: All pages within limits

# 6. E2E tests
npm run test:e2e
# Expected: All passing including new status tests
```

**If ANY gate fails:** Stop, fix, re-run all gates.

---

## ⚠️ CRITICAL IMPLEMENTATION RULES

### MUST DO

1. **Follow Existing Patterns:**
   - Use isMounted for hydration safety
   - Use brightness tokens (NO hardcoded colors)
   - Use @/ imports (NO relative paths)
   - Use strict TypeScript (NO `any` types)

2. **Test Everything:**
   - Write tests BEFORE marking components done
   - Run quality gates after each phase
   - Fix failures immediately

3. **Accessibility:**
   - ARIA labels on all interactive elements
   - Keyboard navigation (Tab, Escape)
   - Focus indicators (focus:ring)
   - Test in all 8 brightness modes

4. **Analytics:**
   - Track all user interactions
   - Use PostHog.capture() correctly
   - Include context (persona, SHA, path)

5. **Version Control:**
   - Commit after each phase
   - Use descriptive commit messages
   - Test before committing

### MUST NOT DO

1. ❌ NO hardcoded colors (use CSS custom properties)
2. ❌ NO skipping tests to make builds pass
3. ❌ NO TypeScript `any` types
4. ❌ NO client-side API calls (server-side only)
5. ❌ NO deleting existing files without backup
6. ❌ NO committing with failing quality gates
7. ❌ NO hydration-unsafe patterns (check isMounted)
8. ❌ NO bundle bloat (lazy load if needed)

---

## 🎯 SUCCESS CRITERIA (DEFINITION OF DONE)

### Functional Requirements

- [x] Status page is data-driven from status.ts
- [x] WIP banner uses SHA-keyed persistence
- [x] Banner shows on all pages except /status
- [x] All 8 components render correctly
- [x] Persona switching works
- [x] Live metrics display (git SHA, build date)
- [x] All CTAs route correctly
- [x] Copy-to-clipboard for prompts works
- [x] Analytics tracking functional

### Quality Requirements

- [x] ESLint: 0 errors, 0 warnings
- [x] TypeScript: 0 errors (strict mode)
- [x] Unit Tests: 856+ passing (100%)
- [x] E2E Tests: All passing including status.spec.ts
- [x] Build: Success
- [x] Bundle: < 40KB homepage (monitor growth)
- [x] Accessibility: WCAG 2A in all 8 modes
- [x] No hydration errors
- [x] No console errors/warnings

### Documentation

- [x] Update CLAUDE.md (AI tool count: 12 not 11)
- [x] Add comments for complex logic
- [x] Update TODO files (mark as complete)

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Foundation ✅

- [ ] Create src/data/status.ts with complete data
- [ ] Create src/lib/status/metrics.ts
- [ ] Update next.config.ts for env vars
- [ ] Create src/data/status.test.ts
- [ ] Run: npm test (verify new test passes)
- [ ] Commit: "feat: add status page data foundation"

### Phase 2: WIP Banner ✅

- [ ] Update src/components/wip-banner.tsx (SHA-keyed + analytics)
- [ ] Update src/lib/wip-context.tsx (SHA-aware)
- [ ] Update src/components/wip-banner.test.tsx (new tests)
- [ ] Run: npm test (verify all tests pass)
- [ ] Test manually: banner persistence, analytics
- [ ] Commit: "feat: enhance WIP banner with SHA-keyed persistence"

### Phase 3: Status Components ✅

- [ ] Create StatusHero + test
- [ ] Create PersonaSwitch + test
- [ ] Create CapabilityGrid + test
- [ ] Create MetricsRow + test
- [ ] Create Milestones + test
- [ ] Create Roadmap + test
- [ ] Create Lessons + test
- [ ] Create HowToUse + test
- [ ] Refactor src/app/status/page.tsx
- [ ] Run: npm test (verify all component tests pass)
- [ ] Commit: "feat: add data-driven status page components"

### Phase 4: Testing & QA ✅

- [ ] Create e2e/status.spec.ts
- [ ] Run: npm run lint (0 errors)
- [ ] Run: npx tsc --noEmit (0 errors)
- [ ] Run: npm test (856+ passing)
- [ ] Run: npm run build (success)
- [ ] Run: npm run size (< 40KB homepage)
- [ ] Run: npm run test:e2e (all passing)
- [ ] Test manually: all 8 brightness modes
- [ ] Test manually: persona switching
- [ ] Test manually: copy prompts
- [ ] Test manually: analytics events
- [ ] Commit: "test: add comprehensive status page tests"

### Final Steps ✅

- [ ] Update CLAUDE.md (AI tool count correction)
- [ ] Mark TODO files as complete
- [ ] Create PR description with screenshots
- [ ] Request review or merge
- [ ] Verify production deployment
- [ ] Monitor analytics dashboard

---

## 🚨 TROUBLESHOOTING GUIDE

### Issue: Hydration Mismatch

**Solution:** Add isMounted pattern

```typescript
const [isMounted, setIsMounted] = useState(false);
useEffect(() => { setIsMounted(true); }, []);
if (!isMounted) return null;
```

### Issue: Bundle Size Exceeds Limit

**Solution:** Lazy load components

```typescript
const Milestones = lazy(() => import('./Milestones'));
```

### Issue: Tests Timing Out

**Solution:** Add proper waits

```typescript
await page.waitForSelector('[data-testid="ready"]');
await page.waitForTimeout(500);
```

### Issue: Analytics Not Tracking

**Solution:** Check PostHog initialization

```typescript
import { posthog } from '@/lib/analytics/posthog-client';
// Ensure client is initialized before calling
```

### Issue: TypeScript Errors on Imports

**Solution:** Use @/ imports

```typescript
// ✅ CORRECT
import { statusData } from '@/data/status';

// ❌ WRONG
import { statusData } from '../../data/status';
```

---

## 📞 SUPPORT & ESCALATION

**If blocked or uncertain:**

1. Document the blocker clearly
2. Check existing patterns in codebase
3. Review CLAUDE.md and AGENTS.md
4. If still blocked: pause and request clarification

**Do NOT:**

- Skip quality gates
- Commit broken code
- Make architectural changes without approval
- Delete files without understanding impact

---

## 🎉 FINAL VALIDATION

Before marking complete, verify:

```bash
# Run this command - ALL must pass:
npm run lint && \
npx tsc --noEmit && \
npm test && \
npm run build && \
npm run size && \
npm run test:e2e

# Expected output:
✅ ESLint: 0 errors
✅ TypeScript: 0 errors
✅ Tests: 856+ passing
✅ Build: Success
✅ Bundle: Within limits
✅ E2E: All passing
```

**If all green:** Task complete! 🎊

**If any red:** Fix and re-run. Do NOT proceed.

---

**END OF TASK SPECIFICATION**

**Autonomous Execution Ready:** YES ✅
**Estimated Time:** 6-8 hours
**Confidence:** High (all data verified, patterns clear)
**Risk Level:** Low-Medium (incremental, testable)

Good luck, Codex! 🚀
