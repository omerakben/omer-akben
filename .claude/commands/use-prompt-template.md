# Use Prompt Template Command

**Purpose:** Quick access to agentic flow-optimized prompt templates

**Last Updated:** 2025-11-08

---

## Overview

Access standardized prompt templates for consistent project work across all task types. Templates integrate with your #PLAN#, #ACTION#, and #RESEARCH# workflow modes.

---

## Quick Template Selection

### By Task Type

### Development

```typescript
1. Feature Development       - New features, components, tools
2. Bug Fix & Investigation   - Debug and fix issues
3. UI/UX Enhancement        - Styling and component work
4. API & Backend Logic      - Server-side development
5. Testing Implementation   - Test coverage
```typescript

### Optimization

```typescript
6. Performance Optimization      - Speed improvements
7. Bundle Size Reduction        - Size optimization
8. Memory System Optimization   - Memory tuning
```typescript

### Research

```typescript
9. Technical Research            - General investigation
10. Library Investigation        - Tool evaluation
11. Competitive Analysis         - Market research
```typescript

### Infrastructure

```typescript
12. Deployment & CI/CD          - Releases and configuration
13. Security Audit              - Security review
14. Quality Gate Debugging      - CI/CD troubleshooting
```typescript

### Documentation

```typescript
15. Technical Documentation     - Guides and references
16. Skill Creation             - Pattern documentation
17. Agent Enhancement          - Agent improvements
```typescript

---

## Common Scenarios

| What You're Doing      | Template Number | Mode       |
| ---------------------- | --------------- | ---------- |
| New chat tool          | #4              | #PLAN#     |
| Fix hydration error    | #2              | #RESEARCH# |
| Improve button styling | #3              | #PLAN#     |
| Add test coverage      | #5              | #ACTION#   |
| Homepage slow          | #6              | #RESEARCH# |
| Bundle too large       | #7              | #RESEARCH# |
| Vector search slow     | #8              | #PLAN#     |
| Evaluate library       | #10             | #RESEARCH# |
| Research approach      | #9              | #RESEARCH# |
| Compare features       | #11             | #RESEARCH# |
| Deploy to prod         | #12             | #PLAN#     |
| Security check         | #13             | #RESEARCH# |
| Tests failing          | #14             | #ACTION#   |
| Write API docs         | #15             | #PLAN#     |
| Document pattern       | #16             | #PLAN#     |
| Improve agent          | #17             | #PLAN#     |

---

## Usage Examples

### Example 1: Use Feature Development Template

```typescript
I need template #1 for adding a new email notification feature
```typescript

Response includes:

- Full template structure
- Agent recommendation (ai-sdk-specialist)
- Skills needed (aI-agent-implementation-skill, environment-configuration-skill)
- Checkpoint structure
- Quality gate requirements
- Documentation permission request

---

### Example 2: Use Bug Fix Template

```typescript
I need template #2 for fixing a hydration error on the contact form
```typescript

Response includes:

- Research-first approach
- Investigation checklist
- Error documentation structure
- Switch to ACTION mode guidance
- Agent recommendation (nextjs-architect)
- Skills needed (hydration-safety-skill)

---

### Example 3: Use Research Template

```typescript
I need template #9 to research rate-limiting strategies for API routes
```typescript

Response includes:

- Research question framework
- Search strategy (Context7, web, Google Drive)
- Batch processing approach
- Source evaluation criteria
- Pure research format (no implementation)

---

## Template Files

### Full Templates
`.claude/PROMPT_TEMPLATES.md`

- Complete templates with all sections
- Usage guidelines
- Checkpoint protocols
- Documentation standards

### Quick Reference
`.claude/PROMPT_TEMPLATES_QUICK.md`

- Fast template selection
- Visual decision tree
- Common scenarios
- Quick copy starters

---

## Integration with Workflow Modes

### #PLAN# Mode Templates

Use for complex, strategic work:

- #1 Feature Development
- #3 UI/UX Enhancement
- #4 API & Backend Logic
- #8 Memory System Optimization
- #12 Deployment & CI/CD
- #15 Technical Documentation
- #16 Skill Creation
- #17 Agent Enhancement

### #ACTION# Mode Templates

Use for execution with minimal interruption:

- #5 Testing Implementation
- #14 Quality Gate Debugging

### #RESEARCH# Mode Templates

Use for pure information gathering:

- #2 Bug Fix & Investigation (initial phase)
- #6 Performance Optimization (initial phase)
- #7 Bundle Size Reduction (initial phase)
- #9 Technical Research
- #10 Library/Framework Investigation
- #11 Competitive Analysis
- #13 Security Audit

---

## Agent Recommendations by Template

### ui-ux-developer

- Template #3 (UI/UX Enhancement)
- Template #1 (Feature Development - UI)

### nextjs-architect

- Template #1 (Feature Development)
- Template #2 (Bug Fix)

### ai-sdk-specialist

- Template #4 (API & Backend Logic)
- Template #1 (Feature Development - AI)

### test-engineer

- Template #5 (Testing Implementation)
- Template #14 (Quality Gate Debugging)

### deployment-engineer

- Template #12 (Deployment & CI/CD)
- Template #13 (Security Audit)

### mastra-optimization-researcher

- Template #6 (Performance Optimization)
- Template #7 (Bundle Size Reduction)
- Template #8 (Memory System Optimization)

### xai-integration-optimizer

- Template #4 (API & Backend - LLM)
- Template #6 (Performance - Models)

---

## Quick Start Starters

### Starter #1: Feature Development (#PLAN#)

```typescript
#PLAN#

PROJECT: omer-akben Portfolio
FEATURE: [Feature name]
AGENT: [Select agent]
SKILLS: [Select skills]

OBJECTIVE:
[What needs to be built]

REQUIREMENTS:
- [ ] Must pass all 6 quality gates
- [ ] Must work across all 8 brightness modes
- [ ] Must use @/ imports only

CHECKPOINT STRUCTURE:
- 25%: [Milestone] - PAUSE
- 50%: [Milestone] - PAUSE
- 75%: [Milestone] - PAUSE
- 100%: Quality gates + deployment

DOCUMENTATION PERMISSION:
May I create tracking documents?
```typescript

### Starter #2: Bug Fix (#RESEARCH# → #ACTION#)

```typescript
#RESEARCH#

PROJECT: omer-akben Portfolio
BUG: [Bug title]
SEVERITY: [Level]
AGENT: [Select agent]

OBSERVED: [What's happening]
EXPECTED: [What should happen]
REPRODUCTION: [Steps]

ERROR MESSAGES:
[Paste errors]

After research, switch to #ACTION# with checkpoints
```typescript

### Starter #3: Research (#RESEARCH#)

```typescript
#RESEARCH#

PROJECT: omer-akben Portfolio
RESEARCH: [Topic]
AGENT: [Select agent]

RESEARCH QUESTION: [What needs answering?]

SEARCH STRATEGY:
1. Context7: [Documentation]
2. Web search: [Best practices]
3. Google Drive: [Internal docs]

May I create research document?
```typescript

---

## Related Commands

- **quality-gates** - Run all 6 quality gates
- **create-ai-tool** - AI tool creation workflow
- **create-feature** - Feature development workflow

---

## Related Documentation

- **CLAUDE.md** - Agent/skill selection guide
- **AGENTS.md** - Unified coding standards
- **.claude/agents/** - Individual agents
- **.claude/skills/** - Skill details

---

**Version:** 1.0
**Created:** 2025-11-08
**Purpose:** Quick access to prompt templates
**Usage:** "I need template #[number] for [task]"
