---
mode: agent
description: "Performance optimization codex for omerakben.com - Next.js 15 portfolio with AI capabilities"
---

# Performance Analysis - omerakben.com

**Repository**: Next.js 15 + React 19 + TypeScript + Framer Motion + Turbopack
**Target Environment**: Vercel (Serverless Functions + Edge Runtime)
**AI Stack**: ChatKit + Agents SDK + OpenAI (planned)
**Success Metrics**: Lighthouse ≥95, LCP <2.5s, INP <200ms, Resume Download ≥35% CTR

---

## 🎯 Executive Summary

### Current Baseline

- **Build System**: Turbopack (✅ configured)
- **Dependencies**: React 19, Framer Motion 12.23, Radix UI, Lucide React
- **Architecture**: App Router, 7-mode brightness system, Agent tools with Zod
- **Deployment**: Vercel (default config, no optimizations)

### 🔴 Critical Issues Identified (User Reported)

1. **Slow scroll animations** - ProjectCard whileInView on 9+ cards
2. **Brightness change delay** - 300ms transition cascade on entire page
3. **Empty next.config.ts** - Zero optimizations configured
4. **No API caching** - Static data regenerated every request
5. **BrightnessContext overhead** - Full app re-renders on state change
6. **No will-change CSS** - Animations not GPU-accelerated

### 📊 Performance Assessment Framework

**Measure First**

- Current: Scroll animations feel sluggish (0.5s duration)
- Current: Brightness changes trigger visible delay
- Target: Lighthouse ≥95, smooth 60fps animations

**Find Bottlenecks**

- ✅ Analyzed: Animation performance (whileInView, infinite loops)
- ✅ Analyzed: CSS transitions (body transition-colors cascade)
- ✅ Analyzed: Context re-renders (BrightnessProvider)
- ✅ Analyzed: Bundle size (framer-motion, Radix UI not code-split)

**Optimize Effectively**

- Priority: Animation speed (biggest user impact)
- Priority: Build configuration (foundation for all improvements)
- Priority: API caching (agent tool performance)

---

## 🔴 CRITICAL ISSUES - Animation Performance

### Issue 1: Slow Scroll Animations on ProjectCard

**File**: `src/components/project-card.tsx:33-38`
**Impact**: 🔴 HIGH - User explicitly reported "scroll animations too slow"
**Effort**: ⚡ 15 minutes

**Problem**:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}  // ❌ 0.5s too slow
>
```

**Issues**:

- Duration of 0.5s feels sluggish when scrolling
- Applied to 9+ cards (3 featured + 6+ on /projects page)
- No `will-change` CSS property for GPU acceleration
- Easing curve is good, but duration is the issue

**Solution**:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}  // ✅ Faster: 0.3s
  style={{ willChange: 'transform, opacity' }}  // ✅ GPU acceleration
>
```

**Additional CSS** (add to globals.css):

```css
/* Optimize animations for GPU */
@media (prefers-reduced-motion: no-preference) {
  .motion-safe {
    will-change: transform, opacity;
  }
}
```

**Expected Result**: Animations feel snappier, smoother scrolling experience

---

### Issue 2: Brightness Transition Cascade Delay

**File**: `src/app/globals.css:180`
**Impact**: 🔴 HIGH - User reported "delay after cache" when changing brightness
**Effort**: ⚡ 30 minutes

**Problem**:

```css
body {
  @apply bg-surf-0 text-text-1 transition-colors duration-300;  /* ❌ Cascades to ALL elements */
}
```

**Root Cause Chain**:

1. User clicks brightness button → `setBrightness()` called
2. `brightness-context.tsx:69` → `root.setAttribute('data-brightness', mode)`
3. CSS variables update (surf-0, surf-1, text-1, text-2, etc.)
4. `body { transition-colors }` triggers 300ms transition on ENTIRE page
5. Every child element inherits transition → massive reflow

**Solution**:

```css
/* Remove transition from body */
body {
  @apply bg-surf-0 text-text-1;  /* ✅ No transition */
}

/* Add transition ONLY to specific elements */
.card,
.button,
.nav-item {
  transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
}

/* Optimize brightness changes */
[data-brightness] {
  transition: none;  /* Instant brightness changes */
}
```

**Alternative** (if instant changes too jarring):

