# 🔧 Codex Autonomous Work Plan — omer-akben/omer-akben (Pre‑Launch Hardening)

> Paste this file directly into Codex / Cursor / Claude Code. It’s a complete, autonomous work order to harden the repo for production with **zero‑surprise** behavior. Codex should execute tasks in order, open PR(s), and stop only when all **Definition of Done** items are satisfied.

---

## 0) Role & Operating Constraints

You are the implementation assistant for **omer-akben/omer-akben**. Work **autonomously** and finish all tasks below. Do not request clarification unless a task cannot be completed without repository secrets. Follow these rules:

- **Never commit failing code.** Before each commit/PR, pass: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run size`, `npm run test:e2e`.
- **Do not introduce heavy dependencies** unless explicitly allowed. You may add `@axe-core/playwright` for A11y tests.
- **Keep repo conventions.** Use `@/` imports, Tailwind classes, shadcn components, App Router.
- **Small, conventional commits**; 1 feature branch and 1 PR are preferred unless tests require staged merges.
- **Security first:** never expose secrets to the client, keep keys server‑side only.

---

## 1) Branch & Commit Hygiene

1. Create a feature branch: `feat/pre-launch-hardening`.
2. Use Conventional Commits: `feat(security): ...`, `test(e2e): ...`, `docs(seo): ...`.
3. Open a single PR titled: **Pre‑Launch Hardening: CSP + SEO + A11y + E2E + Policies** with the checklist in §9.

---

## 2) Task A — Security Headers & CSP (HIGH)

**Goal:** tighten CSP (remove `'unsafe-eval'`), add HSTS, and allow OpenAI/Vercel analytics connects.

### A.1 Edit `next.config.ts` → `headers()`

Replace the headers block (keep your existing caching blocks if present):

```ts
// next.config.ts
// ...
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        // NEW: HSTS
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            // removed 'unsafe-eval'
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data:",
            // allow analytics + API connects
            "connect-src 'self' https://api.openai.com https://vercel-insights.com https://*.vercel-analytics.com https://va.vercel-scripts.com wss://localhost:* ws://localhost:*",
            "frame-ancestors 'none'",
          ].join("; "),
        },
      ],
    },
  ];
}
```

**Notes:** keep `'unsafe-inline'` only as a temporary allowance (for JSON‑LD/inline styles). Add a TODO to migrate to nonces/hashes later.

**Validation:** run locally; open DevTools → Console and ensure **no CSP violations**; all quality gates pass.

---

## 3) Task B — SEO Metadata & Open Graph Images (HIGH)

Implement missing per‑route metadata and OG images using your existing metadata utilities.

### B.1 Dynamic metadata for project detail pages

Add `generateMetadata` in `src/app/projects/[slug]/page.tsx`:

```ts
import { createMetadata } from "@/lib/metadata";
import { getProjectBySlug } from "@/data/projects";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  const title = project ? `${project.title}` : "Project";
  const description = project?.description ?? "Project details and outcomes.";
  const path = `/projects/${params.slug}`;
  const image = project?.image ?? "/og/default.png";
  return createMetadata({ title, description, path, image });
}
```

### B.2 Dynamic OG images (default + per project)

Create:

- `src/app/opengraph-image.tsx`
- `src/app/projects/[slug]/opengraph-image.tsx`

```ts
// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OG() {
  return new ImageResponse(
    (<div style={{fontSize:64,display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",background:"#0b0d0e",color:"#00FFC6"}}>Omer Akben • Portfolio</div>),
    { ...size }
  );
}

// src/app/projects/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/data/projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function ProjectOG({ params }: { params: { slug: string }}) {
  const p = getProjectBySlug(params.slug);
  const title = p?.title ?? "Project";
  const subtitle = (p?.technologies ?? []).slice(0,4).join(" • ");
  return new ImageResponse(
    (<div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:20,width:"100%",height:"100%",background:"#0b0d0e",color:"#e6f7f3",padding:80}}>
       <div style={{fontSize:54,color:"#00FFC6"}}>{title}</div>
       <div style={{fontSize:32,opacity:.8}}>{subtitle}</div>
       <div style={{fontSize:24,opacity:.6}}>omerakben.com/projects/{params.slug}</div>
     </div>),
    { ...size }
  );
}
```

**Validation:** Use Twitter/LinkedIn card validators for `/` and a few `/projects/[slug]` pages.

---

## 4) Task C — Fill Missing Project Pages (HIGH)

Create minimal, high‑quality pages for any listed projects that lack a dedicated route. Suggested slugs (adjust to match `src/data/projects.ts`):  
`elon-ai-agent`, `genesis-test-copilot`, `tuel-chatbot-builder`, `north-glass`, `oteemo-ai-roadmap`, `developer-cheat-sheets`, `portfolio`.

Template (copy and adapt per project):

```ts
// src/app/projects/elon-ai-agent/page.tsx
import { getProjectBySlug } from "@/data/projects";
import Image from "next/image";

