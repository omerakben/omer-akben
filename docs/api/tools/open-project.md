---
title: "open_project Tool"
description: "Get detailed project information by slug including long description, technologies, images, dates, demo/GitHub links, and status"
date: 2025-11-02
status: stable
tags: [api, tool, projects, portfolio, details]
---

# open_project Tool

Retrieve comprehensive details for a specific project using its slug identifier.

## Purpose

Provides deep-dive information about a single project from Omer's portfolio. Returns extended project metadata including long description, images, dates, links, and comprehensive technology stack. Used when users want detailed information about a specific project.

## Use Cases

- User asks "Tell me more about [project name]"
- User clicks on a project card to view details
- User requests "What did you build for [project]?"
- Recruiter wants detailed technical information about a project
- User asks "When did you work on [project]?"
- Display project detail page

## Endpoint

```
GET  /api/tools/open-project
POST /api/tools/open-project
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

## Input Schema

### Parameters

```typescript
{
  slug: string  // Required, project identifier
}
```

| Parameter | Type   | Required | Description                                                   |
| --------- | ------ | -------- | ------------------------------------------------------------- |
| `slug`    | string | Yes      | Project slug (URL-safe identifier, e.g., "ozzy-ai-portfolio") |

### Validation Rules

- `slug` is **required**
- Must match an existing project slug
- Case-sensitive
- No default value

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    project: {
      id: string,
      slug: string,
      title: string,
      description: string,           // Short description
      longDescription?: string,      // Extended description (optional)
      technologies: string[],
      role: "Full-Stack" | "AI" | "QA" | "QA/AI",
      category: "ai-ml" | "web" | "mobile" | "tools" | "other",
      featured: boolean,
      demoUrl?: string,
      githubUrl?: string,
      status: "completed" | "in-progress" | "planned",
      image?: string,                // Project image URL (optional)
      startDate?: string,            // ISO 8601 date (optional)
      endDate?: string               // ISO 8601 date (optional)
    }
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: string  // Error message
}
```

## Examples

### Example 1: Get Ozzy AI Portfolio Details

**Request (POST)**:

```bash
curl -X POST http://localhost:3001/api/tools/open-project \
  -H "Content-Type: application/json" \
  -d '{"slug": "ozzy-ai-portfolio"}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "project": {
      "id": "1",
      "slug": "ozzy-ai-portfolio",
      "title": "Ozzy AI Portfolio Assistant",
      "description": "Interactive AI assistant for personal portfolio with episodic memory",
      "longDescription": "Full-stack Next.js 15 application featuring an AI assistant powered by Vercel AI SDK and OpenAI GPT-4o-mini. Implements episodic memory using Upstash Vector for semantic search across conversation history. Features include sidebar pinning, resizable width, thread persistence, proactive contact collection via Resend email, and 8-mode brightness system. Tested with 667 unit tests (Vitest) and E2E accessibility compliance (Playwright + axe-core). Deployed on Vercel with Redis-backed rate limiting.",
      "technologies": [
        "Next.js 15",
        "React 19",
        "TypeScript",
        "Vercel AI SDK",
        "OpenAI GPT-4o-mini",
        "Upstash Vector",
        "Upstash Redis",
        "Resend",
        "Tailwind CSS 4",
        "shadcn/ui",
        "Framer Motion",
        "Vitest",
        "Playwright"
      ],
      "role": "Full-Stack",
      "category": "ai-ml",
      "featured": true,
      "demoUrl": "https://omerakben.com",
      "githubUrl": "https://github.com/omerakben/portfolio",
      "status": "completed",
      "image": "/projects/ozzy-ai-portfolio.png",
      "startDate": "2025-09-01",
      "endDate": "2025-10-31"
    }
  }
}
```

### Example 2: Project Not Found Error

**Request (GET)**:

```bash
curl "http://localhost:3001/api/tools/open-project?slug=non-existent-project"
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Project not found: non-existent-project"
}
```

### Example 3: Missing Slug Error

**Request**:

```bash
curl -X POST http://localhost:3001/api/tools/open-project \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Required field 'slug' is missing"
}
```