```css
body {
  transition: background-color 150ms ease, color 150ms ease;  /* ✅ Faster */
}

.section {
  contain: layout style paint;  /* ✅ Limit repaint scope */
}
```

**Expected Result**: Brightness changes feel instant, no visible lag

---

### Issue 3: Infinite Hero Animations

**File**: `src/components/hero-section.tsx:106-128`
**Impact**: 🟡 MEDIUM - Continuous CPU usage
**Effort**: ⚡ 30 minutes

**Problem**:

```tsx
<motion.div
  transition={{ repeat: Infinity, repeatType: "reverse" }}  // ❌ Infinite outer
>
  <motion.div
    animate={{ y: [0, 12, 0] }}
    transition={{ repeat: Infinity }}  // ❌ Infinite inner (nested!)
  />
</motion.div>
```

- Two nested infinite animations
- Continuous CPU usage even when idle
- Framer Motion's animation loop never stops

**Solution (CSS animations - more performant)**:

```css
/* Add to globals.css */
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(12px); }
}

@keyframes fade-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.scroll-indicator {
  animation: fade-pulse 2s ease-in-out infinite;
}

.scroll-indicator-dot {
  animation: scroll-bounce 1.5s ease-in-out infinite;
  will-change: transform;
}
```

```tsx
{/* Replace with CSS animations */}
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
  <div className="w-6 h-10 border-2 border-border-line rounded-full flex justify-center pt-2">
    <div className="w-1.5 h-2 bg-brand-primary rounded-full scroll-indicator-dot" />
  </div>
</div>
```

**Expected Result**: Same visual, ~70% less CPU usage

---

## 🔴 CRITICAL ISSUES - Build & Configuration

### Issue 4: Empty next.config.ts

**File**: `next.config.ts:1-7`
**Impact**: 🔴 CRITICAL - Missing ALL Next.js optimizations
**Effort**: 🛠️ 2 hours

**Current State**:

```ts
const nextConfig: NextConfig = {
  /* config options here */  // ❌ Completely empty
};
```

**Comprehensive Configuration**:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // ✅ Compiler Optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ✅ Performance
  compress: true,
  poweredByHeader: false,

  // ✅ Bundle Analysis
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../bundle-analysis.html',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),

  // ✅ Tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // ✅ Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
```

**Setup** (package.json):

```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  },
  "devDependencies": {
    "webpack-bundle-analyzer": "^4.10.1"
  }
}
```

**Expected Result**: Optimized images, security headers, bundle analysis, tree-shaking

---

### Issue 5: BrightnessContext Re-render Overhead

**File**: `src/lib/brightness-context.tsx:14-82`
**Impact**: 🔴 HIGH - Wraps entire app, full tree re-renders
**Effort**: 🛠️ 3 hours

**Problem**:

```tsx
export function BrightnessProvider({ children }) {
  const [brightness, setBrightnessState] = useState('0');

  useEffect(() => {
    const saved = localStorage.getItem('brightness-mode');  // ❌ Blocking read
    if (saved) setBrightnessState(saved);  // ❌ Triggers re-render
  }, []);

  useEffect(() => {
    // ❌ Complex auto-mode logic runs on every brightness change
    // ❌ setAttribute triggers style recalculation
    // ❌ setInterval every hour (unnecessary)
  }, [brightness]);
}
```

**Issues**:

1. Wraps entire app → all children re-render on brightness change
2. localStorage.getItem → synchronous blocking on mount
3. Multiple useEffects → cascading updates
4. setAttribute on documentElement → forces style recalculation

**Optimized Solution**:

```tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';

type BrightnessMode = '-2' | '-1' | '0' | '+1' | '+2' | 'auto';

const BrightnessContext = createContext<{ brightness: BrightnessMode; setBrightness: (mode: BrightnessMode) => void } | undefined>(undefined);

const calculateAutoBrightness = (): string => {
  const hour = new Date().getHours();
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) return hour >= 22 || hour < 5 ? '-1' : '0';
  return hour >= 18 || hour < 8 ? '+1' : '+2';
};

