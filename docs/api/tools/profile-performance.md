---
title: "profile_performance Tool"
description: "Development-only performance profiling tool that measures Core Web Vitals (LCP, FID, CLS, TTFB) with optional trace generation"
date: 2025-11-02
status: mvp
tags: [api, tool, performance, profiling, web-vitals, development]
---

# profile_performance Tool

Development-only performance profiling tool for measuring Core Web Vitals and identifying optimization opportunities.

## Purpose

Provides performance profiling during development for measuring Core Web Vitals (LCP, FID, CLS, TTFB) and generating actionable optimization suggestions. Currently returns mock metrics for MVP. Future integration planned with Chrome DevTools Protocol for real browser profiling.

## Use Cases

- Developer asks "How's the performance?"
- Performance baseline measurement during development
- Before/after performance comparison for UI changes
- Identifying performance bottlenecks in development
- Generating performance traces for detailed analysis
- Validating Core Web Vitals meet Google thresholds

## Endpoint

```
GET  /api/tools/profile-performance
POST /api/tools/profile-performance
```

**Availability**: Development environment only (`NODE_ENV=development`)

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

## Input Schema

### Parameters

```typescript
{
  includeScreenshots?: boolean,  // Optional, default: false
  duration?: number              // Optional, default: 5000ms
}
```

| Parameter            | Type    | Required | Default | Constraints      | Description                                 |
| -------------------- | ------- | -------- | ------- | ---------------- | ------------------------------------------- |
| `includeScreenshots` | boolean | No       | false   | -                | Generate performance trace with screenshots |
| `duration`           | number  | No       | 5000    | Positive integer | Profiling duration in milliseconds          |

### Validation Rules

- `includeScreenshots` defaults to false if not provided
- `duration` defaults to 5000ms (5 seconds) if not provided
- `duration` must be a positive number
- Only available in development environment

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    metrics: {
      lcp: number,       // Largest Contentful Paint (ms)
      fid: number,       // First Input Delay (ms)
      cls: number,       // Cumulative Layout Shift (score)
      ttfb: number       // Time to First Byte (ms)
    },
    suggestions: string[],   // Optimization recommendations
    traceUrl?: string        // Performance trace URL (if includeScreenshots=true)
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: string              // Error message
}
```

## Examples

### Example 1: Basic Performance Profile (Default Parameters)

**Request (GET)**:

```bash
curl http://localhost:3001/api/tools/profile-performance
```

**Request (POST)**:

```bash
curl -X POST http://localhost:3001/api/tools/profile-performance \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "metrics": {
      "lcp": 1250,
      "fid": 85,
      "cls": 0.08,
      "ttfb": 450
    },
    "suggestions": [
      "Consider lazy loading images to improve LCP",
      "Optimize JavaScript bundle size for better FID",
      "Use CSS containment to reduce CLS",
      "Enable HTTP/2 server push for faster TTFB"
    ]
  }
}
```

### Example 2: Profile with Screenshots and Trace

**Request (GET)**:

```bash
curl "http://localhost:3001/api/tools/profile-performance?includeScreenshots=true&duration=10000"
```

**Request (POST)**:

```bash
curl -X POST http://localhost:3001/api/tools/profile-performance \
  -H "Content-Type: application/json" \
  -d '{"includeScreenshots": true, "duration": 10000}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "metrics": {
      "lcp": 1250,
      "fid": 85,
      "cls": 0.08,
      "ttfb": 450
    },
    "suggestions": [
      "Consider lazy loading images to improve LCP",
      "Optimize JavaScript bundle size for better FID",
      "Use CSS containment to reduce CLS",
      "Enable HTTP/2 server push for faster TTFB"
    ],
    "traceUrl": "/traces/performance-trace.json"
  }
}
```

### Example 3: Production Environment Error

**Request**:

```bash
# In production environment
curl -X POST https://omerakben.com/api/tools/profile-performance \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** (403 Forbidden):

```json
{
  "success": false,
  "error": "Performance profiling is only available in development mode"
}
```

### Example 4: Invalid Parameter

**Request (POST)**:

```bash
curl -X POST http://localhost:3001/api/tools/profile-performance \
  -H "Content-Type: application/json" \
  -d '{"duration": -1000}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Duration must be a positive number"
}
```

## Core Web Vitals Reference

### Metric Thresholds (Google Standards)

| Metric   | Good    | Needs Improvement | Poor     | Description                                    |
| -------- | ------- | ----------------- | -------- | ---------------------------------------------- |
| **LCP**  | < 2.5s  | 2.5s - 4s         | > 4s     | Largest Contentful Paint - loading performance |
| **FID**  | < 100ms | 100ms - 300ms     | > 300ms  | First Input Delay - interactivity              |
| **CLS**  | < 0.1   | 0.1 - 0.25        | > 0.25   | Cumulative Layout Shift - visual stability     |
| **TTFB** | < 800ms | 800ms - 1800ms    | > 1800ms | Time to First Byte - server response time      |

