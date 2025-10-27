# Bundle Size Analysis

**Date**: 2025-10-12
**Build Tool**: Next.js 15.5.4 with Turbopack
**Command**: `npm run analyze`

## Executive Summary

- **Total Routes**: 22 (18 static, 4 edge functions)
- **Shared JS**: 166 kB across all pages
- **Middleware**: 39.3 kB
- **Largest Pages**: Home (2.33 MB), Skills (2.32 MB)
- **Smallest Pages**: Most individual pages ~3-13 kB (excluding shared chunks)

## ⚠️ Key Findings

### 🔴 Critical Issues

**1. Large First Load JS on Key Pages**

- **Home page (/)**: 2.33 MB First Load JS
- **Skills page (/skills)**: 2.32 MB First Load JS
- **Issue**: These pages significantly exceed performance budgets
- **Impact**: Slower initial page load, worse mobile experience
- **Root Cause**: Likely due to:
  - Motion/Framer Motion animations
  - simple-icons library (even with modular imports)
  - Large component trees with many dependencies

**2. Turbopack + Bundle Analyzer Compatibility**

- @next/bundle-analyzer doesn't generate interactive visualization with Turbopack
- Unable to get detailed tree-map view of exact dependency sizes
- Recommendation: Consider temporary Webpack build for deeper analysis

### 🟡 Optimization Opportunities

**1. Simple Icons Import Pattern**

- Current: Modular imports configured in next.config.ts
- Status: Already optimized with tree-shaking
- Evidence: Individual page sizes are reasonable (3-13 kB)
- The large First Load JS is likely NOT from simple-icons

**2. Motion/Framer Motion**

- Used extensively for animations across the site
- Contributes significantly to bundle size
- Consider: Lazy loading motion components or using CSS animations for simpler cases

**3. Shared Chunks Analysis**

- 166 kB shared across all pages (reasonable)
- Breakdown:
  - `chunks/b5c92068e29232ea.js`: 59.2 kB (largest)
  - `chunks/bd5729dea52ceeb1.js`: 20.5 kB
  - `chunks/bf72d9915bda63ed.js`: 17.2 kB
  - `chunks/f1cb70e9c636fb00.js`: 15 kB
  - `chunks/a0565b21c0e3dc45.js`: 13 kB
  - `chunks/1c9f64ddfe332d4d.css`: 13.5 kB (styles)
  - Other shared chunks: 28.2 kB

## 📊 Detailed Route Analysis

### Static Pages (Pre-rendered)

| Route                         | Page Size | First Load JS | Notes                                           |
| ----------------------------- | --------- | ------------- | ----------------------------------------------- |
| `/` (Home)                    | 13.2 kB   | 2.33 MB       | ⚠️ Largest First Load - animation-heavy          |
| `/skills`                     | 4.32 kB   | 2.32 MB       | ⚠️ Second largest - likely simple-icons + motion |
| `/projects`                   | 11.6 kB   | 203 kB        | ✅ Reasonable                                    |
| `/journey`                    | 6.14 kB   | 197 kB        | ✅ Reasonable                                    |
| `/credentials`                | 6.49 kB   | 198 kB        | ✅ Reasonable                                    |
| `/contact`                    | 3.65 kB   | 195 kB        | ✅ Reasonable                                    |
| `/projects/elon-ai-toolbox`   | 5.24 kB   | 158 kB        | ✅ Good                                          |
| `/projects/capstone-deadline` | 0 B       | 153 kB        | ✅ Good                                          |
| `/projects/[slug]` (9 paths)  | 0 B       | 153 kB        | ✅ Good                                          |
| `/recruiter`                  | 0 B       | 153 kB        | ✅ Good                                          |
| `/_not-found`                 | 0 B       | 153 kB        | ✅ Good                                          |

### Edge Functions

| Route                        | Size | Notes        |
| ---------------------------- | ---- | ------------ |
| `/api/tools/download-resume` | 0 B  | Edge runtime |
| `/api/tools/get-contact`     | 0 B  | Edge runtime |
| `/api/tools/list-projects`   | 0 B  | Edge runtime |
| `/api/tools/open-project`    | 0 B  | Edge runtime |

## 🎯 Recommended Actions

### Immediate (High Priority)

1. **Investigate Home Page Bundle**
   - Use temporary Webpack build: Remove `--turbopack` flag temporarily
   - Run `npm run analyze` without Turbopack to get interactive visualization
   - Identify exact dependencies causing 2.3 MB First Load JS