export function BrightnessProvider({ children }: { children: React.ReactNode }) {
  // ✅ Initialize from localStorage immediately (no extra render)
  const [brightness, setBrightnessState] = useState<BrightnessMode>(() => {
    if (typeof window === 'undefined') return '0';
    return (localStorage.getItem('brightness-mode') as BrightnessMode) || '0';
  });

  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Memoize context value
  const contextValue = useMemo(() => ({
    brightness,
    setBrightness: (mode: BrightnessMode) => {
      setBrightnessState(mode);
      localStorage.setItem('brightness-mode', mode);
    },
  }), [brightness]);

  useEffect(() => {
    const root = document.documentElement;

    if (brightness === 'auto') {
      const applyAutoTheme = () => root.setAttribute('data-brightness', calculateAutoBrightness());
      applyAutoTheme();

      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', applyAutoTheme);

      // ✅ Check every 30min instead of 1hr
      autoIntervalRef.current = setInterval(applyAutoTheme, 30 * 60 * 1000);

      return () => {
        darkModeQuery.removeEventListener('change', applyAutoTheme);
        if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
      };
    } else {
      root.setAttribute('data-brightness', brightness);
    }
  }, [brightness]);

  return (
    <BrightnessContext.Provider value={contextValue}>
      {children}
    </BrightnessContext.Provider>
  );
}

export function useBrightness() {
  const context = useContext(BrightnessContext);
  if (!context) throw new Error('useBrightness must be used within BrightnessProvider');
  return context;
}
```

**Expected Result**: No blocking read, fewer re-renders, better auto mode

---

## 🟡 IMPORTANT - Backend/API Performance

### Issue 6: No API Caching

**Files**: `src/app/api/tools/list-projects/route.ts`, `src/app/api/tools/get-contact/route.ts`
**Impact**: 🟡 MEDIUM - Unnecessary computation
**Effort**: ⚡ 1 hour

**Problem**:

```ts
export async function POST(request: NextRequest) {
  let filteredProjects = projects;  // ❌ No caching
  // ... filtering runs every time
  return NextResponse.json({ ... });  // ❌ No Cache-Control headers
}
```

**Solution 1: Caching Headers**

```ts
const response = NextResponse.json({
  success: true,
  data: { projects: filteredProjects, total: filteredProjects.length },
});

// ✅ Add caching headers
response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
response.headers.set('CDN-Cache-Control', 'max-age=3600');

return response;
```

**Solution 2: Edge Runtime**

```ts
// ✅ Add at top of file
export const runtime = 'edge';
export const dynamic = 'force-static';

export async function POST(request: NextRequest) {
  // ... rest of code (no changes needed)
}
```

**Apply to ALL tool routes**:

- `src/app/api/tools/download-resume/route.ts`
- `src/app/api/tools/list-projects/route.ts`
- `src/app/api/tools/open-project/route.ts`
- `src/app/api/tools/get-contact/route.ts`

**Expected Result**: 50-80% faster API responses, CDN caching

---

### Issue 7: No Rate Limiting

**Files**: All `/api/tools/*` routes
**Impact**: 🟡 MEDIUM - Security risk
**Effort**: 🛠️ 2 hours

**Solution**:

1. **Install dependencies**:

```bash
npm install @upstash/ratelimit @upstash/redis
```

2. **Create utility** (`src/lib/rate-limit.ts`):

```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'omerakben-api',
});
```

3. **Apply to routes**:

```ts
import { ratelimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  // ... rest of handler
}
```

**Expected Result**: Protection from API abuse

---

## 🟢 RECOMMENDED - AI Capabilities (Pre-ChatKit)

### Issue 8: No Streaming for Agent Responses

**Status**: Not yet implemented
**Impact**: 🟢 LOW (until ChatKit implemented)
**Effort**: 🛠️ 4 hours

**Preparation** (`src/app/api/chatkit/chat/route.ts`):

```ts
export const runtime = 'edge';

import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const { messages } = await req.json();

  // ✅ Create streaming response
  const response = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

**Frontend**:

```tsx
import { useChat } from 'ai/react';

export function ChatWidget() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chatkit/chat',
  });

  return (/* chat UI */);
}
```

**Expected Result**: Real-time streaming, better UX

---

### Issue 9: No Token Optimization

**Files**: `src/data/facts.ts`, `src/data/projects.ts`
**Impact**: 🟢 LOW
**Effort**: 🛠️ 2 hours

**Problem**: Long descriptions could exceed context window

**Solution**:

```ts
export interface Project {
  // ... existing fields
  shortSummary: string;  // ✅ Max 20 tokens
  longDescription?: string;  // Only for UI
}

export function getProjectSummaryForAgent(project: Project): string {
  return project.shortSummary || project.description.slice(0, 100);
}