### Metric Interpretation

**LCP (Largest Contentful Paint)**:

- Measures loading performance
- Represents when main content is visible
- Influenced by: server response time, resource load time, client-side rendering

**FID (First Input Delay)**:

- Measures interactivity
- Represents delay from first user interaction to browser response
- Influenced by: JavaScript execution time, main thread blocking

**CLS (Cumulative Layout Shift)**:

- Measures visual stability
- Represents unexpected layout shifts during page load
- Influenced by: images without dimensions, dynamic content injection, web fonts

**TTFB (Time to First Byte)**:

- Measures server responsiveness
- Represents time from request to first byte received
- Influenced by: server processing time, network latency, CDN performance

## Optimization Suggestions

The tool provides contextual suggestions based on metrics:

### LCP Optimization

- Lazy load images below the fold
- Optimize server response time
- Minimize render-blocking resources
- Preload critical resources

### FID Optimization

- Code-split JavaScript bundles
- Defer non-critical JavaScript
- Use web workers for heavy computations
- Minimize main thread work

### CLS Optimization

- Always include size attributes on images and videos
- Reserve space for ad slots
- Avoid inserting content above existing content
- Use CSS containment

### TTFB Optimization

- Use CDN for static assets
- Enable HTTP/2 server push
- Optimize database queries
- Implement server-side caching

## Error Handling

### Common Errors

| Status | Error                       | Cause                          | Solution                         |
| ------ | --------------------------- | ------------------------------ | -------------------------------- |
| 400    | Invalid duration            | Duration not a positive number | Use positive number (e.g., 5000) |
| 400    | Invalid request             | Malformed JSON                 | Verify JSON syntax               |
| 403    | Not available in production | NODE_ENV !== development       | Only use in development          |
| 429    | Rate limit exceeded         | Too many requests              | Wait 60 seconds and retry        |

## Implementation Details

**File Location**: `src/app/api/tools/profile-performance/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `profilePerformanceInputSchema`
- Output: `profilePerformanceOutputSchema`

**Current Status**: MVP with mock metrics

**Future Integration**:

- Chrome DevTools Protocol for real profiling
- Playwright performance traces
- Lighthouse CI integration
- Automated performance regression testing

**Features**:

- ✅ Core Web Vitals measurement
- ✅ Actionable optimization suggestions
- ✅ Optional performance trace generation
- ✅ Development-only restriction
- ✅ Zod schema validation
- ⏳ Real browser profiling (planned)
- ⏳ Historical performance tracking (planned)

## MVP vs Future Implementation

### Current (MVP)

```typescript
// Returns mock metrics
const mockMetrics = {
  metrics: {
    lcp: 1250,
    fid: 85,
    cls: 0.08,
    ttfb: 450
  },
  suggestions: [
    "Consider lazy loading images to improve LCP",
    "Optimize JavaScript bundle size for better FID"
  ]
};
```

### Future (Planned)

```typescript
// Real browser profiling via Chrome DevTools Protocol
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3001');

const metrics = await page.evaluate(() => ({
  lcp: performance.getEntriesByType('largest-contentful-paint')[0].renderTime,
  fid: performance.getEntriesByType('first-input')[0].processingStart,
  cls: performance.getEntriesByType('layout-shift')
    .reduce((sum, entry) => sum + entry.value, 0)
}));
```

## Related Tools

- [navigate_page](navigate-page.md) - Navigate before profiling
- [extract_summary](extract-summary.md) - Content analysis after performance check

## Performance Notes

- **MVP**: Instant response (<10ms) with mock data
- **Future**: 5-10s profiling time with real metrics
- **Trace Size**: 1-5MB JSON trace files with screenshots
- **Storage**: Traces stored in `/traces/` directory (git-ignored)

## Usage Patterns

### Pattern 1: Before/After Comparison

```typescript
// Before optimization
const before = await profile_performance({ duration: 5000 });
console.log('Before LCP:', before.metrics.lcp);

// Make optimizations (lazy loading, code splitting)

// After optimization
const after = await profile_performance({ duration: 5000 });
console.log('After LCP:', after.metrics.lcp);
console.log('Improvement:', before.metrics.lcp - after.metrics.lcp, 'ms');
```

### Pattern 2: Performance Regression Testing

```typescript
// Run performance check in CI
const metrics = await profile_performance({});

// Fail build if metrics exceed thresholds
if (metrics.lcp > 2500 || metrics.fid > 100 || metrics.cls > 0.1) {
  throw new Error('Performance regression detected!');
}
```

## Changelog

- **2025-10-20**: MVP implementation with mock metrics
- **Future**: Chrome DevTools Protocol integration planned
- **Future**: Lighthouse CI integration planned