export default function Page() {
  const p = getProjectBySlug("elon-ai-agent");
  if (!p) return null;
  return (
    <main className="container mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-bold text-text-1 mb-2">{p.title}</h1>
      <p className="text-text-2 mb-6">{p.longDescription ?? p.description}</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {p.technologies.map(t => (
          <span key={t} className="px-2 py-1 bg-surf-2 text-text-3 rounded text-sm border border-border-line">{t}</span>
        ))}
      </div>
      {p.image && (
        <Image src={p.image} alt={`${p.title} screenshot`} width={1200} height={630} className="rounded-2xl border border-border-line" />
      )}
      <div className="mt-8 flex gap-3">
        {p.demoUrl && <a className="underline" href={p.demoUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>}
        {p.githubUrl && <a className="underline" href={p.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
      </div>
    </main>
  );
}
```

**Validation:** All new pages compile and render; no ESLint/TS errors.

---

## 5) Task D — Accessibility Audit & Fixes (HIGH)

### D.1 Add automated A11y scanning with Playwright + Axe

- Dev dependency: `@axe-core/playwright`
- New spec: `e2e/a11y.spec.ts` scanning key routes.

```ts
// e2e/a11y.spec.ts
import { test, expect } from "@playwright/test";

async function runAxe(page) {
  await page.addScriptTag({ path: require.resolve("axe-core") });
  const results = await page.evaluate(async () => await (window as any).axe.run());
  return results;
}

test.describe("A11y", () => {
  const pages = ["/","/projects","/skills","/journey","/credentials","/contact","/recruiter","/chat"];
  for (const path of pages) {
    test(`axe: ${path}`, async ({ page }) => {
      await page.goto(`http://localhost:3000${path}`);
      const results = await runAxe(page);
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
```

### D.2 Minor polish
- Decorative Lucide icons → `aria-hidden="true"` OR add labels where informative.
- Confirm Skip‑Link is visible on Tab and targets `main`.

**Validation:** `npx playwright test e2e/a11y.spec.ts` passes with 0 critical violations.

---

## 6) Task E — Resume Downloads: Seed & Test (MED)

### E.1 Seed placeholders for `/public/assets`

Add script `scripts/seed-assets.mjs`:

```js
// scripts/seed-assets.mjs
import { mkdirSync, writeFileSync, existsSync } from "fs";
const dir = "public/assets";
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const files = [
  "Omer_Akben_Resume.pdf",
  "Omer_Akben_Resume_Extended.pdf",
  "Omer-Akben-AWS-Certificate.pdf",
  "Omer-Akben-NSS-Certificate.pdf",
];
for (const f of files) writeFileSync(`${dir}/${f}`, "Replace with final file before public launch.\n");
writeFileSync(`${dir}/README.txt`, "Place final PDF/DOCX assets here before launch.\n");
console.log("Seeded placeholder assets.");
```

Add NPM script to `package.json`:
```json
{ "scripts": { "seed:assets": "node scripts/seed-assets.mjs" } }
```

### E.2 E2E: verify `/api/tools/download-resume` plumbing

```ts
// e2e/downloads.spec.ts
import { test, expect } from "@playwright/test";
test("resume links resolve", async ({ request }) => {
  const res = await request.get("/api/tools/download-resume?format=resume");
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  const file = await request.get(json.data.url);
  expect(file.status()).toBe(200);
});
```

**Validation:** run `npm run seed:assets` → tests green → 200 OK for resolved file.

---

## 7) Task F — Navigation & Mobile E2E (MED)

Add pragmatic smoke coverage:

```ts
// e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

test("navigate core routes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();
  await page.getByRole("link", { name: /projects/i }).click();
  await expect(page).toHaveURL(/\/projects/);
  // open the first project card if present
  const firstCard = page.locator("a[href^='/projects/']").first();
  if (await firstCard.count()) { await firstCard.click(); await expect(page.locator("main h1")).toBeVisible(); }
  await page.getByRole("link", { name: /recruiter/i }).click();
  await expect(page).toHaveURL(/\/recruiter/);
  await page.getByRole("link", { name: /contact/i }).click();
  await expect(page).toHaveURL(/\/contact/);
});

// e2e/mobile.spec.ts
import { test, expect } from "@playwright/test";
test.use({ viewport: { width: 390, height: 844 }, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" });
test("mobile home loads and recruiter CTA visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();
  await page.goto("/recruiter");
  await expect(page.getByRole("button", { name: /download/i })).toBeVisible();
});
```

**Validation:** All specs pass locally and in CI.

---

## 8) Task G — Privacy & Terms (MED)

Create two minimal pages and link them in the footer:

```tsx
// src/app/privacy/page.tsx
export default function Privacy() {
  return (
    <main className="container mx-auto max-w-3xl py-12 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p>We collect basic analytics and do not train models on visitor content. Resume downloads are served as static files. For erasure or questions: <a href="mailto:me@omerakben.com">me@omerakben.com</a>.</p>
      <ul>
        <li>Data retention: minimal, logs for troubleshooting only.</li>
        <li>No sale of personal data. No third‑party trackers beyond analytics.</li>
        <li>Contact for requests: me@omerakben.com</li>
      </ul>
    </main>
  );
}

// src/app/terms/page.tsx
export default function Terms() {
  return (
    <main className="container mx-auto max-w-3xl py-12 prose prose-invert">
      <h1>Terms of Use</h1>
      <p>Content is provided “as‑is” without warranties. Use at your own risk. We are not liable for indirect damages. Links to third‑party sites are for convenience.</p>
    </main>
  );
}
```

**Validation:** Pages render; footer links present; a11y scans pass.

---

## 9) Task H — Logger with Basic PII Redaction (MED)

Create `src/lib/log.ts` and use in API routes where practical:

```ts
// src/lib/log.ts
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_RE = /\+?[0-9][0-9()\s.-]{7,}[0-9]/g;

export function redactPII(s: string) {
  return s.replace(EMAIL_RE, "[redacted-email]").replace(PHONE_RE, "[redacted-phone]");
}

export function logError(scope: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  // eslint-disable-next-line no-console
  console.error(`[${scope}]`, redactPII(msg));
}
```

**Validation:** Build passes; replace a few `console.error` calls to use `logError`; spot-check output.

---

## 10) Task I — Docs & Runbook (LOW)

- `docs/SECURITY_HEADERS.md`: final CSP, HSTS, and how to validate in the browser.
- Update `docs/SEO.md`: add an “OG images checklist” and links to card validators.
- `docs/RUNBOOK.md`: 429 rate‑limit, OpenAI outage, missing Redis/vector envs; what error the user sees; where to look in logs; how to roll back.

---

## 11) Quality Gates (run before commit/PR)

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run size
npm run test:e2e
```

---

## 12) “Definition of Done” (checklist for the PR)

- [ ] **Security:** CSP tightened (no `'unsafe-eval'`), HSTS added; no console CSP errors.
- [ ] **SEO:** `generateMetadata` on project pages; OG for `/` and `/projects/[slug]` render in social debuggers.
- [ ] **Projects:** Missing project pages created; compile and render cleanly.
- [ ] **A11y:** Axe scans on key routes pass with 0 critical issues.
- [ ] **Downloads:** `/public/assets` seeded; `/api/tools/download-resume` returns 200; E2E added.
- [ ] **E2E:** Navigation & Mobile specs pass locally and in CI.
- [ ] **Policies:** `/privacy` + `/terms` shipped and linked.
- [ ] **Logging:** `logError` with PII redaction used in API error paths.
- [ ] **CI:** All gates & budgets green; no ESLint/TS errors.

---

## 13) Optional PR Template (copy to `.github/PULL_REQUEST_TEMPLATE.md`)

```md
# Pre‑Launch Hardening

## Summary
Tighten CSP/HSTS, ship OG images & route metadata, add A11y + E2E coverage, seed downloads, add policies and basic PII‑safe logger.

## Checklist (Definition of Done)
- [ ] Security: CSP tightened, HSTS added
- [ ] SEO: metadata + OG images
- [ ] Projects: all pages present
- [ ] A11y: axe scans = 0 critical
- [ ] Downloads: resume links 200
- [ ] E2E: nav + mobile passing
- [ ] Policies: privacy + terms
- [ ] Logging: redaction in place
- [ ] CI: all gates green

## Screenshots / Notes
(attach console CSP check, social card previews, and test output)
```

---

## 14) Rollback Plan (if needed)

- Revert branch merge via GitHub.
- Restore previous `next.config.ts` if CSP blocks critical assets.
- Disable new tests selectively by `test.skip` to unblock deploy; re‑enable after fixes.
- Keep placeholder assets until final PDFs are added.

---

**Execute now** (suggested order): A → B → C → D → E → F → G → H → I → 11/12.
