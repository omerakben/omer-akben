---
title: "list_projects Tool"
description: "List Omer's projects with filtering by category (AI/ML, Web, Mobile, Tools), featured flag, and result limits"
date: 2025-11-02
status: stable
tags: [api, tool, projects, portfolio, filtering]
---

# list_projects Tool

Retrieve a filtered list of Omer's projects from his portfolio with category, featured, and limit filters.

## Purpose

Provides programmatic access to Omer's project catalog with flexible filtering options. Returns comprehensive project metadata including technologies, role, category, and links. Used to discover projects matching specific criteria or showcase featured work.

## Use Cases

- User asks "What projects have you worked on?"
- User requests "Show me your AI projects"
- User wants to see "featured work" or "best projects"
- Recruiter filters by technology stack (e.g., "React projects")
- User asks "What mobile apps have you built?"
- Browse all projects without filters

## Endpoint

```
GET  /api/tools/list-projects
POST /api/tools/list-projects
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

## Input Schema

### Parameters

```typescript
{
  category?: "all" | "ai-ml" | "web" | "mobile" | "tools" | "other",
  featured?: boolean,
  limit?: number  // 1-50, default: all projects
}
```

| Parameter  | Type    | Required | Default   | Description                                                                                  |
| ---------- | ------- | -------- | --------- | -------------------------------------------------------------------------------------------- |
| `category` | enum    | No       | `"all"`   | Filter by project category                                                                   |
| `featured` | boolean | No       | undefined | Filter by featured status (true = featured only, false = non-featured only, undefined = all) |
| `limit`    | number  | No       | undefined | Maximum number of results (1-50)                                                             |

### Validation Rules

- `category` must be one of: `"all"`, `"ai-ml"`, `"web"`, `"mobile"`, `"tools"`, `"other"`
- `limit` must be between 1 and 50 (inclusive)
- All parameters are optional
- Filters are applied cumulatively (category AND featured AND limit)

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    projects: Array<{
      id: string,
      slug: string,
      title: string,
      description: string,
      technologies: string[],
      role: "Full-Stack" | "AI" | "QA" | "QA/AI",
      category: "ai-ml" | "web" | "mobile" | "tools" | "other",
      featured: boolean,
      demoUrl?: string,
      githubUrl?: string,
      status: "completed" | "in-progress" | "planned"
    }>,
    total: number  // Total matching projects (before limit applied)
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

### Example 1: List All Projects (No Filters)

**Request (GET)**:

```bash
curl http://localhost:3000/api/tools/list-projects
```

**Response**:

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "1",
        "slug": "ozzy-ai-portfolio",
        "title": "Ozzy AI Portfolio Assistant",
        "description": "Interactive AI assistant for personal portfolio with episodic memory",
        "technologies": ["Next.js", "React", "TypeScript", "Vercel AI SDK", "Upstash Vector"],
        "role": "Full-Stack",
        "category": "ai-ml",
        "featured": true,
        "demoUrl": "https://omerakben.com",
        "githubUrl": "https://github.com/omerakben/portfolio",
        "status": "completed"
      },
      // ... more projects
    ],
    "total": 12
  }
}
```