## Project Detail Fields

### Core Fields (Always Present)

| Field          | Type     | Description                       |
| -------------- | -------- | --------------------------------- |
| `id`           | string   | Unique project identifier         |
| `slug`         | string   | URL-safe identifier               |
| `title`        | string   | Project name                      |
| `description`  | string   | Short description (1-2 sentences) |
| `technologies` | string[] | Technology stack                  |
| `role`         | enum     | Omer's role in project            |
| `category`     | enum     | Project category                  |
| `featured`     | boolean  | Featured status                   |
| `status`       | enum     | Project completion status         |

### Optional Fields

| Field             | Type   | Description                           | When Present           |
| ----------------- | ------ | ------------------------------------- | ---------------------- |
| `longDescription` | string | Extended description (3-5 paragraphs) | For featured projects  |
| `image`           | string | Project screenshot/image URL          | When available         |
| `demoUrl`         | string | Live demo link                        | If deployed/accessible |
| `githubUrl`       | string | GitHub repository link                | If open-source         |
| `startDate`       | string | Project start date (ISO 8601)         | For completed projects |
| `endDate`         | string | Project end date (ISO 8601)           | For completed projects |

## Finding Project Slugs

To discover available project slugs, use the [list_projects](list-projects.md) tool:

```bash
# Get all project slugs
curl http://localhost:3001/api/tools/list-projects
```

**Common Slugs**:

- `ozzy-ai-portfolio` - AI portfolio assistant
- `openai-cache-middleware` - OpenAI API caching
- `patient-safety-portal` - Healthcare platform
- `mobile-workout-tracker` - Fitness mobile app

## Error Handling

### Common Errors

| Status | Error               | Cause                          | Solution                       |
| ------ | ------------------- | ------------------------------ | ------------------------------ |
| 400    | Project not found   | Slug doesn't match any project | Verify slug with list_projects |
| 400    | Missing slug        | Required field not provided    | Include `slug` in request      |
| 400    | Invalid request     | Malformed JSON body            | Verify JSON syntax             |
| 429    | Rate limit exceeded | Too many requests              | Wait 60 seconds and retry      |

## Implementation Details

**File Location**: `src/app/api/tools/open-project/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `openProjectInputSchema`
- Output: `openProjectOutputSchema`, `projectDetailSchema`

**Data Source**: `src/data/projects.ts`

- `projects` array with full project details
- Helper function: `getProjectBySlug(slug)`

**Features**:

- ✅ Supports both GET (query params) and POST (JSON body)
- ✅ Zod schema validation
- ✅ Rich project metadata with optional fields
- ✅ Extended descriptions for featured projects
- ✅ Image URLs for visual content
- ✅ Server-side only (no client exposure)

## Response Size Comparison

| Field Set              | Approx Size | Use Case                         |
| ---------------------- | ----------- | -------------------------------- |
| Core fields only       | ~500 bytes  | List view, minimal info          |
| Core + optional fields | ~1.5KB      | Detail view, moderate info       |
| Full project details   | ~3KB        | Comprehensive view, all metadata |

## Related Tools

- [list_projects](list-projects.md) - List projects with filters (discover slugs)
- [get_contact](get-contact.md) - Contact Omer about a project
- [download_resume](download-resume.md) - View resume with project highlights

## Usage Patterns

### Pattern 1: Browse → Detail Workflow

```bash
# Step 1: List featured AI projects
curl -X POST http://localhost:3001/api/tools/list-projects \
  -d '{"category": "ai-ml", "featured": true}'

# Step 2: Open specific project by slug
curl -X POST http://localhost:3001/api/tools/open-project \
  -d '{"slug": "ozzy-ai-portfolio"}'
```

### Pattern 2: Direct Access

```bash
# Known slug, get details immediately
curl -X POST http://localhost:3001/api/tools/open-project \
  -d '{"slug": "openai-cache-middleware"}'
```

## Changelog

- **2025-10-20**: Initial implementation with core project fields
- **2025-10-21**: Added optional fields (longDescription, image, dates)
- **2025-10-22**: Implemented rich metadata for featured projects
