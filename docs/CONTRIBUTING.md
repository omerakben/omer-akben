# Contributing to Documentation

Thank you for your interest in improving the omerakben.com documentation! This guide will help you contribute effectively.

## Documentation Structure

```
docs/
├── architecture/     # Technical architecture and system design
├── guides/          # Implementation guides (accessibility, SEO)
├── api/             # API reference documentation
│   └── tools/       # Individual tool documentation
├── operations/      # Runbooks, security, performance
├── reference/       # Quick reference (env vars, tech stack)
└── index.md         # Documentation home page
```

## Standards and Conventions

### File Naming

- **Lowercase kebab-case**: Use `environment-variables.md`, not `Environment_Variables.md`
- **Descriptive names**: `accessibility.md` not `a11y.md`
- **No special characters**: Avoid spaces, underscores, or symbols (except hyphens)

### YAML Frontmatter

All documentation files must include YAML frontmatter:

```yaml
---
title: "Human-Readable Title"
description: "Brief description of the document (1-2 sentences)"
date: YYYY-MM-DD
status: stable|mvp|draft|deprecated
tags: [tag1, tag2, tag3]
---
```

**Field Definitions**:

- **title**: Display title (use quotes for special characters)
- **description**: SEO-friendly summary (150-200 characters)
- **date**: Creation or last major update date (YYYY-MM-DD format)
- **status**: Document maturity (`stable`, `mvp`, `draft`, `deprecated`)
- **tags**: Lowercase, hyphenated keywords (3-7 tags)

### Markdown Style

**Headers**:

- Use ATX-style headers (`#`, `##`, `###`)
- Single H1 per document (matching frontmatter title)
- Hierarchical structure (H1 → H2 → H3, no skipping levels)

**Code Blocks**:

- Always specify language: ` ```typescript`, ` ```bash`, ` ```json`
- Use syntax highlighting for readability

**Links**:

- Relative links for internal docs: `[overview](../architecture/overview.md)`
- Absolute URLs for external resources

**Lists**:

- Use `-` for unordered lists (consistency)
- Use `1.` for ordered lists (auto-numbering)

**Tables**:

- Use for structured data (API parameters, error codes)
- Include header row with column names

**Examples**:

- Provide real-world examples with curl commands, code snippets
- Show both success and error cases

### API Tool Documentation Template

When documenting a new API tool in `/docs/api/tools/`:

```markdown
---
title: "tool_name Tool"
description: "Brief tool description with key features"
date: YYYY-MM-DD
status: stable|mvp
tags: [api, tool, domain-specific-tags]
---

# tool_name Tool

Brief introduction paragraph.

## Purpose

Detailed explanation of what the tool does and why it exists.

## Use Cases

- User scenario 1
- User scenario 2
- AI assistant scenario

## Endpoint

\`\`\`
GET  /api/tools/tool-name
POST /api/tools/tool-name
\`\`\`

**Rate Limit**: X requests/minute

## Input Schema

### Parameters

\`\`\`typescript
{
  param1: type,
  param2?: type
}
\`\`\`

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| `param1`  | string | Yes      | -       | ...         |

## Output Schema

### Success Response

\`\`\`typescript
{
  success: true,
  data: { ... }
}
\`\`\`

## Examples

### Example 1: Basic Usage

**Request**:
\`\`\`bash
curl ...
\`\`\`

**Response**:
\`\`\`json
{ ... }
\`\`\`

## Error Handling

| Status | Error | Cause | Solution |
| ------ | ----- | ----- | -------- |
| 400    | ...   | ...   | ...      |

## Implementation Details

**File Location**: `src/app/api/tools/...`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

## Related Tools

- [other_tool](other-tool.md) - Related functionality

## Changelog

- **YYYY-MM-DD**: Initial implementation
```

## Contributing Process

### 1. Before You Start

- **Read existing docs**: Familiarize yourself with the current structure and style
- **Check for duplicates**: Ensure your contribution isn't already covered
- **Open an issue**: Discuss major changes before implementing

### 2. Making Changes

**Setup**:

```bash
git checkout pre-deployment
git pull origin pre-deployment
git checkout -b docs/your-feature-name
```

**Edit Documentation**:

- Follow the standards above
- Add YAML frontmatter to new files
- Update index files if adding new categories
- Test links and code examples

**Verify**:

```bash
# Check for broken links (if link checker installed)
npx markdown-link-check docs/**/*.md

# Run linting (if markdownlint configured)
npx markdownlint docs/

# Build Next.js to verify no errors
npm run build
```

### 3. Submitting Changes

**Create Pull Request**:

```bash
git add docs/
git commit -m "docs: add X documentation"
git push origin docs/your-feature-name
```

**PR Description Template**:

```markdown
## What
Brief description of what you changed.

## Why
Explain the motivation (missing documentation, outdated info, etc.).

## Changes
- Added X documentation
- Updated Y section
- Fixed broken links in Z

## Checklist
- [ ] YAML frontmatter added to new files
- [ ] Markdown linting passes
- [ ] Links tested (internal and external)
- [ ] Examples tested (curl commands, code snippets)
- [ ] Index files updated (if applicable)
```

**Review Process**:

1. Automated checks run (markdownlint, link checking)
2. Maintainer review for accuracy and style
3. Merge to `pre-deployment`
4. Auto-deployment to production (after CI/CD passes)

## Documentation Best Practices

### Writing Style

**Be Clear and Concise**:

- Use short sentences (15-20 words)
- Avoid jargon unless necessary (define technical terms)
- Write in active voice ("The tool returns..." not "Results are returned...")

**Be Specific**:

- Provide exact file paths: `src/app/api/tools/download-resume/route.ts`
- Include version numbers: `Next.js 15`, `React 19`
- Show actual output, not placeholders: `"email": "me@omerakben.com"`

**Be Helpful**:

- Explain *why*, not just *what*
- Include common pitfalls and solutions
- Provide real-world examples

### Code Examples

**Complete and Runnable**:

```bash
# ✅ Good - Complete command with all flags
curl -X POST http://localhost:3001/api/tools/download-resume \
  -H "Content-Type: application/json" \
  -d '{"format": "resume"}'

# ❌ Bad - Incomplete or pseudocode
curl POST /api/tools/download-resume {...}
```

**Show Expected Output**:

```json
// Always include example responses
{
  "success": true,
  "data": { ... }
}
```

### Error Documentation

**Common Errors Table**:

- Include HTTP status code
- Explain cause clearly
- Provide actionable solution

Example:

| Status | Error          | Cause                        | Solution                   |
| ------ | -------------- | ---------------------------- | -------------------------- |
| 400    | Invalid format | Format not in allowed values | Use "resume" or "extended" |

## Documentation Categories

### Architecture (`/docs/architecture/`)

- System design, technical architecture
- Technology decisions and trade-offs
- Component relationships and data flow

### Guides (`/docs/guides/`)

- Step-by-step implementation guides
- Best practices (accessibility, SEO, performance)
- How-to tutorials

### API (`/docs/api/`)

- API endpoint reference
- Tool documentation (input/output schemas)
- Error codes and handling

### Operations (`/docs/operations/`)

- Runbooks for incident response
- Security configuration
- Performance testing workflows

### Reference (`/docs/reference/`)

- Quick reference guides
- Environment variables
- Technology stack
- Development commands

## Questions?

- **Slack**: #documentation (if available)
- **GitHub Issues**: Open an issue with `[docs]` prefix
- **Email**: <me@omerakben.com> for sensitive questions

## License

By contributing to this documentation, you agree that your contributions will be licensed under the same license as the main project.
