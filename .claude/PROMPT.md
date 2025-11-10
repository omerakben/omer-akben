```bash
#ACTION#

PROJECT: omer-akben Portfolio
TASK: Pre-Production PR Review - 23 Files
PR: [pre-deployment]
AGENT: test-engineer
SKILLS: testing-and-quality-gates-skill, git-workflow-and-deployment-skill
SEVERITY: Critical - Production Release

OBJECTIVE:
Crystal clear validation of 23-file PR before production deployment.
Zero warnings, zero errors, zero bugs - comprehensive quality assurance.

CURRENT BRANCH:
[pre-deployment]

PR SCOPE:
22 files changed - requires exhaustive validation

VALIDATION STRATEGY:
Execute all quality gates with verbose output, then comprehensive testing.

CHECKPOINT STRUCTURE:
- 25%: All 6 quality gates pass - PAUSE for verification
- 50%: Manual testing complete (all 8 brightness modes + critical paths) - PAUSE
- 75%: Cross-browser testing + performance check - PAUSE
- 100%: Production-ready confirmation + deployment plan

PHASE 1: AUTOMATED QUALITY GATES (Execute Immediately)
==========================================

Run each gate individually with full output for diagnosis:

GATE 1 - ESLint (Zero Tolerance):
```bash
npm run lint
```typescript

Expected: 0 errors, 0 warnings
If any issues: Fix immediately, do not proceed

GATE 2 - TypeScript (Zero Tolerance):

```bash
npx tsc --noEmit
```typescript

Expected: 0 errors
If any issues: Fix immediately, do not proceed

GATE 3 - Unit Tests (All Tests Required):

```bash
npm test
```typescript

Expected: All tests passing, 0 failures
If any failures: Investigate and fix immediately

GATE 4 - Build Success:

```bash
npm run build
```typescript

Expected: Successful build, no errors
If build fails: Debug and fix immediately

GATE 5 - Bundle Size (Critical):

```bash
npm run size
```typescript

Expected: Homepage < 40KB, all routes within limits
If over limit: Investigate what caused increase in 22 files

GATE 6 - E2E Tests (All Tests Required):

```bash
npm run test:e2e
```typescript

Expected: All tests passing, 0 failures
If failures: Critical - investigate UI regressions

PHASE 2: MANUAL VALIDATION (After All Gates Pass)
==========================================

BRIGHTNESS MODE TESTING (All 8 Modes):
Test critical user paths across ALL brightness modes:

- [ ] Mode -3 (darkest) - Check contrast, visibility
- [ ] Mode -2 - Check transitions
- [ ] Mode -1 - Check readability
- [ ] Mode 0 (baseline) - Check default experience
- [ ] Mode +1 - Check brightness increase
- [ ] Mode +2 - Check high brightness
- [ ] Mode +3 (brightest) - Check maximum brightness
- [ ] Auto mode - Check system preference detection

CRITICAL USER PATHS:

- [ ] Homepage load and interaction
- [ ] Chat sidebar (open, close, resize, pin)
- [ ] All AI agent tools (11 tools tested)
- [ ] Contact form submission (rate-limiting)
- [ ] Resume downloads (4 formats)
- [ ] Project navigation
- [ ] Navigation between all routes
- [ ] Mobile responsiveness (320px - 1920px)

HYDRATION VALIDATION:

- [ ] No hydration errors in console
- [ ] localStorage working correctly
- [ ] Browser API usage safe (isMounted pattern)
- [ ] No layout shift on load

PHASE 3: FILE CHANGE AUDIT (98 Files)
==========================================

High-risk file categories to inspect:

Check these directories for potential issues:

```bash
# List all changed files
git diff --name-only origin/main

# Group by directory
git diff --name-status origin/main | sort
```typescript

RED FLAGS TO INVESTIGATE:

- [ ] Any changes to core layout files (app/layout.tsx)
- [ ] Any changes to globals.css (brightness system)
- [ ] Any changes to API routes (security implications)
- [ ] Any changes to environment config
- [ ] Any new dependencies (bundle size impact)
- [ ] Any changes to testing files (test integrity)

PHASE 4: REGRESSION TESTING
==========================================

SPECIFIC TESTS FOR LARGE PRs:

Performance Regression:

```bash
# Check homepage performance
ANALYZE=true npm run build
# Verify no significant bundle increase
```typescript

Memory Leaks:

- [ ] Open chat sidebar → send 20 messages → check memory
- [ ] Navigate between all routes 10 times → check memory
- [ ] Use React DevTools Profiler for any suspicious re-renders

API Regression:

- [ ] Test all 11 AI agent tools
- [ ] Verify rate-limiting still works (5/IP/24h for contact)
- [ ] Check Redis memory operations
- [ ] Test episodic memory search

PHASE 5: PRODUCTION READINESS
==========================================

FINAL CHECKLIST:

- [ ] All 6 quality gates pass ✅
- [ ] All 8 brightness modes tested ✅
- [ ] No console errors or warnings ✅
- [ ] No hydration errors ✅
- [ ] Performance benchmarks met ✅
- [ ] Security audit passed ✅
- [ ] Mobile responsive ✅
- [ ] Accessibility maintained (WCAG 2A) ✅
- [ ] No TODO comments ✅
- [ ] No console.log statements ✅
- [ ] All imports using @/ ✅
- [ ] All critical paths manually tested ✅
- [ ] No any console errors or warnings ✅
- [ ] Peer review completed ✅
- [ ] No any hardcoded keys in code ✅
- [ ] All environment variables used securely(.env) ✅
- [ ] No hard coded colors in CSS/JSX ✅
- [ ] All new code covered by tests ✅


DEPLOYMENT PLAN:

```bash
# Merge to pre-deployment
git checkout pre-deployment
git pull origin pre-deployment
git merge [your-branch]
git push origin pre-deployment

# CI/CD will auto-run gates
# Auto-merge to main if all pass
# Vercel deploys to production
```typescript

ROLLBACK PLAN:
If any production issues detected:

```bash
# Revert the merge commit
git revert [merge-commit-hash]
git push origin main
```typescript

Execute with minimal interruption.
Pause ONLY at checkpoints (25%, 50%, 75%, 100%) for critical review.
Report any failures immediately - do not proceed past failures.

====================
START EXECUTION NOW
====================

```typescript

---

## 🚀 IMMEDIATE ACTIONS FOR YOU

**Step 1: Run This Single Command First**
```bash
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run size && npm run test:e2e
```typescript

This runs all 6 gates in sequence. **Tell me the output** - any failures mean we stop and fix immediately.

### Step 2: While Gates Run, Give Me

1. Your branch name
2. What this 98-file PR does (high-level)
3. Any specific concerns you have

### Step 3: If All Gates Pass
I'll guide you through manual validation focusing on the highest-risk areas based on what changed.

---

## ⚠️ CRITICAL CHECKPOINTS

### 🛑 STOP & REPORT if you see

- Any ESLint errors/warnings
- Any TypeScript errors
- Any test failures
- Build failures
- Bundle size over limits
- E2E test failures
- Console errors during manual testing
- Hydration errors
- Performance regressions

**This is your production safety net. Let's execute methodically.**
