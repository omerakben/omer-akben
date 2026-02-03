---
title: "Performance Testing Checklist"
description: "Performance validation workflow: static analysis, production build profiling, bundle analysis, and UI interaction performance testing with Framer Motion"
date: 2025-11-02
status: stable
tags: [performance, testing, profiling, bundle-analysis, framer-motion]
---

# Performance Testing Checklist

This project uses Next.js 15 with the App Router and client-side interactions powered by Framer Motion. To confirm that UI refinements remain performant, run the following checks locally before shipping changes:

## 1. Static Analysis

- `npm run lint` — ensures UI components keep consistent semantics and helps catch regressions that could trigger layout thrash.

## 2. Production Build Profiling

- `npm run build` — compiles the app with React 19 and emits timing stats for each route. Compare successive runs to spot expensive pages or slow image optimizations.

## 3. Bundle Inspection (Optional)

- `npm run analyze` — launches the Next.js bundle analyzer so you can audit third-party dependencies that bloat the JavaScript payload.

## 4. Lighthouse Regression Sweep

1. `npm run dev` in one terminal.
2. In another terminal, run `npx @lhci/cli autorun --collect.url=http://localhost:3001/ --collect.url=http://localhost:3001/projects`.
3. Track the LCP and INP trends in `.lighthouseci/` between commits.

## 5. Animation Smoothness Spot Check

- Open Chrome DevTools → Performance, record a scroll session through the projects grid, and verify `Frames` stay at or below 16ms.

Document notable metric changes in your pull request description so reviewers can validate improvements quickly.
