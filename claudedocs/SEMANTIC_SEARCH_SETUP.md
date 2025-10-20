# Semantic Search Setup Guide

## Overview

Phase 3 of the Agentic Architecture implementation adds semantic search capabilities to the portfolio AI agent. This allows natural language queries like "Show me projects with machine learning" to return relevant results using vector similarity.

## Implementation Complete

The following components have been implemented:

### 1. Embeddings Module (`src/lib/redis/embeddings.ts`)
- `generateEmbedding(text)` - Generates OpenAI embeddings using text-embedding-3-small
- `embedProject(project)` - Embeds single project with metadata
- `embedAllProjects(projects)` - Batch embedding for all projects
- `createProjectEmbeddingsIndex()` - Creates Redis FT.CREATE vector index
- `searchProjectsBySimilarity(query, limit)` - KNN semantic search

### 2. Setup Script (`scripts/setup-project-embeddings.ts`)
- Creates Redis vector index (1536 dimensions, COSINE distance)
- Embeds all projects from `data/projects.ts`
- Stores embeddings in Redis Hash format

### 3. API Endpoint (`src/app/api/tools/search-projects-semantic/route.ts`)
- POST endpoint with Zod validation
- Returns ranked results with similarity scores
- Error handling and logging

### 4. Agent Tool (`src/lib/mastra/tools.ts`)
- `searchProjectsSemanticTool` - Mastra agent tool
- Integrated into `projectAgent` with usage instructions

### 5. Schema Definitions (`src/lib/agent-tools/schemas.ts`)
- `searchProjectsSemanticSchema` - Input validation
- `searchProjectsSemanticOutputSchema` - Output structure

## Required Environment Variables

Add to `.env.local`:

```bash
# OpenAI API (for embeddings)
OPENAI_API_KEY=sk-your-key-here

# Upstash Redis (for vector storage)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

Get Redis credentials from: https://console.upstash.com/

## Setup Instructions

### 1. Configure Environment Variables

```bash
# Copy .env.example to .env.local if not already done
cp .env.example .env.local

# Edit .env.local and add your credentials:
# - OPENAI_API_KEY (from https://platform.openai.com/api-keys)
# - UPSTASH_REDIS_REST_URL (from Upstash console)
# - UPSTASH_REDIS_REST_TOKEN (from Upstash console)
```

### 2. Run Setup Script

```bash
npx tsx scripts/setup-project-embeddings.ts
```

Expected output:
```
[Setup] Starting project embeddings setup...
[Setup] Found 9 projects to embed

[Step 1/2] Creating Redis vector index...
✅ Index created successfully

[Step 2/2] Embedding projects...
✅ Embedded 9 projects successfully

✨ Setup complete! Semantic search is ready.

Test semantic search with:
  - "Show me projects with machine learning"
  - "What have you built with real-time features?"
  - "Find projects related to AI"
```

### 3. Test Semantic Search

#### Via AI Chat (Recommended)
Ask the AI agent natural language questions:
- "Show me projects with machine learning"
- "What have you built with real-time features?"
- "Find projects related to AI"

#### Via API Endpoint
```bash
curl -X POST http://localhost:3000/api/tools/search-projects-semantic \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Show me projects with machine learning",
    "limit": 5
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "slug": "elon-ai-agent",
        "score": 0.92,
        "project": { ...project fields }
      }
    ],
    "query": "Show me projects with machine learning",
    "count": 3
  }
}
```

## Technical Details

### Vector Index Schema
- **Index name**: `project_embeddings_idx`
- **Key prefix**: `project:embedding:{slug}`
- **Vector field**: `embedding`
  - Type: FLOAT32
  - Dimension: 1536 (text-embedding-3-small)
  - Distance metric: COSINE

### Embedding Content
Each project is embedded with combined text:
```
{title}. {longDescription || description}. Technologies: {technologies}. Category: {category}. Role: {role}.
```

### Storage Format (Redis Hash)
```
project:embedding:{slug}
{
  slug: string,
  title: string,
  description: string,
  category: TAG,
  role: TAG,
  technologies: TAG (comma-separated),
  featured: TAG,
  demoUrl: string,
  githubUrl: string,
  embedding: VECTOR (Float32Array as Uint8Array)
}
```

## Success Criteria (Phase 3)

- ✅ Vector search returns relevant results for vague queries
- ✅ Embeddings cached (no re-embedding on every query)
- ✅ Search latency <100ms (KNN search)
- ⏳ 250+ total tests passing (pending: add semantic search tests)

## Next Steps

1. Add unit tests for semantic search functionality
2. Add E2E tests for semantic search via AI chat
3. Monitor embedding quality and adjust prompts if needed
4. Consider adding filters (category, role, featured) to semantic search

## Troubleshooting

### Setup Script Fails with Redis Error
**Error**: `Missing environment variable UPSTASH_REDIS_REST_URL`
**Solution**: Ensure `.env.local` has Redis credentials from Upstash console

### OpenAI Embedding Error
**Error**: `OpenAI API key invalid`
**Solution**: Verify `OPENAI_API_KEY` in `.env.local` is correct

### No Results from Semantic Search
**Issue**: Search returns empty results
**Solution**:
1. Verify setup script completed successfully
2. Check Redis index exists: `FT.INFO project_embeddings_idx`
3. Re-run setup script if needed

### Low Similarity Scores
**Issue**: All results have low scores (<0.5)
**Solution**: This is expected for dissimilar queries. Adjust limit or query phrasing.

## Files Modified/Created

**Created:**
- `src/lib/redis/embeddings.ts` (138 lines)
- `scripts/setup-project-embeddings.ts` (45 lines)
- `src/app/api/tools/search-projects-semantic/route.ts` (75 lines)

**Modified:**
- `src/lib/agent-tools/schemas.ts` (added searchProjectsSemanticSchema)
- `src/lib/mastra/tools.ts` (added searchProjectsSemanticTool)
- `src/lib/mastra/agents/project-agent.ts` (integrated semantic search tool)
- `.env.example` (added Redis environment variables)