// Usage
const agentProjects = filteredProjects.map(p => ({
  ...p,
  description: getProjectSummaryForAgent(p),
  longDescription: undefined,  // Don't send to agent
}));
```

**Expected Result**: Lower token costs, faster responses

---

### Issue 10: No Response Caching for Agent

**Impact**: 🟢 LOW
**Effort**: 🛠️ 3 hours

**Solution (Vercel KV)**:

```ts
import { kv } from '@vercel/kv';

export async function getCachedAgentResponse(query: string): Promise<string | null> {
  const cacheKey = `agent:${query.toLowerCase().trim()}`;
  return await kv.get(cacheKey);
}

export async function setCachedAgentResponse(query: string, response: string, ttl: number = 3600): Promise<void> {
  const cacheKey = `agent:${query.toLowerCase().trim()}`;
  await kv.setex(cacheKey, ttl, response);
}

// Usage
const cached = await getCachedAgentResponse(lastUserMessage);
if (cached) return new Response(cached);

// ... call OpenAI
await setCachedAgentResponse(lastUserMessage, agentResponse);
```

**Expected Result**: Instant responses for common questions, lower costs

---

## 🟢 RECOMMENDED - Bundle Optimization

### Issue 11: No Code Splitting

**Files**: `src/components/hero-section.tsx`, `src/components/project-card.tsx`
**Impact**: 🟢 LOW
**Effort**: 🛠️ 2 hours

**Solution**:

```tsx
"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ✅ Lazy load heavy components
const HeroSection = dynamic(() => import('@/components/hero-section').then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="min-h-[calc(100vh-4rem)] animate-pulse bg-surf-1" />,
  ssr: false,
});

