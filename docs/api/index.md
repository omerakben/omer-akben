---
title: "API Documentation"
description: "Server-side tools, Zod schemas, and API endpoints powering the AI assistant on omerakben.com"
date: 2025-11-02
status: stable
tags: [api, tools, schemas, ai-assistant, endpoints]
---

# API Documentation

Complete API reference for the 11 server-side tools powering Ozzy AI assistant, including Zod validation schemas and endpoint specifications.

## Overview

All API tools follow a consistent pattern:

- **Location**: `src/app/api/tools/[tool-name]/route.ts`
- **Schema Validation**: Zod schemas in `src/lib/agent-tools/schemas.ts`
- **Response Format**: `{ success: boolean, data?: T, error?: string }`
- **Rate Limiting**: Redis-backed via middleware (route-specific limits)
- **Authentication**: Server-side only, no client exposure

## Tool Categories

### Document Management

- **[download_resume](tools/download-resume.md)** - 4 formats (full, short, two-page, docx)
- **[download_certificate](tools/download-certificate.md)** - AWS, NSS certificates

### Project Information

- **[list_projects](tools/list-projects.md)** - Filter by category, featured flag, limit
- **[open_project](tools/open-project.md)** - Get detailed project information by slug

### Contact & Communication

- **[get_contact](tools/get-contact.md)** - Retrieve contact information
- **[collect_contact](tools/collect-contact.md)** - Proactive contact collection with email

### Navigation

- **[navigate_page](tools/navigate-page.md)** - Page navigation links
- **[provide_navigation_links](tools/provide-navigation-links.md)** - Navigation menu structure

### Utilities

- **[extract_summary](tools/extract-summary.md)** - Content summarization
- **[profile_performance](tools/profile-performance.md)** - Performance profiling
- **[trigger_workflow](tools/trigger-workflow.md)** - Workflow execution

## Schema Reference

All tool schemas are defined in `src/lib/agent-tools/schemas.ts` using Zod for runtime validation.

### Common Patterns

```typescript
// Response envelope (all tools)
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Input validation (example)
const DownloadResumeSchema = z.object({
  format: z.enum(['full', 'short', 'two-page', 'docx']),
});

// Output schema (example)
const DownloadResumeResponseSchema = z.object({
  url: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
});
```

## Rate Limiting

| Route Pattern      | Limit        | Window   |
| ------------------ | ------------ | -------- |
| `/api/chat`        | 30 requests  | 1 minute |
| `/api/tools/*`     | 60 requests  | 1 minute |
| `/api/*` (generic) | 100 requests | 1 minute |

## Error Handling

All tools follow consistent error patterns:

```typescript
// Validation error
{
  success: false,
  error: "Invalid format parameter: must be one of [full, short, two-page, docx]"
}

// Rate limit error
{
  success: false,
  error: "Too many requests. Please try again in 60 seconds."
}

// Server error
{
  success: false,
  error: "Internal server error"
}
```

## Related Documentation

- [Architecture](../architecture/index.md) - System architecture and tool integration
- [Operations](../operations/index.md) - Rate limiting, monitoring, incident response
- [Reference](../reference/index.md) - Environment variables, tech stack