2. **Lazy Load Motion Components**

   ```tsx
   // Example pattern
   const MotionDiv = dynamic(() => import('motion/react').then(mod => mod.motion.div), {
     ssr: false,
   });
   ```

3. **Skills Page Optimization**
   - Review simple-icons usage patterns
   - Consider lazy loading icon grids
   - Profile actual bundle to confirm culprit

### Short Term (Medium Priority)

1. **Code Splitting Strategy**
   - Use dynamic imports for heavy components
   - Implement route-based code splitting for project detail pages
   - Lazy load below-the-fold content

2. **Performance Budget**
   - Set First Load JS budget: Target <500 kB for key pages
   - Implement bundle size monitoring in CI/CD
   - Add lighthouse performance checks

3. **Alternative Animation Approach**
   - Evaluate CSS animations for simple transitions
   - Keep Framer Motion only for complex interactions
   - Consider reducing animation complexity on slower devices

### Long Term (Low Priority)

1. **Bundle Analysis Automation**
   - Set up automated bundle size tracking
   - Alert on significant size increases
   - Track bundle size trends over time

2. **Component Library Audit**
   - Review all shadcn/ui component imports
   - Ensure tree-shaking is working correctly
   - Consider component-level code splitting

3. **Dependency Audit**
   - Regular dependency size reviews
   - Consider lighter alternatives for heavy dependencies
   - Remove unused dependencies

## 🔍 Investigation Needed

### Mystery: 2.3 MB First Load JS

The home and skills pages have unusually large First Load JS (~2.3 MB) despite small individual page sizes (4-13 kB). This suggests:

1. **Hypothesis 1**: Large shared dependency loaded on these pages
   - Likely candidate: Framer Motion with all its features
   - Test: Build without motion imports to confirm

2. **Hypothesis 2**: Simple-icons loading many icons
   - Less likely given modular import config
   - Test: Check actual icon usage count

3. **Hypothesis 3**: Build artifact from Turbopack
   - Turbopack may bundle differently than Webpack
   - Test: Build with Webpack to compare

### Next Steps for Investigation

1. Temporarily remove `--turbopack` from build script
2. Run `npm run build` with Webpack
3. Compare bundle sizes between Turbopack and Webpack
4. Run `npm run analyze` with Webpack for interactive visualization
5. Use Chrome DevTools Coverage tab to identify unused code

## ✅ Positive Findings

1. **Shared Chunks Size**: 166 kB is reasonable and well-optimized
2. **Individual Page Sizes**: 3-13 kB is excellent
3. **Edge Functions**: Properly configured with 0 B bundle size
4. **Most Pages**: 18 out of 22 routes have reasonable First Load JS (<200 kB)
5. **Build Time**: 1.5 seconds is excellent
6. **Static Generation**: 22 routes pre-rendered successfully

## 📈 Performance Metrics

### Current State

- **Build Time**: 1.5s (excellent)
- **Static Pages**: 18/22 (good static-to-dynamic ratio)
- **Bundle Range**: 153 kB - 2.33 MB First Load JS
- **Shared Chunks**: 166 kB (reasonable)

### Target Goals

- **First Load JS**: <500 kB for all pages
- **Time to Interactive**: <3s on 3G
- **Lighthouse Score**: 95+ across all metrics
- **Bundle Growth**: <5% per feature addition

## 🛠️ Tooling Recommendations

1. **For Current Analysis**:

   ```bash
   # Temporarily use Webpack for detailed analysis
   npm run build  # without --turbopack flag
   npm run analyze
   ```

2. **For Ongoing Monitoring**:
   - Integrate bundlesize package for CI checks
   - Set up Lighthouse CI for automated performance testing
   - Use webpack-bundle-analyzer with Webpack builds

3. **For Deep Debugging**:
   - Chrome DevTools → Coverage tab
   - Source Map Explorer
   - webpack-bundle-analyzer (when using Webpack)

## 📋 Action Items Summary

- [ ] Investigate 2.3 MB First Load JS on home/skills pages
- [ ] Test build without Turbopack for bundle analyzer compatibility
- [ ] Implement lazy loading for heavy motion components
- [ ] Set up performance budgets and monitoring
- [ ] Consider CSS animations for simpler transitions
- [ ] Profile actual bundle to confirm optimization opportunities
- [ ] Set up automated bundle size tracking

## Notes

- **Turbopack Limitation**: Bundle analyzer doesn't work with Turbopack yet
- **Webpack Option**: Can temporarily remove `--turbopack` for detailed analysis
- **Build Output**: Used Next.js build output as primary data source
- **Status**: Bundle sizes documented, deep investigation pending
