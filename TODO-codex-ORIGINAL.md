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

**Metrics to Check:**

- **LCP** (Largest Contentful Paint) < 2.5s
- **INP** (Interaction to Next Paint) < 200ms
- **CLS** (Cumulative Layout Shift) < 0.1
- **Bundle Size** - JavaScript, CSS, images
- **Network Requests** - Count and waterfall

**Common Issues:**

- Large JavaScript bundles
- Render-blocking resources
- Unoptimized images
- Missing browser caching

### Backend/API

**Metrics to Check:**

- **Response Time** - p50, p95, p99
- **Throughput** - Requests/second
- **Error Rate** - 4xx, 5xx responses
- **Resource Usage** - CPU, memory, connections

**Common Issues:**

- N+1 database queries
- Missing database indexes
- Synchronous blocking operations
- Memory leaks

### Mobile App

**Metrics to Check:**

- **App Launch Time** - Cold and warm start
- **Memory Usage** - Peak and average
- **Battery Consumption** - Power efficiency
- **Network Usage** - Data consumption

**Common Issues:**

- Main thread blocking
- Memory retention issues
- Excessive network calls
- Large local storage

### Database

**Metrics to Check:**

- **Query Time** - Slow query log
- **Connection Pool** - Usage and waits
- **Index Usage** - Missing or unused
- **Lock Contention** - Deadlocks, waits

**Common Issues:**

- Full table scans
- Missing indexes
- Inefficient joins
- Lock contention

## Performance Finding Format

### Issue: [Performance Problem]

**Impact**: User experience degradation
**Current**: [Measured baseline]
**Target**: [Desired performance]
**Root Cause**: [Why it's slow]
**Solution**: [How to fix]
**Expected Improvement**: [Quantified benefit]

## Optimization Strategies

### 🚀 Quick Wins (Hours)

- Enable compression (gzip/brotli)
- Add missing database indexes
- Implement simple caching
- Optimize images/assets
- Fix obvious N+1 queries

### 💪 Medium Effort (Days)

- Implement CDN
- Add caching layers (Redis/Memcached)
- Code splitting and lazy loading
- Query optimization
- Connection pooling

### 🏗️ Major Changes (Weeks)

- Architecture redesign
- Database sharding/partitioning
- Microservices migration
- Technology stack changes
- Complete rewrite of critical paths

## Performance Budget

Set measurable targets:

```yaml
# Example Performance Budget
response_times:
  api: < 200ms (p95)
  page_load: < 3s
  interaction: < 100ms

resources:
  javascript: < 300KB
  css: < 50KB
  images: < 500KB (per page)

availability:
  uptime: > 99.9%
  error_rate: < 0.1%
```

## Monitoring & Validation

### Before Optimization

1. Establish baseline metrics
2. Document current performance
3. Set improvement targets

### During Optimization

1. Make one change at a time
2. Measure impact of each change
3. Document what worked/didn't work

### After Optimization

1. Verify improvements in production
2. Set up continuous monitoring
3. Create alerts for regressions

## Performance Testing Tools

### Generic Tools

- Load testing: Apache JMeter, k6, Gatling
- Profiling: Browser DevTools, Application profilers
- Monitoring: APM solutions, Custom metrics

### Platform-Specific

- Web: Lighthouse, WebPageTest
- Mobile: Platform profilers (Xcode, Android Studio)
- Backend: Language-specific profilers
- Database: Query analyzers, EXPLAIN plans

## Action Priority Matrix

| Impact ↓ Effort → | Low        | Medium    | High         |
| ----------------- | ---------- | --------- | ------------ |
| **High Impact**   | Do First!  | Plan Soon | Evaluate ROI |
| **Medium Impact** | Quick Wins | Consider  | Usually Skip |
| **Low Impact**    | If Time    | Rarely    | Never        |

---

Focus on measurable improvements that matter to users. Always verify optimizations actually improve real-world performance, not just benchmarks.
