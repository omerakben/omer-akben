# PROMPT TEMPLATES SYSTEM - README

**Purpose:** Complete guide to using agentic flow-optimized prompt templates

**Last Updated:** 2025-11-08

---

## 🎯 What This System Does

The Prompt Templates System provides **17 standardized templates** that integrate seamlessly with your workflow preferences (#PLAN#, #ACTION#, #RESEARCH#) and project-specific agents, skills, and quality standards.

### Key Benefits

✅ **Consistency** - Same structure for every task type
✅ **Efficiency** - Pre-built templates save setup time
✅ **Quality** - Built-in checkpoints and quality gates
✅ **Integration** - Works with all 7 agents and 9 skills
✅ **Flexibility** - Customizable for any scenario
✅ **Documentation** - Automatic permission requests

---

## 📚 System Components

### 1. Full Templates (`PROMPT_TEMPLATES.md`)

**1028 lines** of comprehensive templates with:

- Complete template structures
- When to use guidance
- Agent recommendations
- Skill pairings
- Usage examples
- Quick start starters

**17 Templates Organized by Category:**

- Development (5)
- Optimization (3)
- Research (3)
- Infrastructure (3)
- Documentation (3)

### 2. Quick Reference (`PROMPT_TEMPLATES_QUICK.md`)

**294 lines** of fast template selection with:

- Visual decision trees
- Template selector by task type
- Common scenario mapping
- Agent pairing guide
- Quick copy starters
- Pro tips

### 3. Command File (`commands/use-prompt-template.md`)

**303 lines** for Claude Code integration with:

- Quick template access
- Usage examples
- Common scenarios table
- Integration with agents
- Workflow mode guidance

---

## 🚀 Quick Start

### Method 1: Direct Template Selection

1. Identify your task type
2. Check Quick Reference decision tree
3. Copy appropriate template
4. Fill in project details
5. Execute with chosen mode

### Method 2: Using the Command

```
I need template #[number] for [task description]
```

**Examples:**

```
I need template #1 for adding a new chat tool feature
I need template #2 for fixing a hydration bug
I need template #9 to research rate limiting strategies
```

### Method 3: By Scenario

**Check the Common Scenarios Table:**

| Scenario               | Template | Mode       |
| ---------------------- | -------- | ---------- |
| Building new chat tool | #4       | #PLAN#     |
| Fixing hydration error | #2       | #RESEARCH# |
| Improving styling      | #3       | #PLAN#     |
| Adding tests           | #5       | #ACTION#   |
| Performance issue      | #6       | #RESEARCH# |
| Bundle too large       | #7       | #RESEARCH# |

---

## 📋 The 17 Templates

### Development Templates (1-5)

**#1 Feature Development**

- **Mode:** #PLAN#
- **Agent:** ui-ux-developer, nextjs-architect, ai-sdk-specialist
- **Use For:** New features, major components, AI tools
- **Includes:** Architecture planning, checkpoint structure, quality gates

**#2 Bug Fix & Investigation**

- **Mode:** #RESEARCH# → #ACTION#
- **Agent:** Domain-specific
- **Use For:** Debugging, error resolution, test failures
- **Includes:** Root cause analysis, solution evaluation, fix implementation

**#3 UI/UX Enhancement**

- **Mode:** #PLAN#
- **Agent:** ui-ux-developer
- **Use For:** Styling, components, animations, responsive design
- **Includes:** Brightness mode testing, hydration safety, accessibility

**#4 API & Backend Logic**

- **Mode:** #PLAN#
- **Agent:** ai-sdk-specialist
- **Use For:** Server tools, API routes, integrations, database ops
- **Includes:** Security requirements, Zod schemas, rate limiting

**#5 Testing Implementation**

- **Mode:** #ACTION#
- **Agent:** test-engineer
- **Use For:** Unit tests, E2E tests, coverage gaps
- **Includes:** Test patterns, hydration testing, quality gate execution

### Optimization Templates (6-8)

**#6 Performance Optimization**

- **Mode:** #RESEARCH# → #ACTION#
- **Agent:** mastra-optimization-researcher
- **Use For:** Speed improvements, bottleneck resolution
- **Includes:** Profiling, benchmarking, optimization strategies

**#7 Bundle Size Reduction**

- **Mode:** #RESEARCH# → #ACTION#
- **Agent:** mastra-optimization-researcher
- **Use For:** Bundle optimization, dependency analysis
- **Includes:** Bundle analyzer, icon optimization, tree-shaking

**#8 Memory System Optimization**

- **Mode:** #PLAN#
- **Agent:** mastra-optimization-researcher
- **Use For:** Vector search tuning, memory performance
- **Includes:** Embedding strategy, index configuration, benchmarking

### Research Templates (9-11)

**#9 Technical Research**

- **Mode:** #RESEARCH#
- **Agent:** Domain-specific
- **Use For:** General investigation, best practices, technology evaluation
- **Includes:** Multi-source search, batch processing, synthesis

**#10 Library/Framework Investigation**

- **Mode:** #RESEARCH#
- **Agent:** Domain-specific
- **Use For:** Dependency selection, tool evaluation, framework migration
- **Includes:** Comparison matrix, evaluation criteria, technical analysis

**#11 Competitive Analysis**

- **Mode:** #RESEARCH#
- **Agent:** Domain-specific
- **Use For:** Feature inspiration, UX benchmarking, market positioning
- **Includes:** Competitor profiles, feature matrix, technical insights

### Infrastructure Templates (12-14)

**#12 Deployment & CI/CD**

- **Mode:** #PLAN#
- **Agent:** deployment-engineer
- **Use For:** Releases, environment config, CI/CD updates
- **Includes:** Branch strategy, quality gates, rollback plan

**#13 Security Audit**

- **Mode:** #RESEARCH#
- **Agent:** Security-specialist (Phase 3)
- **Use For:** Security review, vulnerability scanning, compliance
- **Includes:** API security, PII handling, dependency audit

**#14 Quality Gate Debugging**

- **Mode:** #ACTION#
- **Agent:** test-engineer
- **Use For:** CI/CD failures, build errors, test debugging
- **Includes:** Quick diagnosis, common fixes, verification steps

### Documentation Templates (15-17)

**#15 Technical Documentation**

- **Mode:** #PLAN#
- **Agent:** Domain-specific
- **Use For:** API docs, architecture docs, integration guides
- **Includes:** Content structure, code examples, review checkpoints

**#16 Skill Creation**

- **Mode:** #PLAN#
- **Agent:** Domain expert
- **Use For:** Pattern documentation, best practice codification
- **Includes:** Skill structure, examples, anti-patterns, agent integration

**#17 Agent Enhancement**

- **Mode:** #PLAN#
- **Agent:** N/A (meta-agent work)
- **Use For:** Agent improvements, capability expansion
- **Includes:** Enhancement strategy, testing approach, integration

---

## 🎨 Template Anatomy

Every template includes:

### Header Section

```
#[MODE]#

PROJECT: omer-akben Portfolio
[TYPE]: [Name]
AGENT: [Agent selection]
SKILLS: [Skill selection]
```

### Requirements Section

- Specific requirements
- Quality gate requirements
- Project-specific standards (brightness modes, imports, etc.)
- Success criteria

### Checkpoint Structure

```
- 25%: [Milestone] - PAUSE for review
- 50%: [Milestone] - PAUSE for review
- 75%: [Milestone] - PAUSE for review
- 100%: Final verification
```

### Documentation Permission

```
May I create the following documents?
- [ ] ProjectName_Type_2025-11-08.gdoc
- [ ] ProjectName_Tracker_2025-11-08.gsheet
```

### Detailed Guidance

- When to use
- Agent recommendations
- Related skills
- Common pitfalls
- Best practices

---

## 🔧 Customization Guide

### Adapting Templates

**Always Customize:**

1. Project-specific requirements
2. Checkpoint milestones (match task complexity)
3. Success criteria (specific to feature)
4. Documentation needs

**Never Remove:**

1. Quality gate requirements
2. Import standards (@/ only)
3. Security considerations
4. Checkpoint structure
5. Documentation permission requests

### Adding Project-Specific Elements

**For UI Work:**

- Always include brightness mode testing (all 8 modes)
- Add hydration safety considerations
- Include accessibility requirements (WCAG 2A)

**For API Work:**

- Always include rate limiting requirements
- Add security checklist
- Include error handling strategy

**For Optimization Work:**

- Always include baseline metrics
- Add target improvements
- Include benchmarking strategy

---

## 📊 Workflow Integration

### With #PLAN# Mode

Templates designed for #PLAN# mode:

- Feature Development (#1)
- UI/UX Enhancement (#3)
- API & Backend Logic (#4)
- Memory System Optimization (#8)
- Deployment & CI/CD (#12)
- Technical Documentation (#15)
- Skill Creation (#16)
- Agent Enhancement (#17)

**Characteristics:**

- Extensive exploration
- Multiple approaches considered
- Detailed planning phase
- Checkpoint reviews for approval

### With #ACTION# Mode

Templates designed for #ACTION# mode:

- Testing Implementation (#5)
- Quality Gate Debugging (#14)

**Characteristics:**

- Minimal interruption
- Execute between milestones
- Pause only at major checkpoints
- Focus on implementation

### With #RESEARCH# Mode

Templates designed for #RESEARCH# mode:

- Bug Fix & Investigation (#2 - initial phase)
- Performance Optimization (#6 - initial phase)
- Bundle Size Reduction (#7 - initial phase)
- Technical Research (#9)
- Library Investigation (#10)
- Competitive Analysis (#11)
- Security Audit (#13)

**Characteristics:**

- Pure information gathering
- No implementation steps
- Multi-source search
- Batch processing (3-5 sources at a time)

---

## 🎯 Mode Transitions

Some templates use **mode transitions** for phased work:

### Research → Action Pattern

**Bug Fix & Investigation (#2)**

```
Phase 1: #RESEARCH# - Identify root cause
↓
Phase 2: #ACTION# - Implement fix
```

**Performance Optimization (#6)**

```
Phase 1: #RESEARCH# - Analyze bottlenecks
↓
Phase 2: #ACTION# - Apply optimizations
```

**Bundle Size Reduction (#7)**

```
Phase 1: #RESEARCH# - Identify issues
↓
Phase 2: #ACTION# - Optimize bundle
```

### When to Transition

**Transition from RESEARCH to ACTION when:**

1. Root cause identified
2. Solution approach validated
3. Implementation path clear
4. Risks assessed

**Indicate transition:**

```
After research phase, switch to:
#ACTION# to implement with checkpoints:
- 25%: [Implementation milestone]
- 50%: [Implementation milestone]
- 75%: [Implementation milestone]
- 100%: Quality gates
```

---

## 📝 Documentation Protocol

### Permission Requests

**Always ask before creating:**

```
DOCUMENTATION PERMISSION:
May I create the following documents?
- [ ] FeatureName_Plan_2025-11-08.gdoc
- [ ] FeatureName_Tracker_2025-11-08.gsheet
```

### Naming Convention

```
ProjectName_DocumentType_YYYY-MM-DD
```

**Document Types:**

- **Plan** - Strategic planning documents
- **Tracker** - Progress tracking spreadsheets
- **Research** - Research findings and analysis
- **Notes** - General notes and observations
- **Requirements** - Requirement checklists
- **Implementation** - Implementation guides
- **Evaluation** - Evaluation reports
- **Analysis** - Competitive/technical analysis
- **Audit** - Security/quality audits
- **Documentation** - Technical documentation

### When Documents Are Needed

**Always create for:**

- Complex features (Plan + Tracker)
- Research tasks (Research document)
- Evaluations (Evaluation document)
- Audits (Audit document)

**Optional for:**

- Simple bug fixes
- Small enhancements
- Quick investigations

---

## ⚙️ Integration with Project Standards

### Critical Rules (Non-Negotiable)

All templates enforce:

**Import Standards:**

- ✅ Use @/ imports only
- ❌ Never use relative imports (../../)
- ❌ Never use archive imports (/archive/)
- ❌ Never use wildcard icon imports

**Quality Gates:**

```bash
✅ ESLint:     npm run lint
✅ TypeScript: npx tsc --noEmit
✅ Unit Tests: npm test
✅ Build:      npm run build
✅ Bundle:     npm run size
✅ E2E Tests:  npm run test:e2e
```

**Zero Technical Debt:**

- ❌ NO TODO comments
- ❌ NO console.log
- ❌ NO hardcoded colors
- ❌ NO inline styles
- ❌ NO disabled tests
- ❌ NO TypeScript `any`

**Server-Side Security:**

- ✅ All API calls server-side
- ✅ Environment variables server-side only
- ❌ Never expose secrets

**Design System:**

- ✅ Test all 8 brightness modes
- ✅ Use CSS custom properties
- ✅ Use Lucide icons only
- ✅ Hydration safety patterns

---

## 🎓 Best Practices

### Template Selection

1. **Start with task type** - Development, Optimization, Research, etc.
2. **Consider complexity** - Simple = ACTION mode, Complex = PLAN mode
3. **Check agent fit** - Match template agent to task domain
4. **Review requirements** - Ensure all critical items included

### Checkpoint Management

1. **Set realistic milestones** - Match complexity, not just percentages
2. **Always pause** - Never skip checkpoint reviews
3. **Summarize progress** - Clear, concise status updates
4. **Wait for approval** - Explicit confirmation before continuing

### Documentation Management

1. **Ask first** - Never create without permission
2. **Use naming convention** - Consistent, dated names
3. **Update progressively** - After each checkpoint
4. **Link related docs** - Cross-reference for context

### Quality Assurance

1. **Test locally first** - Before committing
2. **Run all gates** - Never skip any gate
3. **Fix immediately** - Don't defer fixes
4. **Document changes** - Track all modifications

---

## 🔍 Troubleshooting

### Common Issues

**Issue: Template feels too detailed**

- **Solution:** Use simplified starter versions in Quick Reference
- **Or:** Skip optional sections not relevant to your task

**Issue: Not sure which mode to use**

- **Solution:** Check template description for mode recommendation
- **Or:** Default to #PLAN# for safety, can switch to #ACTION# later

**Issue: Agent selection unclear**

- **Solution:** Refer to Agent Recommendations by Template section
- **Or:** Check CLAUDE.md Agent Selection Guide

**Issue: Checkpoint percentages don't match task**

- **Solution:** Customize milestones to match natural phases
- **Example:** For 3-phase task, use 33%, 66%, 100%

**Issue: Too many documentation permission requests**

- **Solution:** Bundle related docs in single permission request
- **Example:** "May I create Plan_2025-11-08.gdoc and Tracker_2025-11-08.gsheet?"

---

## 📖 Further Reading

### Primary Documentation

- **PROMPT_TEMPLATES.md** - Full template specifications (1028 lines)
- **PROMPT_TEMPLATES_QUICK.md** - Fast selection guide (294 lines)
- **commands/use-prompt-template.md** - Command usage (303 lines)

### Related Documentation

- **CLAUDE.md** - Agent/skill selection, quick reference
- **AGENTS.md** - Unified coding standards
- **.claude/agents/** - Individual agent documentation
- **.claude/skills/** - Skill implementation details
- **.claude/commands/** - Quick reference commands

### Project Documentation

- **README.md** - Project overview
- **AI_AGENT.md** - Agent capabilities
- **TODO.md** - Implementation roadmap

---

## 🚀 Next Steps

### Getting Started

1. **Review templates** - Scan PROMPT_TEMPLATES.md for overview
2. **Try Quick Reference** - Use decision tree for first template
3. **Practice with starters** - Use quick copy templates
4. **Customize as needed** - Adapt to specific scenarios

### Advanced Usage

1. **Create custom templates** - For recurring task patterns
2. **Enhance agents** - Update agents to reference templates
3. **Build workflows** - Chain templates for complex projects
4. **Optimize checkpoints** - Fine-tune milestone percentages

### Continuous Improvement

1. **Track effectiveness** - Note which templates work best
2. **Refine templates** - Adjust based on experience
3. **Share insights** - Document lessons learned
4. **Update regularly** - Keep templates current with project evolution

---

## 📊 Version History

**v1.0 (2025-11-08)**

- Initial release
- 17 comprehensive templates
- Quick reference guide
- Command integration
- Full documentation

---

## 💬 Feedback & Support

**Template Issues:**

- Check troubleshooting section
- Review related documentation
- Consult agent-specific guidance

**Template Enhancements:**

- Use Template #17 (Agent Enhancement) for improvements
- Document suggested changes
- Test with sample scenarios

---

**Version:** 1.0
**Created:** 2025-11-08
**Purpose:** Complete guide to prompt template system
**Maintenance:** Update when templates evolve or new patterns emerge
