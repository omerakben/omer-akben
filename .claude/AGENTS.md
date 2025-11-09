# Agents Documentation

**Portfolio Project:** omer-akben AI-powered portfolio
**Framework:** Claude Code with specialized agents
**Version:** Phase 1 - Foundation
**Last Updated:** 2025-11-08

---

## Table of Contents

1. [Overview](#overview)
2. [Agent Catalog](#agent-catalog)
3. [Agent Selection Guide](#agent-selection-guide)
4. [Collaboration Patterns](#collaboration-patterns)
5. [Handoff Procedures](#handoff-procedures)
6. [Quality Standards](#quality-standards)

---

## Overview

The omer-akben project uses a **specialized agent architecture** where each agent is an expert in a specific domain. This approach ensures:

- **Deep Expertise**: Each agent masters its domain
- **Consistent Patterns**: Agents follow established project conventions
- **Quality Focus**: Every agent enforces quality gates
- **Clear Ownership**: Domain boundaries prevent overlap

### Architecture Principles

1. **Specialization over Generalization**: Each agent has a narrow, deep focus
2. **Skills Integration**: Agents leverage shared skills for common patterns
3. **Project Awareness**: All agents understand the portfolio context
4. **Quality Gates**: Every agent ensures code meets production standards
5. **Collaboration**: Agents can hand off to each other when needed

### Agent + Skills Model

```
Agent (Strategic Layer)
├── Understands project context
├── Makes architectural decisions
├── Follows established patterns
└── Uses Skills (Tactical Layer)
    ├── Provides implementation patterns
    ├── Shares common solutions
    ├── Documents best practices
    └── Reduces duplication
```

---

## Agent Catalog

### 1. Next.js Architect

**File:** `.claude/agents/nextjs-architect.md`
**Model:** Sonnet
**Tools:** Read, Write, Edit, Bash, Grep, Glob

#### Purpose

Expert in Next.js 15, React 19, App Router, server components, and TypeScript. The go-to agent for all Next.js architecture decisions, component patterns, routing, data fetching, and SSR/hydration issues.

#### Core Expertise

- **Next.js 15**: App Router, parallel routes, intercepting routes, server actions
- **React 19**: Actions, useActionState, useOptimistic, use() hook
- **TypeScript**: Strict typing, generics, Zod validation
- **Patterns**: Server vs client components, hydration-safe patterns, data fetching

#### When to Use

✅ Use nextjs-architect for:

- Creating new pages or routes
- Implementing server/client components
- Fixing hydration mismatches
- Data fetching patterns
- Route organization
- Metadata and SEO
- Next.js build optimization

❌ Don't use for:

- UI styling (use ui-ux-developer)
- Deployment issues (use deployment-engineer)
- Testing (use test-engineer)

#### Key Skills Used

- `hydration-safety-skill` - SSR/CSR patterns
- `data-architecture-skill` - Data organization with facts.ts
- `brightness-system-skill` - Ensure 8-mode support
- `testing-and-quality-gates-skill` - Component testing

#### Example Invocation

```
User: "Add a new blog page with SSR data fetching"
→ Use nextjs-architect
```

---

### 2. UI/UX Developer

**File:** `.claude/agents/ui-ux-developer.md`
**Model:** Sonnet
**Tools:** Read, Write, Edit, Bash, Grep

#### Purpose

Expert in Tailwind CSS 4, shadcn/ui, responsive design, accessibility, and 8-brightness-mode theming. The specialist for all UI components, styling, layouts, and user experience improvements.

#### Core Expertise

- **Tailwind CSS 4**: Modern utilities, custom properties, responsive design
- **shadcn/ui**: 40+ components, Radix UI primitives, customization
- **Design System**: 8 brightness modes, CSS custom properties
- **Accessibility**: WCAG 2.1 AA, semantic HTML, ARIA, keyboard navigation

#### When to Use

✅ Use ui-ux-developer for:

- Creating UI components
- Styling and layout fixes
- Responsive design implementation
- Accessibility improvements
- shadcn/ui component integration
- Brightness mode testing
- Icon usage (Lucide)

❌ Don't use for:

- Next.js routing (use nextjs-architect)
- API logic (use ai-sdk-specialist)
- Deployment (use deployment-engineer)

#### Key Skills Used

- `brightness-system-skill` - CRITICAL: All UI must support 8 modes
- `hydration-safety-skill` - Client-side interactive components
- `testing-and-quality-gates-skill` - UI component testing
- `bundle-optimization-skill` - Icon imports

#### Example Invocation

```
User: "Make the sidebar responsive and add dark mode support"
→ Use ui-ux-developer
```

---

### 3. Deployment Engineer

**File:** `.claude/agents/deployment-engineer.md`
**Model:** Sonnet
**Tools:** Read, Write, Edit, Bash, Grep

#### Purpose

Expert in Vercel deployment, CI/CD pipelines, GitHub Actions, and production infrastructure. Ensures zero-downtime deployments and robust production systems.

#### Core Expertise

- **Vercel Platform**: Deployments, preview environments, edge functions
- **GitHub Actions**: 6 quality gates workflow, auto-merge
- **Production Monitoring**: Sentry, PostHog, performance tracking
- **Security**: Environment variables, headers, secrets management

#### When to Use

✅ Use deployment-engineer for:

- Deployment issues
- CI/CD pipeline configuration
- Environment variable management
- Quality gate failures
- Production monitoring setup
- Vercel configuration
- Branch strategy questions

❌ Don't use for:

- Code implementation (use appropriate specialist)
- UI fixes (use ui-ux-developer)
- Test writing (use test-engineer)

#### Key Skills Used

- `git-workflow-and-deployment-skill` - CRITICAL: Branch strategy
- `environment-configuration-skill` - Secrets management
- `testing-and-quality-gates-skill` - CI/CD gates

#### Example Invocation

```
User: "Deploy failed on the build step"
→ Use deployment-engineer
```

---

### 4. Test Engineer

**File:** `.claude/agents/test-engineer.md`
**Model:** Sonnet
**Tools:** Read, Write, Edit, Bash, Grep

#### Purpose

Expert in Vitest unit testing and Playwright E2E testing. Ensures the portfolio maintains high quality with 776+ unit tests and 66 E2E tests passing consistently.

#### Core Expertise

- **Vitest**: Component testing, mocking, async patterns, coverage
- **Playwright**: Browser automation, cross-browser testing, visual regression
- **Testing Strategy**: TDD, behavior-driven testing, integration testing
- **Hydration Testing**: SSR-safe test patterns for Next.js

#### When to Use

✅ Use test-engineer for:

- Writing new tests
- Debugging test failures
- Improving test coverage
- Test infrastructure setup
- TDD workflows
- E2E test scenarios
- Quality gate failures

❌ Don't use for:

- Production code (use appropriate specialist)
- Deployment (use deployment-engineer)
- UI design (use ui-ux-developer)

#### Key Skills Used

- `testing-and-quality-gates-skill` - CRITICAL: Complete testing patterns
- `brightness-system-skill` - Test all 8 brightness modes
- `hydration-safety-skill` - Test SSR/CSR properly

#### Example Invocation

```
User: "Unit tests are failing after I added a new feature"
→ Use test-engineer
```

---

### 5. AI SDK Specialist

**File:** `.claude/agents/ai-sdk-specialist.md`
**Model:** Sonnet
**Tools:** Read, Write, Edit, Bash, Grep

#### Purpose

Expert in Vercel AI SDK v5, Mastra framework, LLM integrations, and AI agent tool development. The authority on AI chat implementation, tool creation, streaming responses, and LLM configuration.

#### Core Expertise

- **Vercel AI SDK v5**: streamText(), generateText(), tool calling
- **Mastra Framework**: Agent creation, tool definition, memory systems
- **LLM Integrations**: XAI Grok (primary), OpenAI (fallback), embeddings
- **Tool Development**: Schema definition, API routes, validation

#### When to Use

✅ Use ai-sdk-specialist for:

- Creating AI tools
- Fixing AI agent bugs
- LLM integration issues
- Streaming response problems
- Tool schema design
- Memory system implementation
- Model configuration

❌ Don't use for:

- UI components (use ui-ux-developer)
- Deployment (use deployment-engineer)
- Next.js patterns (use nextjs-architect)

#### Key Skills Used

- `aI-agent-implementation-skill` - CRITICAL: Mastra patterns
- `environment-configuration-skill` - API key management
- `redis-integration-skill` - Caching and rate limiting
- `testing-and-quality-gates-skill` - Testing AI tools

#### Example Invocation

```
User: "Create a new tool for the AI agent that fetches project details"
→ Use ai-sdk-specialist
```

---

### 6. Mastra Optimization Researcher

**File:** `.claude/agents/mastra-optimization-researcher.md`
**Model:** Sonnet
**Description:** Elite Mastra.ai implementation specialist

#### Purpose

Researches official Mastra.ai documentation and optimizes Mastra-based agent architectures. Proactively analyzes current setup and suggests improvements based on official patterns.

#### Core Expertise

- **Documentation Research**: Systematic analysis of mastra.ai/docs
- **Implementation Analysis**: Identify anti-patterns and suboptimal code
- **Optimization**: Architecture refactoring, performance improvements
- **Context-Aware**: Understands existing agent/tool architecture

#### When to Use

✅ Use mastra-optimization-researcher for:

- Optimizing Mastra implementation
- Researching Mastra best practices
- Reviewing agent architecture
- Tool integration improvements
- Memory system optimization
- Migration to newer Mastra patterns

❌ Don't use for:

- Non-Mastra AI code (use ai-sdk-specialist)
- General optimization (use appropriate specialist)
- Deployment (use deployment-engineer)

#### Key Research Areas

- Agent architecture and coordination
- Memory systems (episodic, semantic, working)
- Tool definition patterns
- Performance optimization
- Integration with Vercel AI SDK

#### Example Invocation

```
User: "Review our Mastra agent setup and suggest improvements"
→ Use mastra-optimization-researcher
```

---

### 7. xAI Integration Optimizer

**File:** `.claude/agents/xai-integration-optimizer.md`
**Model:** Sonnet
**Description:** Elite xAI (Grok) integration specialist

#### Purpose

Optimizes xAI (Grok) integration in the codebase. Focuses on Mastra framework implementation, performance improvements, API usage patterns, and migration strategies.

#### Core Expertise

- **xAI API**: Official documentation at docs.x.ai/docs
- **Model Variants**: Reasoning vs non-reasoning performance
- **Mastra Integration**: LLM orchestration with Grok models
- **Migration**: Strategies from OpenAI to xAI

#### When to Use

✅ Use xai-integration-optimizer for:

- Optimizing xAI/Grok usage
- Model variant selection (reasoning vs non-reasoning)
- Performance improvements for AI calls
- Migration from OpenAI to xAI
- Cost optimization
- xAI API best practices

❌ Don't use for:

- Non-xAI providers (use ai-sdk-specialist)
- General AI architecture (use mastra-optimization-researcher)
- Deployment (use deployment-engineer)

#### Key Skills Used

- `environment-configuration-skill` - API key management
- `redis-integration-skill` - Caching for LLM responses
- `aI-agent-implementation-skill` - Model configuration

#### Example Invocation

```
User: "Should we migrate more OpenAI calls to xAI?"
→ Use xai-integration-optimizer
```

---

## Agent Selection Guide

### Decision Tree

Use this flowchart to select the right agent:

```
Is it about...

┌─ Next.js routing, components, SSR?
│  → nextjs-architect
│
├─ UI styling, responsiveness, accessibility?
│  → ui-ux-developer
│
├─ Deployment, CI/CD, environment variables?
│  → deployment-engineer
│
├─ Writing/fixing tests, test coverage?
│  → test-engineer
│
├─ AI tools, LLM calls, Mastra agents?
│  ├─ Mastra optimization?
│  │  → mastra-optimization-researcher
│  ├─ xAI/Grok specific?
│  │  → xai-integration-optimizer
│  └─ General AI/tools?
│     → ai-sdk-specialist
│
└─ Not sure?
   → Start with nextjs-architect (full-stack default)
```

### Common Scenarios

#### Scenario: New Feature Development

```
1. Architecture planning → nextjs-architect
2. UI implementation → ui-ux-developer
3. Testing → test-engineer
4. Deployment → deployment-engineer
```

#### Scenario: Bug Fix

```
1. Identify domain:
   - Routing/SSR issue? → nextjs-architect
   - Styling issue? → ui-ux-developer
   - Test failure? → test-engineer
   - Deploy failure? → deployment-engineer
   - AI tool issue? → ai-sdk-specialist
```

#### Scenario: Optimization

```
1. What to optimize?
   - Mastra architecture? → mastra-optimization-researcher
   - xAI integration? → xai-integration-optimizer
   - Next.js performance? → nextjs-architect
   - UI performance? → ui-ux-developer
   - CI/CD pipeline? → deployment-engineer
```

### Selection Matrix

| Task Type       | Primary Agent                  | Support Agents                  |
| --------------- | ------------------------------ | ------------------------------- |
| New page/route  | nextjs-architect               | ui-ux-developer, test-engineer  |
| UI component    | ui-ux-developer                | nextjs-architect, test-engineer |
| AI tool         | ai-sdk-specialist              | test-engineer                   |
| Fix deployment  | deployment-engineer            | -                               |
| Write tests     | test-engineer                  | -                               |
| Optimize Mastra | mastra-optimization-researcher | ai-sdk-specialist               |
| Optimize xAI    | xai-integration-optimizer      | ai-sdk-specialist               |
| Full feature    | nextjs-architect               | ALL (coordinate)                |

---

## Collaboration Patterns

### Pattern 1: Sequential Handoff

One agent completes their work, then explicitly hands off to the next agent.

**Example: New Blog Feature**

```
1. nextjs-architect
   - Creates app/blog/page.tsx with SSR
   - Implements data fetching
   - Sets up routing
   - Status: ✅ Architecture complete
   - Handoff: "UI needs styling and responsiveness"

2. ui-ux-developer
   - Styles blog layout with Tailwind
   - Ensures responsive design
   - Tests 8 brightness modes
   - Status: ✅ UI complete
   - Handoff: "Ready for testing"

3. test-engineer
   - Writes unit tests for components
   - Adds E2E tests for blog flow
   - Verifies hydration safety
   - Status: ✅ Tests passing
   - Handoff: "Ready for deployment"

4. deployment-engineer
   - Verifies quality gates
   - Deploys to production
   - Monitors post-deployment
   - Status: ✅ Deployed
```

### Pattern 2: Parallel Collaboration

Multiple agents work on different aspects simultaneously.

**Example: AI Chat Feature**

```
Parallel Work:

┌─ ai-sdk-specialist
│  - Implements AI tool schemas
│  - Creates API routes
│  - Configures LLM models
│
├─ ui-ux-developer
│  - Designs chat interface
│  - Creates message components
│  - Implements streaming UI
│
└─ test-engineer
   - Plans test strategy
   - Sets up test fixtures
   - Prepares E2E scenarios

Convergence:
→ nextjs-architect integrates all pieces
→ deployment-engineer deploys
```

### Pattern 3: Iterative Refinement

Agent completes initial work, then refines based on feedback.

**Example: Performance Optimization**

```
Round 1:
xai-integration-optimizer
- Analyzes current xAI usage
- Suggests model variant changes
- Provides migration plan

Review: Performance improved 40%

Round 2:
mastra-optimization-researcher
- Reviews Mastra architecture
- Suggests tool optimizations
- Refines memory usage

Review: Performance improved 70%

Round 3:
ai-sdk-specialist
- Implements caching
- Adds rate limiting
- Optimizes streaming

Final: ✅ Performance meets targets
```

### Pattern 4: Consultation

One agent consults another for specific expertise.

**Example: Component with AI Feature**

```
Primary: ui-ux-developer (building component)

Consultation 1: nextjs-architect
Q: "Should this be server or client component?"
A: "Client component - needs user interaction"

Consultation 2: ai-sdk-specialist
Q: "How to integrate AI tool result?"
A: "Use message.parts array in AI SDK v5"

Consultation 3: test-engineer
Q: "How to test hydration with AI streaming?"
A: "Wait for data-testid='hydrated' before assertions"

Result: Component complete with all expertise integrated
```

---

## Handoff Procedures

### Clear Handoff Template

When an agent completes their work:

```markdown
## Handoff Summary

**Agent:** [agent-name]
**Task:** [what was accomplished]
**Status:** ✅ Complete / 🟡 Partial / ❌ Blocked

### What Was Done
- [Specific action 1]
- [Specific action 2]
- [Specific action 3]

### Files Changed
- [path/to/file1.ts] - [description]
- [path/to/file2.tsx] - [description]

### Testing Status
- [ ] Unit tests: [passing/failing/not written]
- [ ] E2E tests: [passing/failing/not written]
- [ ] Manual testing: [done/pending]

### Next Steps
1. [What needs to happen next]
2. [Which agent should handle it]
3. [Any blockers or dependencies]

### Recommended Next Agent
**Agent:** [next-agent-name]
**Reason:** [why this agent]
**Context:** [what they need to know]
```

### Handoff Examples

#### Example 1: Architecture to UI

```markdown
## Handoff Summary

**Agent:** nextjs-architect
**Task:** Create contact form page with server action
**Status:** ✅ Complete

### What Was Done
- Created app/contact/page.tsx with server component
- Implemented submitContact server action
- Added form validation with Zod
- Set up error handling

### Files Changed
- app/contact/page.tsx - Contact form page
- app/contact/actions.ts - Server actions
- lib/schemas/contact.ts - Zod schema

### Testing Status
- [x] Unit tests: 3/3 passing (validation logic)
- [ ] E2E tests: Not written yet
- [x] Manual testing: Form submits successfully

### Next Steps
1. Style the contact form with Tailwind
2. Make it responsive (mobile, tablet, desktop)
3. Ensure 8 brightness modes work
4. Add proper focus states and animations

### Recommended Next Agent
**Agent:** ui-ux-developer
**Reason:** Form needs styling and responsive design
**Context:** The form structure is complete with proper semantic HTML. Focus on styling, animations, and accessibility.
```

#### Example 2: UI to Testing

```markdown
## Handoff Summary

**Agent:** ui-ux-developer
**Task:** Style and make contact form responsive
**Status:** ✅ Complete

### What Was Done
- Styled form with Tailwind CSS 4
- Implemented responsive breakpoints (mobile → desktop)
- Tested all 8 brightness modes
- Added focus states and animations
- Ensured WCAG AA accessibility

### Files Changed
- app/contact/page.tsx - Added Tailwind classes
- app/contact/components/ContactForm.tsx - New component

### Testing Status
- [x] Unit tests: Still passing (no logic changes)
- [ ] E2E tests: Need comprehensive test coverage
- [x] Manual testing: Tested on all screen sizes

### Next Steps
1. Write E2E tests for contact form submission
2. Test validation error states
3. Test success/failure flows
4. Test keyboard navigation
5. Verify hydration after form submission

### Recommended Next Agent
**Agent:** test-engineer
**Reason:** Need comprehensive test coverage
**Context:** Form is complete and styled. Focus on user flow testing, including validation, submission, and error handling.
```

#### Example 3: Testing to Deployment

```markdown
## Handoff Summary

**Agent:** test-engineer
**Task:** Write comprehensive tests for contact form
**Status:** ✅ Complete

### What Was Done
- Added 12 unit tests for form validation
- Created 3 E2E tests for user flows
- Tested all error states
- Verified hydration safety
- All tests passing ✅

### Files Changed
- app/contact/components/ContactForm.test.tsx - 12 unit tests
- e2e/contact-form.spec.ts - 3 E2E tests

### Testing Status
- [x] Unit tests: 788/788 passing (+12)
- [x] E2E tests: 69/69 passing (+3)
- [x] Manual testing: All scenarios verified

### Next Steps
1. Verify all quality gates pass
2. Deploy to pre-deployment branch
3. Monitor for issues
4. Merge to main after verification

### Recommended Next Agent
**Agent:** deployment-engineer
**Reason:** Ready for production deployment
**Context:** All tests passing, quality gates should pass. Contact form feature is complete and ready for users.
```

---

## Quality Standards

### Every Agent Must Ensure

#### 1. Code Quality

- ✅ Zero ESLint errors
- ✅ Zero TypeScript errors
- ✅ Follows project patterns
- ✅ Uses `@/` path alias
- ✅ No TODO comments
- ✅ No console.log in production

#### 2. Testing

- ✅ Unit tests for logic
- ✅ E2E tests for flows
- ✅ All tests passing
- ✅ No skipped tests without reason
- ✅ Coverage maintained or improved

#### 3. Documentation

- ✅ Code is self-documenting
- ✅ Complex logic has comments
- ✅ API routes documented
- ✅ PropTypes/schemas defined

#### 4. Performance

- ✅ Bundle size within limits
- ✅ Images optimized
- ✅ No unnecessary re-renders
- ✅ Proper code splitting

#### 5. Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Focus management

#### 6. Project-Specific

- ✅ 8 brightness modes supported (UI)
- ✅ Hydration-safe patterns (SSR)
- ✅ No hardcoded colors
- ✅ Lucide icons (no emojis)

### Quality Gates (Pre-Deployment)

All 6 gates must pass before merging to main:

1. **ESLint**: `npm run lint` - 0 errors
2. **TypeScript**: `npx tsc --noEmit` - 0 errors
3. **Unit Tests**: `npm test` - 776+ passing
4. **Build**: `npm run build` - Success
5. **Bundle Size**: `npm run size` - Within limits
6. **E2E Tests**: `npm run test:e2e` - 66+ passing

### Agent Accountability

Each agent is accountable for their domain's quality:

| Agent                          | Quality Responsibility                 |
| ------------------------------ | -------------------------------------- |
| nextjs-architect               | Architecture, routing, SSR correctness |
| ui-ux-developer                | Visual quality, responsiveness, a11y   |
| deployment-engineer            | Deploy success, zero downtime          |
| test-engineer                  | Test coverage, test quality            |
| ai-sdk-specialist              | AI tool reliability, LLM costs         |
| mastra-optimization-researcher | Architecture optimization              |
| xai-integration-optimizer      | xAI performance and costs              |

---

## Best Practices

### For Users

1. **Be Specific**: "Fix the sidebar styling on mobile" is better than "Fix the sidebar"
2. **Mention Context**: "The contact form we just built" helps agent understand
3. **State Constraints**: "Without changing existing tests" prevents rework
4. **Trust the Agent**: Let them follow their domain expertise
5. **Allow Handoffs**: Don't force one agent to do everything

### For Agent Selection

1. **Start Narrow**: Choose the most specific agent first
2. **Allow Escalation**: Agent can hand off if needed
3. **Consider Sequence**: Some tasks naturally flow (architecture → UI → testing)
4. **Parallel When Possible**: Independent work can happen simultaneously
5. **Iterate**: It's okay to revisit agents for refinement

### For Handoffs

1. **Be Explicit**: Clear handoff summary, not implicit
2. **Include Context**: Next agent needs to understand what was done
3. **List Files**: What was changed and why
4. **Test Status**: What's tested, what's not
5. **Next Steps**: Clear action items for next agent

---

## Troubleshooting

### "Agent did work outside their domain"

**Solution**: Use handoff procedure to transfer to correct agent

### "Multiple agents needed but unclear order"

**Solution**: Use decision tree, or start with nextjs-architect for coordination

### "Agent asked for clarification"

**Solution**: Provide more context about what you're trying to achieve

### "Quality gates failing"

**Solution**: Use test-engineer or deployment-engineer to diagnose

### "Not sure which agent to use"

**Solution**:

1. Check decision tree
2. Use scenario matrix
3. Default to nextjs-architect for full-stack tasks

---

## Agent Communication Protocol

### How Agents Communicate

Agents don't directly talk to each other, but they:

1. **Leave Clear Handoffs**: Documented summaries for next agent
2. **Reference Context**: Point to relevant files and patterns
3. **Follow Conventions**: All agents know project patterns
4. **Use Skills**: Shared knowledge through skill files
5. **Maintain Quality**: Each agent enforces standards

### Communication Flow

```
User Request
     ↓
Agent Selection (based on domain)
     ↓
Agent Works (using skills + context)
     ↓
Agent Completes (or hands off)
     ↓
[If handoff needed]
     ↓
Clear Handoff Summary
     ↓
Next Agent Continues
```

---

## Advanced Patterns

### Meta-Agent Coordination

For complex features requiring multiple domains, nextjs-architect can act as coordinator:

```
User: "Build a complete blog system with AI-powered summaries"

Coordinator: nextjs-architect
├─ Phase 1: nextjs-architect (architecture)
├─ Phase 2: ai-sdk-specialist (AI tools)
├─ Phase 3: ui-ux-developer (UI components)
├─ Phase 4: test-engineer (comprehensive tests)
└─ Phase 5: deployment-engineer (deploy)
```

### Consultation Pattern

Any agent can pause to consult another agent's skill:

```
Agent: ui-ux-developer (working on component)
Pause: "Need to check hydration pattern"
Consult: Read hydration-safety-skill
Resume: Continue with proper pattern
```

### Iterative Refinement

Some tasks benefit from multiple passes:

```
Pass 1: Initial implementation
Pass 2: Optimization (research agent)
Pass 3: Final polish
```

---

## Quick Reference

### Agent Quick Selector

| If you need...  | Use this agent                 |
| --------------- | ------------------------------ |
| New page        | nextjs-architect               |
| Fix styling     | ui-ux-developer                |
| Fix deployment  | deployment-engineer            |
| Write tests     | test-engineer                  |
| Add AI tool     | ai-sdk-specialist              |
| Optimize Mastra | mastra-optimization-researcher |
| Optimize xAI    | xai-integration-optimizer      |
| Not sure        | nextjs-architect               |

### Common Commands

```bash
# Run all quality gates
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run test:e2e

# Watch tests during development
npm test -- --watch

# Run specific agent tests
npm test -- nextjs-architect

# Deploy to staging
git push origin pre-deployment

# View logs
vercel logs
```

---

## Conclusion

The specialized agent architecture ensures:

- ✅ **Deep Expertise**: Each agent masters their domain
- ✅ **Quality Focus**: Every agent enforces standards
- ✅ **Clear Ownership**: No confusion about responsibility
- ✅ **Efficient Collaboration**: Clean handoffs between agents
- ✅ **Maintainability**: Consistent patterns across codebase

Remember: The goal isn't just to complete tasks—it's to maintain a production-grade portfolio that showcases technical excellence. Every agent plays a part in achieving that goal.

---

**Need Help?**

- Check [CLAUDE.md](./CLAUDE.md) for the strategic router
- Review [skills directory](./skills/) for implementation patterns
- See [commands directory](./commands/) for common workflows

**Last Updated:** 2025-11-08 (Phase 1 - Foundation Complete)
