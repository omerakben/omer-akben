---
title: "extract_summary Tool"
description: "Extract concise summaries from web page content with configurable maximum length (50-500 words)"
date: 2025-11-02
status: stable
tags: [api, tool, summarization, content, extraction]
---

# extract_summary Tool

Extract concise summaries from web page content with configurable word count limits.

## Purpose

Provides automated content summarization for web pages using browser automation and text extraction. Generates concise summaries with configurable length (50-500 words). Used for quick page previews, AI context building, and content condensation.

## Use Cases

- User asks "What's on the projects page?"
- AI needs concise page summary for context
- Generate page previews for navigation
- Quick content overview without reading full page
- Extract key points from long content
- Build context for follow-up questions

## Endpoint

```
POST /api/tools/extract-summary
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

**Browser Automation**: Uses Playwright for content extraction

## Input Schema

### Parameters

```typescript
{
  maxLength?: number  // Optional, default: 200 words
}
```

| Parameter   | Type   | Required | Default | Constraints | Description                     |
| ----------- | ------ | -------- | ------- | ----------- | ------------------------------- |
| `maxLength` | number | No       | 200     | 50-500      | Maximum summary length in words |

### Validation Rules

- `maxLength` is optional (defaults to 200 words)
- `maxLength` must be between 50 and 500 (inclusive)
- Actual summary may be shorter than `maxLength` if page content is brief

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    summary: string,      // Extracted summary text
    wordCount: number     // Actual word count of summary
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: string           // Error message
}
```

## Examples

### Example 1: Default Summary Length (200 words)

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/extract-summary \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "summary": "Omer Akben is a Full-Stack Developer and AI enthusiast based in Nashville, TN. His portfolio showcases 12+ projects spanning AI/ML, web development, and mobile applications. Notable projects include Ozzy AI Portfolio Assistant (Next.js 15 + Vercel AI SDK + Upstash Vector for episodic memory), OpenAI Cache Middleware (Redis-backed caching layer reducing API costs by 60%), and Patient Safety Portal (healthcare platform with HIPAA-compliant data handling). Technical expertise includes Next.js, React, TypeScript, Python, AWS, and modern AI tools (OpenAI GPT-4, Langchain, Pinecone). Omer holds certifications from AWS Cloud Practitioner Essentials and Nashville Software School. His work emphasizes production-ready code, comprehensive testing (667 unit tests, WCAG 2A compliance), and zero technical debt. Available for full-time opportunities, consulting engagements, and technical interviews. Contact: me@omerakben.com",
    "wordCount": 125
  }
}
```

### Example 2: Brief Summary (100 words)

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/extract-summary \
  -H "Content-Type: application/json" \
  -d '{"maxLength": 100}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "summary": "Omer Akben is a Full-Stack Developer specializing in AI integration and modern web applications. Portfolio features 12+ projects including AI assistants, healthcare platforms, and developer tools. Tech stack: Next.js, React, TypeScript, Python, AWS. Holds AWS and Nashville Software School certifications. Known for production-ready code with comprehensive testing (667 unit tests). Available for opportunities in Nashville, TN. Contact: me@omerakben.com",
    "wordCount": 65
  }
}
```

### Example 3: Detailed Summary (500 words)

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/extract-summary \
  -H "Content-Type: application/json" \
  -d '{"maxLength": 500}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "summary": "[Extended 500-word summary with comprehensive project details, technical skills breakdown, career journey highlights, testing achievements, and contact information]",
    "wordCount": 487
  }
}
```

### Example 4: Max Length Too Low Error

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/extract-summary \
  -H "Content-Type: application/json" \
  -d '{"maxLength": 25}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Number must be greater than or equal to 50"
}
```