export default function HomePage() {
  return (
    <Suspense>
      <HeroSection />
    </Suspense>
  );
}
```

**Expected Result**: Smaller initial bundle, faster FCP

---

### Issue 12: Large Dependencies

**Files**: `package.json`
**Impact**: 🟢 MEDIUM
**Effort**: ⚡ 30 minutes

**Already configured** (from Issue #4):

```ts
experimental: {
  optimizePackageImports: ['lucide-react', 'framer-motion'],
}
```

**Verification**:

```bash
npm run analyze
npx depcheck
```

**Expected Result**: 20-30% smaller bundle

---

## 📋 Implementation Roadmap

### Phase 1: Quick Wins (1-2 days) ⚡

**Priority: Animation Performance (User Complaints)**

1. ✅ Fix slow scroll animations (project-card.tsx) - 15min
   - Change duration from 0.5s to 0.3s
   - Add `style={{ willChange: 'transform, opacity' }}`

2. ✅ Fix brightness transition jank (globals.css) - 30min
   - Remove `transition-colors` from body
   - Add targeted transitions only where needed

3. ✅ Convert hero infinite animations to CSS - 30min
   - Replace Framer Motion with CSS keyframes
   - Add `will-change` optimization

4. ✅ Add will-change CSS for animations (globals.css) - 15min

   ```css
   @media (prefers-reduced-motion: no-preference) {
     .motion-safe { will-change: transform, opacity; }
   }
   ```

**Expected Impact**: Immediate user satisfaction, smooth animations

### Phase 2: Configuration & Caching (1 week) 🛠️

**Priority: Foundation for All Improvements**

1. ✅ Configure next.config.ts - 2hrs
   - Image optimization
   - Security headers
   - Bundle analyzer
   - Tree-shaking for lucide-react + framer-motion

2. ✅ Add API caching headers - 1hr
   - Cache-Control for static data
   - Edge runtime for all tool routes

3. ✅ Optimize BrightnessContext - 3hrs
   - Lazy localStorage read
   - Memoized context value
   - Reduced interval checks

4. ✅ Add rate limiting - 2hrs
   - Upstash Redis setup
   - Rate limit middleware
   - Apply to all API routes

**Expected Impact**: Better performance metrics, foundation for ChatKit

### Phase 3: Code Splitting & Bundle (1-2 weeks) 🏗️

**Priority: Long-term Performance**

1. ⏳ Implement code splitting - 2hrs
   - Dynamic imports for heavy components
   - Lazy load Framer Motion

2. ⏳ Analyze bundle size - 1hr
   - Run webpack-bundle-analyzer
   - Identify large dependencies
   - Optimize imports

3. ⏳ Verify tree-shaking - 30min
   - Check lucide-react imports
   - Verify framer-motion optimization

**Expected Impact**: Smaller bundle, faster FCP/LCP

### Phase 4: AI Capabilities (When ChatKit Implemented) 🤖

**Priority: ChatKit Preparation**

1. ⏳ Implement streaming - 4hrs
   - OpenAI streaming setup
   - Frontend useChat integration

2. ⏳ Add token optimization - 2hrs
   - Short summaries for agent
   - Token counting

3. ⏳ Implement response caching - 3hrs
   - Vercel KV setup
   - Cache common queries

**Expected Impact**: Fast AI responses, lower costs

---

## 🎯 Success Metrics

### Performance Targets

**Before Optimization (Estimated)**:

- Lighthouse Score: ~75-80
- LCP: ~3-4s
- INP: ~250-300ms
- Bundle Size: ~500KB
- API Response: ~200-300ms

**After Phase 1 (Quick Wins)**:

- Lighthouse Score: ~85-90
- LCP: ~2-2.5s
- INP: ~150-200ms
- Animation Smoothness: 60fps
- User Satisfaction: ✅ Fixed complaints

**After Phase 2 (Configuration)**:

- Lighthouse Score: ~90-95
- API Response: ~50-100ms (edge + cache)
- Security: ✅ All headers configured
- Rate Limiting: ✅ Protected

**After Phase 3 (Bundle Optimization)**:

- Lighthouse Score: ≥95 ✅
- LCP: <2.5s ✅
- INP: <200ms ✅
- Bundle Size: ~300KB (-40%)

**After Phase 4 (AI)**:

- Agent Response Time: <1s (streaming)
- Token Costs: -50% (optimization + caching)
- User Experience: Real-time responses

---

## 🔍 Monitoring & Validation

### Tools to Use

1. **Lighthouse** (Chrome DevTools)

   ```bash
   npm install -g @lhci/cli
   lhci autorun
   ```

2. **Webpack Bundle Analyzer**

   ```bash
   npm run analyze
   ```

3. **Vercel Analytics** (already setup)
   - Monitor real user metrics
   - Track Core Web Vitals

4. **Browser DevTools**
   - Performance tab for profiling
   - Network tab for API timing

### Validation Checklist

**After Each Phase**:

- [ ] Run Lighthouse audit
- [ ] Check Vercel Analytics
- [ ] Test on mobile device
- [ ] Verify animations at 60fps
- [ ] Test brightness changes (smooth)
- [ ] Check API response times

**Before Production Deploy**:

- [ ] Lighthouse score ≥95
- [ ] All animations smooth
- [ ] No console errors
- [ ] Security headers verified
- [ ] Rate limiting tested

---

## Universal Performance Checklist

### Response Time

- [ ] Initial load time measured?
- [ ] User interaction responsiveness checked?
- [ ] API response times profiled?
- [ ] Database query times analyzed?

### Resource Usage

- [ ] Memory consumption tracked?
- [ ] CPU utilization measured?
- [ ] Network bandwidth analyzed?
- [ ] Storage I/O profiled?

### Scalability

- [ ] Load testing performed?
- [ ] Concurrent user limits known?
- [ ] Resource scaling documented?
- [ ] Breaking points identified?

### Efficiency

- [ ] Algorithm complexity reviewed (O notation)?
- [ ] Redundant operations eliminated?
- [ ] Caching opportunities identified?
- [ ] Batch processing considered?

## Performance by Application Type

### Web Frontend

**Metrics to Check**:

- **LCP** (Largest Contentful Paint) < 2.5s
- **INP** (Interaction to Next Paint) < 200ms
- **CLS** (Cumulative Layout Shift) < 0.1
- **Bundle Size** - JavaScript, CSS, images
- **Network Requests** - Count and waterfall

**Common Issues**:

- Large JavaScript bundles
- Render-blocking resources
- Unoptimized images
- Missing browser caching

### Backend/API

**Metrics to Check**:

- **Response Time** - p50, p95, p99
- **Throughput** - Requests/second
- **Error Rate** - 4xx, 5xx responses
- **Resource Usage** - CPU, memory, connections

**Common Issues**:

- N+1 database queries
- Missing database indexes
- Synchronous blocking operations
- Memory leaks

---

**Focus on measurable improvements that matter to users. Always verify optimizations actually improve real-world performance, not just benchmarks.**
