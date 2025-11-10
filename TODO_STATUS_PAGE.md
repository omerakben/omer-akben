
# /status — Implementation Plan (MVP++)
>
> **Purpose:** Make the status page your **Live Roadmap + Trust Center**: what’s live, what just shipped, what’s next, and why it matters. Also onboard visitors (esp. recruiters) into using **Ozzy (Agentic AI)** as a pre-screen assistant.

---

## 0) Objectives & Outcomes

- [ ] Communicate the **MVP is live** and actively improving.
- [ ] Showcase **capabilities**: Portfolio, **Brightness Control**, **Agentic AI**, **Tools**, **Memory/Cache**, **Quality**, **Performance**.
- [ ] Clarify **Mission & Vision** (where this is going and why).
- [ ] Provide **pre-screen prompts** for recruiters + **how-to** for collaborators.
- [ ] Capture **lessons learned** to show reflection and rigor.
- [ ] Surface **live metrics** (commit SHA, deploy time, perf snapshot).
- [ ] Keep copy **crisp, non-defensive**, and **benefit-oriented**.

---

## 1) Information Architecture & Layout

- [ ] **Hero**: “Live Status & Roadmap” + short explainer + 2 CTAs (Open Chat, Download Résumé).
- [ ] **Persona Switch** (tabs/pills): **Recruiters ・ Engineers ・ Curious** (filters only the “How to Use” panel).
- [ ] **What’s Live**: compact capability grid (7–8 items).
- [ ] **Metrics Row**: Build/deploy info + perf/accessibility badges.
- [ ] **Milestones (changelog)**: newest → oldest (3–6 entries).
- [ ] **Roadmap**: Now / Next / Later (3–5 bullets each).
- [ ] **Lessons Learned**: short bullets with dates.
- [ ] **How to Use Ozzy**: copy‑paste prompts (Recruiters/Collaborators).
- [ ] Optional Footer: link to architecture docs and repo.

---

## 2) Files & Component Structure

Refactor to data‑driven render so content updates don’t touch JSX.

- [ ] `src/app/status/page.tsx` (container)
- [ ] `src/components/status/StatusHero.tsx`
- [ ] `src/components/status/PersonaSwitch.tsx`
- [ ] `src/components/status/CapabilityGrid.tsx`
- [ ] `src/components/status/MetricsRow.tsx`
- [ ] `src/components/status/Milestones.tsx`
- [ ] `src/components/status/Roadmap.tsx`
- [ ] `src/components/status/Lessons.tsx`
- [ ] `src/components/status/HowToUse.tsx`
- [ ] `src/data/status.ts` (**single source of truth**)
- [ ] `src/lib/status/metrics.ts` (deploy SHA, build time, vitals snapshot)
- [ ] `e2e/status.spec.ts` (Playwright)
- [ ] `__tests__/status/*.test.tsx` (unit)

---

## 3) Data Model (TypeScript)

Create `src/data/status.ts`:

```ts
// src/data/status.ts
export type Persona = 'recruiters' | 'engineers' | 'curious';

export interface Capability {
  id: string;
  title: string;
  summary: string;
  badge?: string;           // e.g., "MVP"
  link?: string;            // internal route or doc
}

export interface MetricBadge {
  label: string;
  value: string;
  tooltip?: string;
}

export interface Milestone {
  date: string;             // ISO (yyyy-mm-dd)
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
  hero: { title: string; subtitle: string; ctas: { chatHref: string; resumeHref: string } };
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
      'This portfolio is a production MVP—fully usable today and improved continuously. Here’s what’s live, what just shipped, and what’s next.',
    ctas: { chatHref: '/?openChat=1', resumeHref: '/assets/Omer_Akben_Resume.pdf' }
  },
  mission:
    'Build a transparent, production-grade AI portfolio that demonstrates real engineering: measurable performance, strong quality gates, and an agentic assistant that can pre-screen and guide visitors.',
  vision:
    'A personal AI platform that clones my knowledge, answers domain questions, and helps recruiters and collaborators move faster with trustworthy context.',
  capabilities: [
    { id: 'portfolio', title: 'Portfolio Core', summary: 'Projects, Skills, Journey, Credentials are live.', badge: 'MVP', link: '/projects' },
    { id: 'brightness', title: 'Brightness Control', summary: 'Auto + manual modes with contrast-safe tokens.', badge: 'MVP', link: '/#theme' },
    { id: 'agentic', title: 'Agentic AI (Ozzy)', summary: 'Context-aware chat with memory and tool use.', badge: 'MVP', link: '/#chat' },
    { id: 'tools', title: 'Server Tools', summary: 'Navigation, summary, performance profile, resume fetch.' },
    { id: 'cache', title: 'Memory & Cache', summary: 'Vector + Redis patterns for fast recall and rate limits.' },
    { id: 'quality', title: 'Quality Gates', summary: 'Typed code, ESLint clean, route-level a11y checks.' },
    { id: 'performance', title: 'Performance', summary: 'Small bundles, static paths, SSR hydration safety.' }
  ],
  metrics: [
    { label: 'Deploy', value: '__BUILD_DATE__', tooltip: 'Server build timestamp' },
    { label: 'Commit', value: '__GIT_SHA__', tooltip: 'Current commit (short SHA)' },
    { label: 'Perf Snapshot', value: '__PERF_SCORE__', tooltip: 'Recent lab run / score' },
    { label: 'Routes a11y', value: '8/8', tooltip: 'Routes checked for WCAG AA' }
  ],
  milestones: [
    { date: '2025-11-01', title: 'AI transparency & status banner',
      details: ['WIP banner clarifies MVP state', 'Status page linked globally'] },
    { date: '2025-10-29', title: 'Contact collection v2',
      details: ['Email delivery via provider', 'Disposable email guard & rate limits'] },
    { date: '2025-10-21', title: 'Accessibility E2E foundation',
      details: ['Hydration-safe waits in tests', 'Route-level checks across site'] }
  ],
  roadmap: {
    now: [
      'Pre-screen flow: “Ask Ozzy 10 recruiter questions” (one click).',
      'Perf snapshot card using a server tool to collect metrics.',
      'Richer summaries based on curated knowledge snippets.'
    ],
    next: [
      '“Upload JD → tailored pitch” flow in chat.',
      'Shareable conversation link for recruiters.',
      'Project spotlight cards with outcomes + links.'
    ],
    later: [
      'Multi-agent research → summary → email draft pipeline.',
      'Private recruiter portal with structured notes/downloads.'
    ]
  },
  lessons: [
    { date: '2025-10-29', note: 'Raised contact rate limit to handle real sharing behavior.' },
    { date: '2025-10-21', note: 'Axe scans need hydration-aware waits to avoid false fails.' },
    { date: '2025-10-15', note: 'WIP modal is useful when it is honest and non-blocking.' }
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
        'Explain what “agentic AI” means here with examples.',
        'What’s shipping next month and why should I check back?'
      ]
    }
  ]
};
```