### Example 5: Max Length Too High Error

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/extract-summary \
  -H "Content-Type: application/json" \
  -d '{"maxLength": 1000}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Number must be less than or equal to 500"
}
```

## Summary Length Guidelines

| Max Length | Use Case                   | Typical Output                         |
| ---------- | -------------------------- | -------------------------------------- |
| 50 words   | Ultra-brief preview        | 1-2 sentences, key facts only          |
| 100 words  | Quick overview             | 2-3 sentences, main points             |
| 200 words  | Standard summary (default) | 3-5 sentences, comprehensive overview  |
| 300 words  | Detailed summary           | Full paragraph, key details            |
| 500 words  | Extensive summary          | Multiple paragraphs, thorough coverage |

## Content Extraction Process

1. **Page Navigation**: Playwright loads current page
2. **Content Extraction**: Extract text from main content areas
3. **Cleaning**: Remove navigation, headers, footers, ads
4. **Summarization**: Intelligent truncation to `maxLength`
5. **Word Count**: Calculate actual words in summary
6. **Return**: Summary text + word count

## Error Handling

### Common Errors

| Status | Error                     | Cause             | Solution                  |
| ------ | ------------------------- | ----------------- | ------------------------- |
| 400    | Max length too low        | maxLength < 50    | Use 50-500 range          |
| 400    | Max length too high       | maxLength > 500   | Use 50-500 range          |
| 400    | Invalid request           | Malformed JSON    | Verify JSON syntax        |
| 429    | Rate limit exceeded       | Too many requests | Wait 60 seconds           |
| 500    | Content extraction failed | Page load error   | Retry after a few seconds |
| 500    | Navigation timeout        | Page didn't load  | Check page exists         |

## Implementation Details

**File Location**: `src/app/api/tools/extract-summary/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `extractPageSummaryInputSchema`
- Output: `extractPageSummaryOutputSchema`

**Browser Automation**: Playwright

- Headless mode (no UI)
- Text extraction from DOM
- 30-second timeout

**Features**:

- ✅ Configurable summary length (50-500 words)
- ✅ Zod schema validation
- ✅ Intelligent content extraction (main content only)
- ✅ Word count calculation
- ✅ Browser automation via Playwright
- ✅ Server-side only (no client exposure)

## Content Extraction Strategy

### Included Content

- ✅ Main page content (`<main>`, `<article>`, `[role="main"]`)
- ✅ Headings (`<h1>`, `<h2>`, `<h3>`)
- ✅ Paragraphs (`<p>`)
- ✅ Lists (`<ul>`, `<ol>`, `<li>`)
- ✅ Semantic elements (`<section>`, `<aside>`)

### Excluded Content

- ❌ Navigation menus (`<nav>`, `[role="navigation"]`)
- ❌ Headers/footers (`<header>`, `<footer>`)
- ❌ Ads and promotional content
- ❌ Sidebars (unless semantic `<aside>`)
- ❌ JavaScript-generated dynamic content (unless rendered)

## Performance Notes

| Max Length    | Extraction Time | Typical Response      |
| ------------- | --------------- | --------------------- |
| 50-100 words  | ~1-2 seconds    | Fast, basic summary   |
| 200 words     | ~2-3 seconds    | Standard performance  |
| 300-500 words | ~3-5 seconds    | Slower, comprehensive |

## Related Tools

- [navigate_page](navigate-page.md) - Navigate to page before extracting summary
- [list_projects](list-projects.md) - Get project summaries
- [open_project](open-project.md) - Detailed project information

## AI Assistant Usage

### Pattern 1: Page Preview

```typescript
// User asks: "What's on the projects page?"
// 1. Navigate to page
await navigate_page({ url: "https://omerakben.com/projects" });

// 2. Extract summary
const { summary } = await extract_summary({ maxLength: 200 });

// AI Response: "The projects page features..."
```

### Pattern 2: Context Building

```typescript
// AI needs context for follow-up questions
const { summary } = await extract_summary({ maxLength: 100 });

// Use summary in conversation context
// Build informed responses about page content
```

## Changelog

- **2025-10-20**: Initial implementation with Playwright
- **2025-10-21**: Added configurable max length (50-500 range)
- **2025-10-22**: Improved content extraction strategy (main content focus)
