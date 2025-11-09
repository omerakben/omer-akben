# PROMPT TEMPLATES - Agentic Flow Optimization

**Purpose:** Standardized prompt templates for consistent, high-quality work across all project tasks.

**Last Updated:** 2025-11-08

---

## 📋 Template Index

### Development Templates

1. [Feature Development](#1-feature-development-template)
2. [Bug Fix & Investigation](#2-bug-fix--investigation-template)
3. [UI/UX Enhancement](#3-uiux-enhancement-template)
4. [API & Backend Logic](#4-api--backend-logic-template)
5. [Testing Implementation](#5-testing-implementation-template)

### Optimization Templates

6. [Performance Optimization](#6-performance-optimization-template)
7. [Bundle Size Reduction](#7-bundle-size-reduction-template)
8. [Memory System Optimization](#8-memory-system-optimization-template)

### Research Templates

9. [Technical Research](#9-technical-research-template)
10. [Library/Framework Investigation](#10-libraryframework-investigation-template)
11. [Competitive Analysis](#11-competitive-analysis-template)

### Infrastructure Templates

12. [Deployment & CI/CD](#12-deployment--cicd-template)
13. [Security Audit](#13-security-audit-template)
14. [Quality Gate Debugging](#14-quality-gate-debugging-template)

### Documentation Templates

15. [Technical Documentation](#15-technical-documentation-template)
16. [Skill Creation](#16-skill-creation-template)
17. [Agent Enhancement](#17-agent-enhancement-template)

---

## Development Templates

### 1. Feature Development Template

```
#PLAN#

PROJECT: omer-akben Portfolio
FEATURE: [Feature name]
AGENT: [Select from: ui-ux-developer, nextjs-architect, ai-sdk-specialist, test-engineer]
SKILLS: [Select relevant skills from .claude/skills/]

OBJECTIVE:
[Clear, specific description of what needs to be built]

REQUIREMENTS:
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3
- [ ] Must pass all 6 quality gates
- [ ] Must work across all 8 brightness modes (-3 to +3, auto)
- [ ] Must follow hydration safety patterns
- [ ] Must use @/ imports only (no relative imports)

CONTEXT:
[Any relevant background, constraints, or dependencies]

SUCCESS CRITERIA:
- [ ] Functional requirement met
- [ ] Tests pass (unit + E2E)
- [ ] TypeScript 0 errors
- [ ] ESLint 0 errors/warnings
- [ ] Bundle size within limits
- [ ] Brightness modes tested
- [ ] Accessibility maintained (WCAG 2A)

CHECKPOINT STRUCTURE:
- 25%: [Milestone description] - PAUSE for review
- 50%: [Milestone description] - PAUSE for review
- 75%: [Milestone description] - PAUSE for review
- 100%: Final quality gates + deployment readiness

DOCUMENTATION PERMISSION:
May I create the following documents for tracking?
- [ ] FeatureName_Plan_2025-11-08.gdoc
- [ ] FeatureName_Tracker_2025-11-08.gsheet

Please provide a comprehensive implementation plan with:
1. Architecture approach
2. File structure changes
3. Component breakdown
4. Testing strategy
5. Quality gate considerations
6. Risk assessment
```

**When to Use:**

- New feature development
- Major component additions
- New AI agent tools
- Complex UI implementations

**Agent Recommendations:**

- UI work: `ui-ux-developer` + `brightness-system-skill`
- API work: `ai-sdk-specialist` + `aI-agent-implementation-skill`
- Full-stack: `nextjs-architect` + `hydration-safety-skill`

---

### 2. Bug Fix & Investigation Template

```
#RESEARCH#

PROJECT: omer-akben Portfolio
BUG: [Bug title/ID]
SEVERITY: [Critical | High | Medium | Low]
AGENT: [Select appropriate agent based on bug domain]

OBSERVED BEHAVIOR:
[What's actually happening?]

EXPECTED BEHAVIOR:
[What should happen?]

REPRODUCTION STEPS:
1. [Step 1]
2. [Step 2]
3. [Step 3]

ENVIRONMENT:
- Branch: [current branch]
- Node version: [version]
- Browser: [if relevant]
- Test output: [if test failure]

ERROR MESSAGES:
```

[Paste any error messages, stack traces, or logs]

```

INITIAL INVESTIGATION:
Search and analyze:
1. Related files in codebase
2. Similar issues in project history (Google Drive search)
3. Framework documentation (Context7)
4. Community solutions (web_search)

RESEARCH GOALS:
- [ ] Identify root cause
- [ ] Find similar resolved issues
- [ ] Document affected components
- [ ] List potential solutions with pros/cons

After research phase, switch to:
#ACTION# to implement the fix with minimal interruption, pausing at:
- 25%: Root cause confirmed + solution selected
- 50%: Fix implemented + local tests pass
- 75%: All quality gates pass
- 100%: PR ready + documentation updated
```

**When to Use:**

- Unexpected errors
- Test failures
- Production issues
- Performance regressions

**Agent Recommendations:**

- Hydration errors: `nextjs-architect` + `hydration-safety-skill`
- Test failures: `test-engineer` + `testing-and-quality-gates-skill`
- Bundle issues: `mastra-optimization-researcher` + `bundle-optimization-skill`
- Deployment issues: `deployment-engineer` + `git-workflow-and-deployment-skill`

---

### 3. UI/UX Enhancement Template

```
#PLAN#

PROJECT: omer-akben Portfolio
ENHANCEMENT: [Enhancement name]
AGENT: ui-ux-developer
SKILLS: brightness-system-skill, hydration-safety-skill

DESIGN GOAL:
[What user experience are we improving?]

CURRENT STATE:
[How does it work now?]

PROPOSED STATE:
[How should it work?]

BRIGHTNESS MODE REQUIREMENTS:
Must test and verify across ALL 8 modes:
- [ ] Mode -3 (darkest)
- [ ] Mode -2
- [ ] Mode -1
- [ ] Mode 0 (baseline)
- [ ] Mode +1
- [ ] Mode +2
- [ ] Mode +3 (brightest)
- [ ] Auto mode

DESIGN CONSTRAINTS:
- [ ] Use CSS custom properties only (no hardcoded colors)
- [ ] Use Tailwind utility classes
- [ ] Use Lucide icons only (no emojis)
- [ ] Maintain WCAG 2A compliance
- [ ] No inline styles
- [ ] Responsive design (mobile-first)

HYDRATION CONSIDERATIONS:
- [ ] Uses browser APIs? → Requires isMounted pattern
- [ ] Uses localStorage? → Requires hydration safety
- [ ] Animation/transitions? → Test hydration timing

CHECKPOINT STRUCTURE:
- 25%: Component structure + base styling - PAUSE
- 50%: Brightness modes 0-3 working - PAUSE
- 75%: All 8 modes working + responsive - PAUSE
- 100%: E2E tests + accessibility verified

Please provide:
1. Component architecture
2. CSS custom property strategy
3. Brightness mode implementation plan
4. Testing approach for all modes
5. Accessibility considerations
```

**When to Use:**

- Styling improvements
- Component refinements
- Animation additions
- Responsive design fixes
- Accessibility enhancements

---

### 4. API & Backend Logic Template

```
#PLAN#

PROJECT: omer-akben Portfolio
API: [API/Tool name]
AGENT: ai-sdk-specialist
SKILLS: aI-agent-implementation-skill, environment-configuration-skill

API PURPOSE:
[What does this API/tool do?]

TOOL SPECIFICATIONS:
- Tool name: [snake_case name]
- Input schema: [Zod schema requirements]
- Output format: [JSON structure]
- Rate limits: [if applicable]
- Authentication: [if required]

INTEGRATION POINTS:
- AI SDK version: v5
- Model: XAI (Grok) primary, OpenAI fallback
- Memory: [Episodic/Semantic/None]
- Redis: [Rate limiting/Caching/None]
- External APIs: [List any]

SECURITY REQUIREMENTS:
- [ ] Server-side execution only
- [ ] Input validation (Zod)
- [ ] Error handling (try/catch)
- [ ] Rate limiting (if applicable)
- [ ] No PII in logs
- [ ] Environment variables for secrets

DATA FLOW:
```

Chat UI → AI SDK → Tool call → Zod validation → Handler → Redis/DB → JSON response

```

CHECKPOINT STRUCTURE:
- 25%: Schema defined + validation working - PAUSE
- 50%: Core logic implemented + error handling - PAUSE
- 75%: Integration complete + unit tests - PAUSE
- 100%: E2E tests + rate limiting verified

DOCUMENTATION PERMISSION:
Create API documentation?
- [ ] ToolName_Implementation_2025-11-08.gdoc

Please provide:
1. Zod schema design
2. Handler implementation approach
3. Error handling strategy
4. Testing plan (unit + integration)
5. Rate limiting configuration
```

**When to Use:**

- New AI agent tools
- API route creation
- Server action implementation
- External API integration
- Database operations

---

### 5. Testing Implementation Template

```
#ACTION#

PROJECT: omer-akben Portfolio
TESTING: [Feature/Component to test]
AGENT: test-engineer
SKILL: testing-and-quality-gates-skill

TEST TYPE:
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Integration tests
- [ ] Accessibility tests

COVERAGE REQUIREMENTS:
- Unit tests: Cover all logic paths
- E2E tests: Cover user journeys
- Current baseline: 776 unit tests, 66 E2E tests

HYDRATION TEST PATTERN:
```typescript
// For components with browser APIs
await page.goto("/", { waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="ready"]');
await page.waitForTimeout(500); // Stabilization
// Now safe to interact
```

TEST SCENARIOS:

1. [Happy path]
2. [Error case 1]
3. [Error case 2]
4. [Edge case]

CHECKPOINT STRUCTURE:

- 25%: Test structure + happy path - Execute tests
- 50%: Error cases covered - Execute tests
- 75%: Edge cases + integration - Execute tests
- 100%: All quality gates pass

QUALITY GATE EXECUTION:

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run size && npm run test:e2e
```

Proceed with minimal interruption. Pause only at checkpoints for:

1. Confirmation tests pass
2. Any blockers
3. Next phase approval

```

**When to Use:**
- New feature requires tests
- Test coverage gaps
- Flaky test fixes
- E2E test additions

---

## Optimization Templates

### 6. Performance Optimization Template

```

# RESEARCH #

PROJECT: omer-akben Portfolio
OPTIMIZATION: [Performance area]
AGENT: mastra-optimization-researcher
SKILLS: bundle-optimization-skill, redis-integration-skill

PERFORMANCE ISSUE:
[What's slow or inefficient?]

CURRENT METRICS:

- Bundle size: [current size]
- Load time: [if measured]
- Memory usage: [if measured]
- API response time: [if measured]

INVESTIGATION AREAS:

1. Bundle analysis

   ```bash
   ANALYZE=true npm run build
   ```

2. Lighthouse audit
3. React DevTools Profiler
4. Network waterfall
5. Memory profiling

RESEARCH GOALS:

- [ ] Identify bottlenecks
- [ ] Measure baseline metrics
- [ ] Find optimization opportunities
- [ ] Document trade-offs

After research, switch to:

# ACTION# for implementation with checkpoints

- 25%: Quick wins implemented - Measure impact
- 50%: Major optimization complete - Benchmark
- 75%: Fine-tuning + testing - Final metrics
- 100%: Quality gates + documentation

TARGET IMPROVEMENTS:

- Bundle size: [target reduction]
- Load time: [target improvement]
- Memory: [target reduction]

```

**When to Use:**
- Slow page loads
- Large bundle sizes
- Memory leaks
- API slowness
---

### 7. Bundle Size Reduction Template

```

# RESEARCH #

PROJECT: omer-akben Portfolio
OPTIMIZATION: Bundle Size Reduction
AGENT: mastra-optimization-researcher
SKILL: bundle-optimization-skill

CURRENT STATE:

```bash
npm run size
```

[Paste current bundle analysis]

TARGET:
Homepage budget: 40KB (current: [X]KB)
Overall budget: Within Vercel limits

ANALYSIS STEPS:

1. Run bundle analyzer:

   ```bash
   ANALYZE=true npm run build
   ```

2. Identify largest packages
3. Check for:
   - Wildcard imports
   - Duplicate dependencies
   - Unused code
   - Heavy libraries

COMMON CULPRITS:

- [ ] Icon imports (must use icon-manifest.ts)
- [ ] Duplicate libraries
- [ ] Large date/time libraries
- [ ] Unoptimized images
- [ ] Client-side AI SDK imports

ICON OPTIMIZATION PATTERN:
✅ CORRECT: Import from icon-manifest.ts
❌ WRONG: `import * as Icons from 'simple-icons'`

After analysis, switch to:

# ACTION# for optimization

- 25%: Low-hanging fruit removed - Measure
- 50%: Major refactors complete - Benchmark
- 75%: Fine-tuning + tree-shaking - Final size
- 100%: Quality gates pass + under budget

```

**When to Use:**
- Bundle exceeds limits
- New heavy dependencies
- Icon optimization needed
- Post-feature bundle check

---

### 8. Memory System Optimization Template

```

# PLAN #

PROJECT: omer-akben Portfolio
OPTIMIZATION: [Memory system - Episodic/Semantic]
AGENT: mastra-optimization-researcher
SKILLS: redis-integration-skill, aI-agent-implementation-skill

MEMORY TYPE:

- [ ] Episodic (Upstash Vector)
- [ ] Semantic (Upstash Redis)

CURRENT PERFORMANCE:

- Vector search latency: [X]ms
- Memory retrieval: [X]ms
- Storage usage: [X]MB
- Query accuracy: [X]%

OPTIMIZATION GOALS:

- [ ] Improve search relevance
- [ ] Reduce latency
- [ ] Optimize storage
- [ ] Enhance recall accuracy

INVESTIGATION:

1. Analyze query patterns
2. Review embedding strategy
3. Check index configuration
4. Measure retrieval metrics

CHECKPOINT STRUCTURE:

- 25%: Analysis complete + opportunities identified - PAUSE
- 50%: Optimization implemented + benchmarked - PAUSE
- 75%: Fine-tuning + testing - PAUSE
- 100%: Production validation + documentation

Please provide:

1. Current performance analysis
2. Optimization opportunities
3. Implementation approach
4. Testing strategy
5. Rollback plan

```

**When to Use:**
- Slow memory retrieval
- Poor search relevance
- High storage costs
- Memory system errors

---

## Research Templates

### 9. Technical Research Template

```

# RESEARCH #

PROJECT: omer-akben Portfolio
RESEARCH: [Research topic]
AGENT: [Appropriate for domain]

RESEARCH QUESTION:
[What specific question needs answering?]

SEARCH STRATEGY:

1. Context7: [Library/framework documentation]
2. Web search: [Current best practices, recent articles]
3. Google Drive: [Internal project docs, past research]

INFORMATION NEEDED:

- [ ] Core concepts and definitions
- [ ] Implementation patterns
- [ ] Best practices and anti-patterns
- [ ] Performance considerations
- [ ] Security implications
- [ ] Integration requirements
- [ ] Community consensus

BATCH PROCESSING:

- Initial scan: Top 5 sources for overview
- Deep dive: 3 sources at a time
- Create running summary after each batch

SOURCE EVALUATION:

- Official documentation: High priority
- Framework authors: High priority
- Recent articles (< 6 months): Medium priority
- Community forums: Low priority

DELIVERABLE:
ProjectName_Research_2025-11-08.gdoc

May I create this research document?

RESEARCH FORMAT:

## Executive Summary

[2-3 sentence overview]

## Key Findings

[Organized hierarchically]

## Sources

[All sources with relevance ratings]

## Conflicting Information

[If found]

## Synthesis

[Without action recommendations]

NO planning or implementation steps - pure research only.

```

**When to Use:**
- New technology evaluation
- Framework selection
- Architecture decisions
- Best practices investigation

---

### 10. Library/Framework Investigation Template

```

# RESEARCH #

PROJECT: omer-akben Portfolio
LIBRARY: [Library name]
AGENT: [Domain-specific agent]

INVESTIGATION PURPOSE:
[Why are we researching this library?]

EVALUATION CRITERIA:

- [ ] Bundle size impact
- [ ] TypeScript support
- [ ] Next.js 15 compatibility
- [ ] React 19 compatibility
- [ ] Maintenance status
- [ ] Community adoption
- [ ] Documentation quality
- [ ] License compatibility
- [ ] Security track record

RESEARCH SOURCES:

1. Context7: Official documentation
2. npm: Package stats, dependencies
3. GitHub: Issues, PRs, activity
4. Bundlephobia: Size analysis
5. Web search: Reviews, comparisons

COMPARISON MATRIX:

| Criterion | Library A | Library B | Library C |
| --------- | --------- | --------- | --------- |
| Bundle    |           |           |           |
| TS        |           |           |           |
| Next.js   |           |           |           |
| Docs      |           |           |           |
| Community |           |           |           |

BATCH PROCESSING:

- Phase 1: Official docs (all libraries)
- Phase 2: Community feedback (3 at a time)
- Phase 3: Technical analysis (3 at a time)

DELIVERABLE:
LibraryName_Evaluation_2025-11-08.gdoc

May I create this evaluation document?

NO implementation or recommendations - research only.
Present findings objectively for decision-making.

```

**When to Use:**
- Dependency selection
- Framework migration
- Tool evaluation
- Alternative solutions

---

### 11. Competitive Analysis Template

```

# RESEARCH #

PROJECT: omer-akben Portfolio
ANALYSIS: [Feature/Approach comparison]

COMPARISON GOAL:
[What are we analyzing and why?]

COMPETITORS/ALTERNATIVES:

1. [Site/App 1]
2. [Site/App 2]
3. [Site/App 3]

ANALYSIS DIMENSIONS:

- [ ] User experience
- [ ] Technical implementation
- [ ] Performance metrics
- [ ] Accessibility
- [ ] Mobile responsiveness
- [ ] Unique features
- [ ] Pain points

RESEARCH APPROACH:

1. Web search: Find top examples
2. Direct analysis: Test each competitor
3. Technical inspection: Dev tools analysis
4. User reviews: Community feedback
5. Performance: Lighthouse audits

BATCH PROCESSING:

- Competitor 1: Full analysis
- Competitor 2: Full analysis
- Competitor 3: Full analysis
- Summary synthesis

DELIVERABLE FORMAT:

## Competitor Profiles

[Detailed analysis of each]

## Feature Matrix

[Side-by-side comparison]

## Technical Insights

[Implementation patterns observed]

## User Experience Patterns

[UX observations]

## Opportunities Identified

[Gaps and improvements]

DELIVERABLE:
CompetitiveAnalysis_2025-11-08.gdoc

May I create this analysis document?

NO recommendations or action items - pure analysis.

```

**When to Use:**
- Feature inspiration
- UX benchmarking
- Technical approaches
- Market positioning

---

## Infrastructure Templates

### 12. Deployment & CI/CD Template

```

# PLAN #

PROJECT: omer-akben Portfolio
DEPLOYMENT: [Deployment task]
AGENT: deployment-engineer
SKILLS: git-workflow-and-deployment-skill, environment-configuration-skill

DEPLOYMENT TYPE:

- [ ] Feature deployment
- [ ] Hotfix deployment
- [ ] Environment configuration
- [ ] CI/CD modification

CURRENT WORKFLOW:

```
feature/* → pre-deployment → (CI/CD gates) → main → Vercel
```

BRANCH STRATEGY:

```bash
git checkout pre-deployment
git pull origin pre-deployment
git checkout -b feature/[name]
# ... work ...
# Create PR to pre-deployment
# Auto-merge to main after gates pass
```

QUALITY GATES (ALL MUST PASS):

```bash
npm run lint          # ✅ 0 errors
npx tsc --noEmit     # ✅ 0 errors
npm test             # ✅ 776/776 passing
npm run build        # ✅ Success
npm run size         # ✅ Within limits
npm run test:e2e     # ✅ 66 passing
```

ENVIRONMENT VARIABLES:
Verify all required for deployment:

- [ ] XAI_API_KEY
- [ ] OPENAI_API_KEY
- [ ] UPSTASH_REDIS_REST_URL
- [ ] UPSTASH_REDIS_REST_TOKEN
- [ ] UPSTASH_VECTOR_REST_URL
- [ ] UPSTASH_VECTOR_REST_TOKEN
- [ ] RESEND_API_KEY
- [ ] OMER_EMAIL
- [ ] OMER_ZOOM_LINK
- [ ] CRON_SECRET

CHECKPOINT STRUCTURE:

- 25%: Changes committed + PR created - PAUSE
- 50%: CI/CD gates pass locally - PAUSE
- 75%: PR approved + merged to pre-deployment - PAUSE
- 100%: Auto-merged to main + deployed to production

ROLLBACK PLAN:
[Describe rollback strategy if deployment fails]

Please provide:

1. Pre-deployment checklist
2. Risk assessment
3. Rollback procedure
4. Post-deployment verification

```

**When to Use:**
- Feature releases
- Hotfix deployments
- CI/CD updates
- Environment changes

---

### 13. Security Audit Template

```

# RESEARCH #

PROJECT: omer-akben Portfolio
AUDIT: Security Review
AGENT: [Will be security-specialist in Phase 3]

AUDIT SCOPE:

- [ ] API routes security
- [ ] Input validation
- [ ] Authentication/Authorization
- [ ] Rate limiting
- [ ] Environment variables
- [ ] PII handling
- [ ] Dependencies vulnerabilities
- [ ] Client-side exposure

SECURITY CHECKLIST:

API Security:

- [ ] All API calls server-side
- [ ] Input validation (Zod schemas)
- [ ] Error handling (no stack traces to client)
- [ ] Rate limiting on all endpoints
- [ ] CORS configured properly

Environment Variables:

- [ ] No secrets in client code
- [ ] All secrets server-side only
- [ ] .env.local in .gitignore
- [ ] No hardcoded keys

Data Protection:

- [ ] No PII in logs
- [ ] Secure data transmission
- [ ] Proper sanitization
- [ ] No SQL injection vectors

Dependencies:

```bash
npm audit
npm outdated
```

RESEARCH SOURCES:

1. OWASP Top 10
2. Next.js security best practices
3. Vercel security guidelines
4. npm audit report
5. Dependency review

DELIVERABLE:
SecurityAudit_2025-11-08.gdoc

May I create this audit document?

Present findings with severity levels:

- CRITICAL: Immediate attention
- HIGH: Address before next release
- MEDIUM: Schedule for upcoming sprint
- LOW: Technical debt

```

**When to Use:**
- Pre-release audits
- After dependency updates
- Periodic security reviews
- After security advisories

---

### 14. Quality Gate Debugging Template

```

# ACTION #

PROJECT: omer-akben Portfolio
DEBUGGING: Quality Gate Failure
AGENT: test-engineer
SKILL: testing-and-quality-gates-skill

FAILING GATE:

- [ ] ESLint (npm run lint)
- [ ] TypeScript (npx tsc --noEmit)
- [ ] Unit Tests (npm test)
- [ ] Build (npm run build)
- [ ] Bundle Size (npm run size)
- [ ] E2E Tests (npm run test:e2e)

ERROR OUTPUT:

```
[Paste complete error output]
```

QUICK DIAGNOSIS:
Run failing command with verbose output:

```bash
# ESLint
npm run lint -- --debug

# TypeScript
npx tsc --noEmit --listFiles

# Tests
npm test -- --reporter=verbose

# Build
npm run build -- --debug

# E2E
npm run test:e2e -- --reporter=list
```

CHECKPOINT STRUCTURE:

- 25%: Root cause identified - PAUSE
- 50%: Fix implemented - Re-run gate
- 75%: All gates pass - Final verification
- 100%: Ready for commit/PR

COMMON ISSUES & FIXES:

ESLint:

- Unused imports: Remove or use
- Console.log: Remove or change to error/warn
- Missing deps: Add to eslint config

TypeScript:

- Type errors: Add proper types (no `any`)
- Import errors: Check @/ imports
- Config issues: Check tsconfig.json

Unit Tests:

- Mocking issues: Update test mocks
- Hydration issues: Add isMounted pattern
- Timeout issues: Increase timeout or optimize

Build:

- Import errors: Check file paths
- Type errors: Fix TypeScript first
- Config issues: Check next.config.js

Bundle Size:

- Over limit: Run bundle analyzer
- Icon imports: Check icon-manifest usage
- Large deps: Consider alternatives

E2E Tests:

- Hydration timing: Add wait patterns
- Selectors: Update test selectors
- Flaky tests: Add stabilization waits

Execute with minimal interruption.
Pause only at checkpoints for approval to continue.

```

**When to Use:**
- CI/CD failures
- Pre-commit gate failures
- Test debugging
- Build errors

---

## Documentation Templates

### 15. Technical Documentation Template

```

# PLAN #

PROJECT: omer-akben Portfolio
DOCUMENTATION: [Documentation topic]
AGENT: [Domain-specific agent]

DOCUMENTATION TYPE:

- [ ] API documentation
- [ ] Architecture documentation
- [ ] Process documentation
- [ ] Integration guide
- [ ] Troubleshooting guide

TARGET AUDIENCE:
[Who will use this documentation?]

CONTENT STRUCTURE:

1. Overview
   - Purpose
   - Context
   - Prerequisites

2. Core Concepts
   - Key terminology
   - Architecture/Flow
   - Design decisions

3. Implementation Details
   - Code examples
   - Configuration
   - Best practices

4. Common Patterns
   - Usage examples
   - Anti-patterns to avoid
   - Gotchas and edge cases

5. Testing & Validation
   - How to test
   - Expected outcomes
   - Debugging tips

6. References
   - Related documentation
   - External resources
   - Version compatibility

CHECKPOINT STRUCTURE:

- 25%: Outline + Overview complete - PAUSE for review
- 50%: Core content drafted - PAUSE for review
- 75%: Examples + testing added - PAUSE for review
- 100%: Final review + publish

DOCUMENTATION PERMISSION:
May I create documentation?

- [ ] TopicName_Documentation_2025-11-08.gdoc

STYLE GUIDELINES:

- Clear, concise language
- Code examples for all patterns
- Visual diagrams where helpful
- Version-specific callouts
- Link to related docs

Please provide:

1. Detailed outline
2. Key topics to cover
3. Example structure
4. Review checkpoints

```

**When to Use:**
- New feature documentation
- Process documentation
- Onboarding materials
- API references

---

### 16. Skill Creation Template

```

# PLAN #

PROJECT: omer-akben Portfolio
SKILL: [New skill name]
AGENT: [Relevant domain expert]

SKILL PURPOSE:
[What problem does this skill solve?]

SKILL SCOPE:
[What topics/patterns does this skill cover?]

TARGET USERS:

- [ ] AI coding assistants (Claude, etc.)
- [ ] Human developers
- [ ] Both

SKILL STRUCTURE:

```
.claude/skills/[skill-name]-skill/
├── SKILL.md           # Main documentation
├── examples/          # Code examples
├── patterns/          # Common patterns
└── anti-patterns/     # What to avoid
```

SKILL.MD OUTLINE:

1. Purpose & Scope
2. When to Use This Skill
3. Core Concepts
4. Implementation Patterns
5. Code Examples
6. Common Pitfalls
7. Testing Strategies
8. Related Skills/Agents
9. References

REQUIRED ELEMENTS:

- [ ] Clear "When to Use" section
- [ ] Minimum 3 code examples
- [ ] Anti-pattern documentation
- [ ] Integration with existing agents
- [ ] Testing guidance
- [ ] Version compatibility notes

CHECKPOINT STRUCTURE:

- 25%: Structure + Purpose defined - PAUSE
- 50%: Core content + examples drafted - PAUSE
- 75%: Anti-patterns + testing added - PAUSE
- 100%: Integrated with agents + tested

INTEGRATION POINTS:
Which agents will use this skill?

- [ ] ui-ux-developer
- [ ] nextjs-architect
- [ ] ai-sdk-specialist
- [ ] test-engineer
- [ ] deployment-engineer
- [ ] mastra-optimization-researcher
- [ ] xai-integration-optimizer

DOCUMENTATION PERMISSION:
May I create skill documentation?

- [ ] .claude/skills/[skill-name]-skill/

Please provide:

1. Detailed skill outline
2. Example code snippets
3. Integration strategy
4. Testing approach

```

**When to Use:**
- Documenting new patterns
- Codifying best practices
- Creating reusable knowledge
- Onboarding new patterns

---

### 17. Agent Enhancement Template

```

# PLAN #

PROJECT: omer-akben Portfolio
AGENT: [Agent to enhance]
ENHANCEMENT: [What to improve]

CURRENT AGENT STATE:
[Summary of agent's current capabilities]

ENHANCEMENT GOALS:

- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

SKILL ADDITIONS:
Which skills should this agent learn?

- [ ] Existing skill 1
- [ ] Existing skill 2
- [ ] New skill (requires creation)

CAPABILITY IMPROVEMENTS:

- [ ] Better context understanding
- [ ] Enhanced decision-making
- [ ] Improved error handling
- [ ] Updated knowledge base
- [ ] New tool integrations

AGENT FILE STRUCTURE:

```
.claude/agents/[agent-name].md

Structure:
- Role & Expertise
- When to Activate
- Capabilities
- Skills & Tools
- Workflows
- Quality Standards
- Common Pitfalls
```

CHECKPOINT STRUCTURE:

- 25%: Enhancement plan approved - PAUSE
- 50%: Agent file updated - PAUSE
- 75%: Tested with sample prompts - PAUSE
- 100%: Integrated + documented

TESTING STRATEGY:
Sample prompts to test enhancement:

1. [Test prompt 1]
2. [Test prompt 2]
3. [Test prompt 3]

SUCCESS CRITERIA:

- [ ] Agent activates correctly
- [ ] Uses new skills properly
- [ ] Produces better outputs
- [ ] Integrates with other agents
- [ ] Documentation updated

Please provide:

1. Enhancement strategy
2. Agent file modifications
3. Testing approach
4. Integration considerations

```

**When to Use:**
- Agent improvements
- New skill integration
- Capability expansion
- Agent refinement

---

## 🎯 Template Selection Guide

### By Task Type

**Building New Features:**
1. Feature Development (#1)
2. UI/UX Enhancement (#3) - if UI-heavy
3. API & Backend Logic (#4) - if API-heavy
4. Testing Implementation (#5) - for test coverage

**Fixing Issues:**
1. Bug Fix & Investigation (#2)
2. Quality Gate Debugging (#14)
3. Performance Optimization (#6) - if performance issue

**Researching:**
1. Technical Research (#9) - general investigation
2. Library/Framework Investigation (#10) - specific tools
3. Competitive Analysis (#11) - market research

**Optimizing:**
1. Performance Optimization (#6)
2. Bundle Size Reduction (#7)
3. Memory System Optimization (#8)

**Deploying:**
1. Deployment & CI/CD (#12)
2. Security Audit (#13)

**Documenting:**
1. Technical Documentation (#15)
2. Skill Creation (#16)
3. Agent Enhancement (#17)

### By Agent

**ui-ux-developer:**
- Template #3 (UI/UX Enhancement)
- Template #1 (Feature Development)

**nextjs-architect:**
- Template #1 (Feature Development)
- Template #2 (Bug Fix)

**ai-sdk-specialist:**
- Template #4 (API & Backend Logic)
- Template #1 (Feature Development)

**test-engineer:**
- Template #5 (Testing Implementation)
- Template #14 (Quality Gate Debugging)

**deployment-engineer:**
- Template #12 (Deployment & CI/CD)
- Template #13 (Security Audit)

**mastra-optimization-researcher:**
- Template #6 (Performance Optimization)
- Template #7 (Bundle Size Reduction)
- Template #8 (Memory System Optimization)

**xai-integration-optimizer:**
- Template #4 (API & Backend Logic)
- Template #6 (Performance Optimization)

---

## 📝 Usage Guidelines

### Template Customization

**Always Include:**
- Project context
- Specific agent and skills
- Clear objective and requirements
- Checkpoint structure
- Success criteria
- Documentation permission (if creating docs)

**Never Skip:**
- Quality gate requirements
- Brightness mode testing (for UI work)
- Hydration safety (for browser APIs)
- Import standards (@/ only)
- Security considerations (for API work)

### Mode Selection

**Use #PLAN# when:**
- Starting complex features
- Need comprehensive analysis
- Multiple approaches possible
- High-risk changes
- Documentation needed

**Use #ACTION# when:**
- Implementation is clear
- Bug fix with known solution
- Time-sensitive work
- Following established pattern
- Minimal decision-making needed

**Use #RESEARCH# when:**
- Information gathering only
- No implementation yet
- Evaluating options
- Learning new technology
- Competitive analysis

### Checkpoint Protocol

**At Every Checkpoint:**
1. PAUSE execution completely
2. SUMMARIZE what was completed
3. LIST any changes made
4. EXPLAIN deviations from plan
5. OUTLINE next phase
6. WAIT for explicit approval

**Checkpoint Frequency:**
- 25% intervals minimum
- After each major component
- Before quality gate runs
- After significant changes

### Documentation Requests

**Always Ask Permission:**
```

May I create the following documents?

- [ ] ProjectName_Type_2025-11-08.gdoc
- [ ] ProjectName_Tracker_2025-11-08.gsheet

```

**Document Types:**
- Plan: Strategic planning docs
- Tracker: Progress tracking sheets
- Research: Research findings
- Notes: General notes
- Requirements: Requirement checklists

---

## 🚀 Quick Start Examples

### Example 1: New UI Feature

```

# PLAN #

PROJECT: omer-akben Portfolio
FEATURE: Add Dark Mode Toggle Animation
AGENT: ui-ux-developer
SKILLS: brightness-system-skill, hydration-safety-skill

OBJECTIVE:
Create smooth transition animation when users switch between brightness modes

REQUIREMENTS:

- [ ] Smooth fade transition (300ms)
- [ ] Works across all 8 brightness modes
- [ ] No layout shift during transition
- [ ] Accessible (respects prefers-reduced-motion)
- [ ] No hydration errors
- [ ] E2E tests for all modes

[... rest of template ...]

```

### Example 2: API Bug Fix

```

# RESEARCH #

PROJECT: omer-akben Portfolio
BUG: collect_contact rate limiting not working
SEVERITY: Critical
AGENT: ai-sdk-specialist

OBSERVED BEHAVIOR:
Users can submit more than 5 contacts per IP per 24 hours

EXPECTED BEHAVIOR:
Should enforce 5 requests per IP per 24 hours via Redis

[... rest of template ...]

```

### Example 3: Performance Research

```

# RESEARCH #

PROJECT: omer-akben Portfolio
RESEARCH: Vector Search Performance Optimization
AGENT: mastra-optimization-researcher

RESEARCH QUESTION:
How can we improve episodic memory search latency from 500ms to <200ms?

[... rest of template ...]

```

---

## 📚 Related Documentation

- **CLAUDE.md** - Agent/skill selection guide
- **AGENTS.md** - Unified coding standards
- **.claude/agents/** - Individual agent documentation
- **.claude/skills/** - Skill implementation details
- **.claude/commands/** - Quick reference commands

---

**Version:** 1.0
**Created:** 2025-11-08
**Purpose:** Standardized templates for consistent agentic workflows
**Maintenance:** Update when new agents/skills added or workflows change