### Example 2: Featured AI/ML Projects Only

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/list-projects \
  -H "Content-Type: application/json" \
  -d '{"category": "ai-ml", "featured": true}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "1",
        "slug": "ozzy-ai-portfolio",
        "title": "Ozzy AI Portfolio Assistant",
        "description": "Interactive AI assistant with episodic memory",
        "technologies": ["Next.js", "Vercel AI SDK", "Upstash Vector"],
        "role": "Full-Stack",
        "category": "ai-ml",
        "featured": true,
        "status": "completed"
      },
      {
        "id": "2",
        "slug": "openai-cache-middleware",
        "title": "OpenAI Cache Middleware",
        "description": "Redis-backed caching layer for OpenAI API",
        "technologies": ["TypeScript", "Redis", "OpenAI"],
        "role": "AI",
        "category": "ai-ml",
        "featured": true,
        "status": "completed"
      }
    ],
    "total": 2
  }
}
```

### Example 3: First 5 Web Projects

**Request (GET)**:

```bash
curl "http://localhost:3000/api/tools/list-projects?category=web&limit=5"
```

**Response**:

```json
{
  "success": true,
  "data": {
    "projects": [
      // ... 5 web projects
    ],
    "total": 8  // Total web projects (but only 5 returned)
  }
}
```

### Example 4: Invalid Category Error

**Request**:

```bash
curl -X POST http://localhost:3000/api/tools/list-projects \
  -H "Content-Type: application/json" \
  -d '{"category": "backend"}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid enum value. Expected 'all' | 'ai-ml' | 'web' | 'mobile' | 'tools' | 'other', received 'backend'"
}
```

### Example 5: Limit Out of Range Error

**Request**:

```bash
curl -X POST http://localhost:3000/api/tools/list-projects \
  -H "Content-Type: application/json" \
  -d '{"limit": 100}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Number must be less than or equal to 50"
}
```

## Project Categories

| Category | Description                              | Example Projects                 |
| -------- | ---------------------------------------- | -------------------------------- |
| `ai-ml`  | AI/ML projects, LLM integrations         | Ozzy AI Assistant, OpenAI Cache  |
| `web`    | Web applications, full-stack projects    | E-commerce platforms, dashboards |
| `mobile` | Mobile apps (iOS, Android, React Native) | Mobile-first web apps            |
| `tools`  | Developer tools, libraries, CLI tools    | Testing frameworks, build tools  |
| `other`  | Miscellaneous projects                   | Experiments, demos               |
| `all`    | No category filter (default)             | All projects                     |

## Project Roles

| Role         | Description                                        |
| ------------ | -------------------------------------------------- |
| `Full-Stack` | End-to-end development (frontend + backend)        |
| `AI`         | AI/ML-focused work (models, prompts, integrations) |
| `QA`         | Quality assurance, testing, automation             |
| `QA/AI`      | QA work with AI integration                        |

## Project Status

| Status        | Description           |
| ------------- | --------------------- |
| `completed`   | Finished and deployed |
| `in-progress` | Active development    |
| `planned`     | Planned for future    |

## Filter Combination Examples

```typescript
// Featured projects only (any category)
{ featured: true }

// All AI/ML projects (featured + non-featured)
{ category: "ai-ml" }

// Top 3 featured web projects
{ category: "web", featured: true, limit: 3 }

// First 10 projects (any category, any featured status)
{ limit: 10 }

// Non-featured tools projects
{ category: "tools", featured: false }
```

## Error Handling

### Common Errors

| Status | Error               | Cause                          | Solution                  |
| ------ | ------------------- | ------------------------------ | ------------------------- |
| 400    | Invalid category    | Category not in allowed values | Use valid category enum   |
| 400    | Invalid limit       | Limit < 1 or > 50              | Use limit between 1-50    |
| 400    | Invalid request     | Malformed JSON body            | Verify JSON syntax        |
| 429    | Rate limit exceeded | Too many requests              | Wait 60 seconds and retry |

## Implementation Details

**File Location**: `src/app/api/tools/list-projects/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `listProjectsInputSchema`
- Output: `listProjectsOutputSchema`, `projectSchema`

**Data Source**: `src/data/projects.ts`

- Exported `projects` array (single source of truth)
- Helper functions for filtering and sorting

**Features**:

- ✅ Supports both GET (query params) and POST (JSON body)
- ✅ Zod schema validation
- ✅ Cumulative filtering (category AND featured AND limit)
- ✅ Returns total count before limit applied
- ✅ Rich project metadata (technologies, role, links, status)
- ✅ Server-side only (no client exposure)

## Related Tools

- [open_project](open-project.md) - Get detailed project information by slug
- [get_contact](get-contact.md) - Retrieve contact information
- [download_resume](download-resume.md) - Download resume with project highlights

## Performance Notes

- **In-Memory Filtering**: Projects array filtered in memory (fast, no database)
- **Response Size**: ~2KB per project (limit recommended for large result sets)
- **Caching**: Consider browser caching for repeated queries

## Changelog

- **2025-10-20**: Initial implementation with 5 category filters
- **2025-10-21**: Added featured flag filter
- **2025-10-22**: Implemented limit parameter (1-50 range)