---

## 4) Component Contracts

**`<StatusHero />`**

- Props: `{ title, subtitle, ctas }`

**`<PersonaSwitch />`**

- Props: `{ personas: Persona[], active: Persona, onChange(p: Persona) }`
- Remount only the **HowToUse** panel on change (content swap), not the whole page.

**`<CapabilityGrid />`**

- Props: `{ items: Capability[] }`

**`<MetricsRow />`**

- Props: `{ items: MetricBadge[] }`
- Replace placeholders using `getDeployInfo()` + `getPerfSnapshot()`.

**`<Milestones />`**

- Props: `{ items: Milestone[] }`

**`<Roadmap />`**

- Props: `{ data: Roadmap }`

**`<Lessons />`**

- Props: `{ items: Lesson[] }`

**`<HowToUse />`**

- Props: `{ persona: Persona, blocks: HowToUse[] }`

---

## 5) Live Metrics Wiring

- Add build info at build time:

  ```bash
  NEXT_PUBLIC_GIT_SHA=$(git rev-parse --short HEAD)
  NEXT_PUBLIC_BUILD_DATE=$(date -u +"%Y-%m-%d %H:%M UTC")
  ```

- `src/lib/status/metrics.ts`:

  ```ts
  export const getDeployInfo = () => ({
    sha: process.env.NEXT_PUBLIC_GIT_SHA ?? 'local',
    buildDate: process.env.NEXT_PUBLIC_BUILD_DATE ?? 'dev'
  });

  export const getPerfSnapshot = async (): Promise<string> => {
    // e.g., read from /public/metrics/latest.json or an internal API
    return 'n/a'; // fill with real value when wired
  };
  ```

- Replace placeholders:

  ```ts
  const info = getDeployInfo();
  const perf = await getPerfSnapshot();
  const metrics = statusData.metrics.map(m =>
    m.label === 'Commit' ? { ...m, value: info.sha }
    : m.label === 'Deploy' ? { ...m, value: info.buildDate }
    : m.label === 'Perf Snapshot' ? { ...m, value: perf }
    : m
  );
  ```

---

## 6) Copy Deck

**Hero subtitle:** *This portfolio is a production MVP—fully usable today and improved continuously.*

**Mission:** *Build a transparent, production‑grade AI portfolio that demonstrates real engineering: measurable performance, strong quality gates, and an agentic assistant that can pre‑screen and guide visitors.*

**Vision:** *A personal AI platform that clones my knowledge, answers domain questions, and helps recruiters and collaborators move faster with trustworthy context.*

---

## 7) Styling, Accessibility, Performance, Analytics

- Use brightness tokens; ensure AA contrast across modes.
- Landmark sections; visible focus; “Copy prompt” announces status.
- Keep assets minimal; tree‑shake; avoid client libs unless essential.
- Track persona changes, prompt copies, CTAs, scroll depth.

---

## 8) Testing

**Unit**

- [ ] Renders all sections with `statusData`.
- [ ] Persona switch filters only HowToUse.
- [ ] Capability links validated.
- [ ] Metrics placeholders replaced.

**E2E**

- [ ] No hydration errors.
- [ ] Axe/aria checks pass in each brightness mode.
- [ ] Persona switch + copy button work.
- [ ] CTAs route correctly.

---

## 9) Definition of Done

- Data‑driven page shipping with live deploy SHA and build date.
- Capabilities highlight Brightness, Agentic AI, Tools, Cache, Quality, Performance.
- Milestones ≥ 3; Roadmap filled (Now/Next/Later).
- Prompts render for all personas.
- Lighthouse clean; ESLint/TS clean; tests pass.
- Site‑wide banner links here.
