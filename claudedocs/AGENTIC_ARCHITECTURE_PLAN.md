# Perfect Agentic AI Architecture - Implementation Plan

**Status**: Design Complete | Ready for Implementation
**Date**: 2025-10-19
**Objective**: Transform portfolio AI assistant into world-class multi-agent system with persistent memory

---

## Executive Summary

This document outlines the comprehensive architecture for upgrading the portfolio's AI assistant ("Ozzy AI") from a single-agent tool-calling system to a **production-grade multi-agent orchestration platform** with advanced memory capabilities.

### Key Improvements

| Current State           | Target State                                | Impact                             |
| ----------------------- | ------------------------------------------- | ---------------------------------- |
| Single agent + 10 tools | 6 specialized agents + coordinator          | Modular, maintainable architecture |
| No conversation memory  | Redis tri-layered memory (STM/LTM/Semantic) | Context retention across sessions  |
| Basic chat responses    | Multi-step workflows with planning          | Complex task automation            |
| Generic responses       | Personalized based on user history          | Enhanced UX, higher engagement     |
| localStorage only       | Redis-backed state + vector search          | Scalable, production-ready         |

### Technology Stack

- **Orchestration**: Mastra v1.0+ (TypeScript-native multi-agent framework)
- **Memory**: Redis Stack (Vector Search + JSON + Hashes)
- **Foundation**: Vercel AI SDK v5 (streaming, tool calling)
- **Memory Libraries**: RedisVL (vectors), LangGraph checkpointer (STM)
- **Embeddings**: OpenAI text-embedding-3-small
- **Existing**: Upstash Redis (already configured)

### Critical Context: Broken Persistence Issue

**Current Bug** (identified by Gemini Code Assist):
The chat sidebar loads messages from localStorage but **never passes them to `useChat`**, causing history to be lost on page reload.

```typescript
// src/components/chat/chat-sidebar.tsx (BROKEN)
useEffect(() => {
  const savedMessages = loadThread(threadId); // ✅ Loads from localStorage
  // ❌ PROBLEM: Messages NEVER passed to useChat hook!
}, []);

const { messages } = useChat({
  // ❌ No initialMessages parameter in AI SDK v5
  // Chat always starts empty!
});
```

**Impact**: Users lose conversation history, multi-turn context breaks, poor UX.

**Solution**: Phase 0 (Immediate Fix) implements server-side persistence with Redis before building the advanced agentic system.

---

## Database Choice: Redis vs Postgres

While the Copilot-generated persistence doc recommended Vercel Postgres, **Redis is the superior choice** for this AI-first use case:

| Criterion | Redis Stack | Vercel Postgres | Winner |
|-----------|------------|-----------------|--------|
| **Latency** | <1ms (in-memory) | 2-5ms (network + disk) | ✅ Redis |
| **AI Features** | Vector Search, JSON, Hashes | Basic JSONB | ✅ Redis |
| **Single Database** | Persistence + vectors + cache + JSON | Needs separate vector DB | ✅ Redis |
| **Already Configured** | ✅ Upstash in env | ❌ Need new service | ✅ Redis |
| **Cost at Scale** | Free tier includes VSS | Charges per query | ✅ Redis |
| **AI Ecosystem** | RedisVL, LangGraph checkpointer | Limited support | ✅ Redis |
| **Use Case Fit** | Built for LLM apps | Built for relational data | ✅ Redis |

**Verdict**: Redis wins decisively. Postgres advantages (complex JOINs, transactions) aren't needed for AI chat persistence.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│              (Chat Sidebar, Global Chat Button)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COORDINATOR AGENT                             │
│  • Intent classification                                         │
│  • Route to specialist agents                                    │
│  • Consensus & review loops                                      │
│  • Multi-step planning                                           │
└───┬──────────┬──────────┬──────────┬──────────┬─────────────────┘
    │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Resume │ │Project │ │Contact │ │  Nav   │ │  Perf  │
│ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │          │
    └──────────┴──────────┴──────────┴──────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MEMORY LAYER                               │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ SHORT-TERM (STM)│  │ LONG-TERM (LTM) │  │  SEMANTIC MEM   │ │
│  │                 │  │                 │  │                 │ │
│  │ • Checkpointer  │  │ • Episodic      │  │ • Facts (JSON)  │ │
│  │ • Thread state  │  │ • Vectorized    │  │ • Projects DB   │ │
│  │ • TTL: 2 hours  │  │ • Vector search │  │ • User prefs    │ │
│  │                 │  │ • TTL: 90 days  │  │ • Indefinite    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│                    Redis Stack (Upstash)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Memory Architecture

### 1. Short-Term Memory (STM)

**Purpose**: Maintain conversation context within a single session

**Implementation**: LangGraph Redis Checkpointer

**Key Pattern**:

```typescript
import { RedisSaver } from "@langchain/langgraph-checkpoint-redis";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const checkpointer = new RedisSaver(redis);

// Auto-saves conversation state after each turn
const agent = new Agent({
  checkpointer,
  threadId: conversationId,
});
```

**Redis Keys**: `checkpoint:{threadId}:{messageId}`
**TTL**: 2 hours (auto-cleanup)
**Data**: Full conversation state, tool calls, intermediate steps

### 2. Long-Term Episodic Memory

**Purpose**: Remember past conversations for contextual retrieval

**Implementation**: Semantic chunking → Vectorization → Redis Vector Search

**Pipeline**:

```typescript
// 1. Extract conversation after completion
async function saveEpisodicMemory(threadId: string, messages: Message[]) {
  const conversation = messages.map(m => m.content).join("\n");

  // 2. Semantic chunking (512 token chunks with 50 token overlap)
  const chunks = await semanticChunker.chunk(conversation);

  // 3. Generate embeddings
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks,
  });

  // 4. Store in Redis with metadata
  for (let i = 0; i < chunks.length; i++) {
    await redis.hset(`memory:episodic:${threadId}:${i}`, {
      content: chunks[i],
      embedding: embeddings.data[i].embedding,
      timestamp: Date.now(),
      threadId,
    });

    // 5. Index for vector search
    await redis.call("FT.ADD", "episodic_idx",
      `memory:episodic:${threadId}:${i}`, 1.0,
      "FIELDS", "embedding", embeddings.data[i].embedding
    );
  }

  // 6. Set TTL: 90 days
  await redis.expire(`memory:episodic:${threadId}:*`, 90 * 24 * 60 * 60);
}
```

**Retrieval Pattern**:

```typescript
// Vector similarity search for relevant memories
async function retrieveRelevantMemories(query: string, limit = 5) {
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const results = await redis.call("FT.SEARCH", "episodic_idx",
    `@embedding:[VECTOR_RANGE ${queryEmbedding.data[0].embedding}]`,
    "LIMIT", 0, limit,
    "SORTBY", "distance"
  );

  return results; // Top 5 most relevant past conversations
}
```

### 3. Semantic Memory

**Purpose**: Store structured facts, user preferences, domain knowledge

**Implementation**: RedisJSON for nested documents

**Schema**:

```typescript
interface SemanticMemory {
  userId: string;
  facts: {
    preferences: {
      role: "recruiter" | "developer" | "unknown";
      interests: string[]; // ["React", "TypeScript", "AI"]
      visitedProjects: string[]; // ["slug-1", "slug-2"]
    };
    extractedInfo: {
      jobSearch: boolean;
      experienceLevel: string;
      location: string;
    };
  };
  knowledgeBase: {
    projects: Project[]; // Cached from data/projects.ts
    skills: Skill[];     // Cached from data/facts.ts
  };
  metadata: {
    firstVisit: number;
    lastVisit: number;
    conversationCount: number;
  };
}
```

**Storage Pattern**:

```typescript
// Store structured facts
await redis.call("JSON.SET", `memory:semantic:${userId}`, "$", {
  userId,
  facts: {
    preferences: {
      role: "recruiter",
      interests: ["React", "Next.js"],
      visitedProjects: [],
    },
  },
  metadata: {
    firstVisit: Date.now(),
    lastVisit: Date.now(),
    conversationCount: 1,
  },
});

// Update nested fields
await redis.call("JSON.ARRAPPEND",
  `memory:semantic:${userId}`,
  "$.facts.preferences.interests",
  "TypeScript"
);
```

**Extraction Agent** (runs after each conversation):

```typescript
async function extractSemanticFacts(messages: Message[]) {
  const extractionPrompt = `
    Analyze this conversation and extract:
    1. User role (recruiter/developer/unknown)
    2. Technical interests (list)
    3. Job search indicators (boolean)
    4. Experience level

    Return JSON only.
  `;

  const facts = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: extractionPrompt },
      ...messages,
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(facts.choices[0].message.content);
}
```

---

## Agent Specialization

### 1. Coordinator Agent

**Responsibility**: Route requests, orchestrate multi-agent workflows, consensus loops

**Tools**: None (delegates to specialists)

**Pattern**:

```typescript
import { Agent } from "@mastra/core";

const coordinatorAgent = new Agent({
  name: "coordinator",
  model: "gpt-4o-mini", // Fast, cheap routing

  async execute({ query, context }) {
    // 1. Intent classification
    const intent = await classifyIntent(query);

    // 2. Delegate to specialist
    switch (intent) {
      case "resume":
        return await resumeAgent.execute({ query, context });
      case "projects":
        return await projectAgent.execute({ query, context });
      case "multi-step":
        // Orchestrate multiple agents
        const resume = await resumeAgent.execute({ query });
        const projects = await projectAgent.execute({
          query: `Find projects matching resume focus`
        });
        return synthesizeResponse(resume, projects);
    }
  },
});
```

### 2. Resume Agent

**Responsibility**: Resume downloads, career questions, experience queries

**Tools**: `download_resume` (4 formats)

**Capabilities**:

- Format recommendation based on user role
- Resume tailoring suggestions
- Experience timeline queries

**Example**:

```typescript
const resumeAgent = new Agent({
  name: "resume",
  model: "gpt-4o",
  tools: [downloadResumeTool],

  async execute({ query, context }) {
    // Check semantic memory for user role
    const userRole = await redis.call("JSON.GET",
      `memory:semantic:${context.userId}`,
      "$.facts.preferences.role"
    );

    // Recommend format based on role
    if (userRole === "recruiter") {
      return "I recommend the two-page PDF format for ATS compatibility...";
    }

    return streamResponse({ /* ... */ });
  },
});
```

### 3. Project Agent

**Responsibility**: Project discovery, filtering, recommendations

**Tools**: `list_projects`, `open_project`

**Enhanced Capabilities**:

- Vector search over project descriptions
- Personalized recommendations based on user interests
- Multi-project comparisons

**Vector Search Integration**:

```typescript
// Pre-index all projects
async function indexProjects() {
  const projects = getAllProjects(); // from data/projects.ts

  for (const project of projects) {
    const description = `${project.title} ${project.description} ${project.tags.join(" ")}`;
    const embedding = await embed(description);

    await redis.hset(`project:${project.slug}`, {
      slug: project.slug,
      embedding,
      metadata: JSON.stringify(project),
    });
  }
}

// Search with natural language
async function findRelevantProjects(query: string) {
  const queryEmbedding = await embed(query);
  return await redis.call("FT.SEARCH", "project_idx",
    `@embedding:[VECTOR_RANGE ${queryEmbedding}]`,
    "LIMIT", 0, 3
  );
}
```

### 4. Contact Agent

**Responsibility**: Contact info, email actions, networking

**Tools**: `get_contact`, email actions

### 5. Navigation Agent

**Responsibility**: Site navigation, page routing

**Tools**: `navigate_page`, `provide_navigation_links`

### 6. Performance Agent

**Responsibility**: Site analytics, workflow triggers

**Tools**: `profile_performance`, `trigger_workflow`

---

## Implementation Roadmap

### Phase 0: CRITICAL FIX - Message Persistence (4-6 hours) 🔴

**Goal**: Fix broken chat persistence using Redis checkpointer **BEFORE** building agentic system

**Why This Must Come First**:
- Current chat history is **completely broken** (messages lost on reload)
- Can't build advanced memory on broken foundation
- Blocks all multi-turn agentic workflows
- 4-6 hour fix provides immediate value

**Tasks**:

1. Install LangGraph Redis Checkpointer
```bash
npm install @langchain/langgraph-checkpoint-redis
```

2. Update API route (`src/app/api/chat/route.ts`)

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { RedisSaver } from '@langchain/langgraph-checkpoint-redis';
import { Redis } from '@upstash/redis';

// Initialize Redis checkpointer
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const checkpointer = new RedisSaver(redis);

export async function POST(req: Request) {
  const { chatId, message } = await req.json();

  // Load conversation history from Redis
  const checkpoint = await checkpointer.get({
    configurable: { thread_id: chatId },
  });

  const history = checkpoint?.channel_values?.messages || [];

  // Stream response with full history
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: [...history, message],
    tools: {
      // ... existing tools (download_resume, list_projects, etc.)
    },
  });

  // Auto-save conversation to Redis after streaming completes
  result.onFinish(async ({ messages }) => {
    await checkpointer.put(
      { configurable: { thread_id: chatId } },
      { messages: messages },
      {} // metadata
    );
  });

  return result.toUIMessageStreamResponse();
}
```

3. Update client (`src/components/chat/chat-sidebar.tsx`)

```typescript
import { useChat } from 'ai/react';
import { DefaultChatTransport } from 'ai';

const { threadId } = useChatSidebar();

const { messages, sendMessage, status } = useChat({
  id: threadId, // Persistent thread ID

  // Configure transport to send only last message to server
  transport: new DefaultChatTransport({
    prepareSendMessagesRequest: ({ id, messages }) => {
      return {
        body: {
          chatId: id,
          message: messages[messages.length - 1], // Only send new message
        },
      };
    },
  }),
});

// REMOVE broken localStorage hydration code
// useEffect(() => {
//   const savedMessages = loadThread(threadId);
//   // This never worked with AI SDK v5!
// }, []);
```

4. Test persistence
```bash
# Start dev server
npm run dev

# Open chat, send messages
# Reload page - messages should persist! ✅
```

**Success Criteria**:
- [ ] Messages persist across page reloads
- [ ] Conversation history maintained in multi-turn interactions
- [ ] No localStorage sync issues
- [ ] Redis contains chat history (check with Redis CLI)

**Effort**: 4-6 hours (critical bug fix)

**Evolution Path**: This checkpointer becomes the **STM (Short-Term Memory) layer** in Phase 1, extended with LTM episodic and semantic layers.

---

### Phase 1: Foundation (Week 1)

**Goal**: Extend Phase 0 checkpointer with vector search + semantic memory infrastructure

**Tasks**:

1. Install dependencies

```bash
npm install @mastra/core @mastra/memory @upstash/redis
npm install @langchain/langgraph-checkpoint-redis
npm install openai  # embeddings
```

2. Configure Redis indexes

```typescript
// scripts/setup-redis-indexes.ts
await redis.call("FT.CREATE", "episodic_idx",
  "ON", "HASH",
  "PREFIX", "1", "memory:episodic:",
  "SCHEMA",
  "embedding", "VECTOR", "FLAT", "6",
    "TYPE", "FLOAT32",
    "DIM", "1536",
    "DISTANCE_METRIC", "COSINE"
);

await redis.call("FT.CREATE", "project_idx",
  "ON", "HASH",
  "PREFIX", "1", "project:",
  "SCHEMA",
  "embedding", "VECTOR", "FLAT", "6",
    "TYPE", "FLOAT32",
    "DIM", "1536",
    "DISTANCE_METRIC", "COSINE"
);
```

3. Create memory utilities

```typescript
// src/lib/memory/redis-memory.ts
export class RedisMemoryManager {
  private redis: Redis;

  async saveSTM(threadId: string, state: any) { /* checkpointer */ }
  async saveLTM(threadId: string, messages: Message[]) { /* episodic */ }
  async saveSemantic(userId: string, facts: any) { /* JSON */ }
  async retrieveRelevant(query: string) { /* vector search */ }
}
```

**Tests**: Memory save/retrieve, vector search accuracy

### Phase 2: Agent Migration (Week 2)

**Goal**: Refactor existing tools into Mastra agents

**Tasks**:

1. Create base agent structure

```typescript
// src/lib/agents/base-agent.ts
export abstract class BasePortfolioAgent extends Agent {
  protected memory: RedisMemoryManager;

  constructor(config: AgentConfig) {
    super(config);
    this.memory = new RedisMemoryManager();
  }

  abstract execute(context: AgentContext): Promise<AgentResponse>;
}
```

2. Implement ResumeAgent

```typescript
// src/lib/agents/resume-agent.ts
export class ResumeAgent extends BasePortfolioAgent {
  name = "resume";
  tools = [downloadResumeTool];

  async execute({ query, userId }) {
    const userPrefs = await this.memory.getSemantic(userId);
    // ... implementation
  }
}
```

3. Repeat for all 6 agents

**Tests**: Each agent unit tested independently

### Phase 3: Coordinator Setup (Week 3)

**Goal**: Implement routing and orchestration

**Tasks**:

1. Intent classification

```typescript
// src/lib/agents/coordinator/intent-classifier.ts
const INTENT_PATTERNS = {
  resume: /resume|cv|download|experience/i,
  projects: /project|portfolio|work|build/i,
  contact: /email|contact|reach|hire/i,
  multi: /help.*interview|prepare|overview/i,
};

async function classifyIntent(query: string): Promise<Intent> {
  // Fast regex classification for common patterns
  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.test(query)) return intent;
  }

  // Fallback: LLM classification for ambiguous queries
  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: "Classify user intent: resume|projects|contact|navigation|performance|general"
    }, {
      role: "user",
      content: query
    }],
  });

  return result.choices[0].message.content as Intent;
}
```

2. Orchestration logic

```typescript
// src/lib/agents/coordinator/coordinator-agent.ts
export class CoordinatorAgent extends BasePortfolioAgent {
  async execute({ query, userId, threadId }) {
    const intent = await this.classifyIntent(query);

    // Retrieve relevant memories
    const memories = await this.memory.retrieveRelevant(query);

    // Enhanced context
    const context = {
      query,
      userId,
      threadId,
      memories,
      semanticFacts: await this.memory.getSemantic(userId),
    };

    // Route to specialist
    const agent = this.getSpecialistAgent(intent);
    const response = await agent.execute(context);

    // Save to episodic memory
    await this.memory.saveLTM(threadId, [
      { role: "user", content: query },
      { role: "assistant", content: response },
    ]);

    return response;
  }
}
```

**Tests**: Routing accuracy, multi-agent workflows

### Phase 4: Memory Extraction Pipeline (Week 4)

**Goal**: Automatic fact extraction and storage

**Tasks**:

1. Post-conversation extraction

```typescript
// src/lib/memory/fact-extractor.ts
export async function extractFactsFromConversation(
  messages: Message[],
  userId: string
) {
  const facts = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Extract user facts as JSON:
          {
            "role": "recruiter" | "developer" | "unknown",
            "interests": string[],
            "jobSearch": boolean,
            "experienceLevel": "junior" | "mid" | "senior" | "unknown",
            "visitedProjects": string[]
          }`
      },
      ...messages,
    ],
    response_format: { type: "json_object" },
  });

  const extracted = JSON.parse(facts.choices[0].message.content);

  // Merge with existing semantic memory
  await redis.call("JSON.MERGE",
    `memory:semantic:${userId}`,
    "$.facts",
    JSON.stringify(extracted)
  );
}
```

2. Trigger after conversation end

```typescript
// src/app/api/chat/route.ts
export async function POST(req: Request) {
  // ... existing chat logic

  onFinish: async ({ messages, usage }) => {
    // Extract and save facts
    await extractFactsFromConversation(messages, userId);

    // Save episodic memory
    await memoryManager.saveLTM(threadId, messages);
  }
}
```

**Tests**: Extraction accuracy, semantic merge logic

### Phase 5: Vector Search & Retrieval (Week 5)

**Goal**: Enable context-aware responses using memory

**Tasks**:

1. Project indexing (one-time setup)

```bash
npm run index-projects  # Vectorize all projects
```

2. Query-time retrieval

```typescript
async function enhanceQueryWithMemory(query: string, userId: string) {
  // Parallel retrieval
  const [episodic, semantic, projects] = await Promise.all([
    memory.retrieveEpisodic(query, 3),      // Top 3 past conversations
    memory.getSemantic(userId),              // User facts
    memory.searchProjects(query, 5),        // Top 5 relevant projects
  ]);

  return {
    query,
    context: {
      pastConversations: episodic,
      userProfile: semantic,
      relevantProjects: projects,
    },
  };
}
```

3. Inject into agent prompts

```typescript
const systemPrompt = `
  You are Ozzy AI, a portfolio assistant for Omer Akben.

  USER CONTEXT:
  - Role: ${context.userProfile.role}
  - Interests: ${context.userProfile.interests.join(", ")}
  - Past topics: ${context.pastConversations.map(c => c.summary).join("; ")}

  RELEVANT PROJECTS:
  ${context.relevantProjects.map(p => `- ${p.title}: ${p.description}`).join("\n")}

  Use this context to provide personalized, contextual responses.
`;
```

**Tests**: Retrieval relevance, context injection accuracy

### Phase 6: Production Optimization (Week 6)

**Goal**: Performance, monitoring, cost optimization

**Tasks**:

1. LLM response caching

```typescript
// src/lib/cache/semantic-cache.ts
async function getCachedResponse(query: string) {
  const queryEmbedding = await embed(query);

  // Search for semantically similar queries
  const cached = await redis.call("FT.SEARCH", "cache_idx",
    `@embedding:[VECTOR_RANGE ${queryEmbedding} 0.95]`, // 95% similarity
    "LIMIT", 0, 1
  );

  if (cached) {
    return cached.response; // Cache hit - no LLM call needed
  }

  return null;
}

async function cacheResponse(query: string, response: string) {
  const embedding = await embed(query);

  await redis.hset(`cache:${hash(query)}`, {
    query,
    response,
    embedding,
    timestamp: Date.now(),
  });

  // TTL: 7 days
  await redis.expire(`cache:${hash(query)}`, 7 * 24 * 60 * 60);
}
```

2. Cost tracking

```typescript
// src/lib/monitoring/cost-tracker.ts
interface CostMetrics {
  llmCalls: number;
  cacheHits: number;
  cacheMisses: number;
  totalTokens: number;
  estimatedCost: number;
}

async function trackCost(usage: Usage) {
  await redis.hincrby("metrics:costs", "llmCalls", 1);
  await redis.hincrby("metrics:costs", "totalTokens", usage.totalTokens);

  const cost = calculateCost(usage); // $0.002 per 1K tokens avg
  await redis.hincrbyfloat("metrics:costs", "estimatedCost", cost);
}
```

3. Performance benchmarks

```typescript
// tests/benchmarks/memory-performance.test.ts
describe("Memory Performance", () => {
  it("retrieves episodic memories in <50ms", async () => {
    const start = Date.now();
    await memory.retrieveEpisodic("test query", 5);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50);
  });

  it("agent routing completes in <100ms", async () => {
    const start = Date.now();
    await coordinator.classifyIntent("test query");
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

**Tests**: Performance benchmarks, cost tracking accuracy

---

## Evolution: Phase 0 → Full Agentic System

### How the Immediate Fix Becomes the Foundation

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 0 (4-6 hours) - IMMEDIATE FIX                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────┐            │
│  │ Redis Checkpointer                           │            │
│  │ • Stores conversation messages               │            │
│  │ • TTL: 2 hours                               │            │
│  │ • Key pattern: checkpoint:{threadId}         │            │
│  └──────────────────────────────────────────────┘            │
│                                                               │
│  ✅ Chat history persists across reloads                      │
│  ✅ Multi-turn conversations work                             │
│  ✅ Foundation ready for enhancement                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 1 (Week 1) - EXTEND INFRASTRUCTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Checkpointer │  │ Vector Index │  │  RedisJSON   │       │
│  │ (from P0)    │  │ (NEW)        │  │  (NEW)       │       │
│  │              │  │              │  │              │       │
│  │ STM Layer    │  │ Episodic LTM │  │ Semantic Mem │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ✅ Same checkpointer, extended capabilities                  │
│  ✅ Vector search for episodic retrieval                      │
│  ✅ Fact extraction and storage                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phases 2-6 (Weeks 2-6) - FULL AGENTIC SYSTEM                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────┐                │
│  │ Multi-Agent Orchestration (Mastra)       │                │
│  │ • Coordinator routes to specialists      │                │
│  │ • 6 specialized agents                   │                │
│  │ • Multi-step workflows                   │                │
│  └──────────────────────────────────────────┘                │
│                    │                                          │
│                    ▼                                          │
│  ┌──────────────────────────────────────────┐                │
│  │ Advanced Memory (All 3 Layers)           │                │
│  │ • STM: Checkpointer (from Phase 0)       │                │
│  │ • LTM: Vector search past conversations  │                │
│  │ • Semantic: Extracted user facts         │                │
│  └──────────────────────────────────────────┘                │
│                    │                                          │
│                    ▼                                          │
│  ┌──────────────────────────────────────────┐                │
│  │ Production Optimization                  │                │
│  │ • LLM response caching (60% hit rate)    │                │
│  │ • Cost tracking ($15/mo, 50% savings)    │                │
│  │ • Performance monitoring                 │                │
│  └──────────────────────────────────────────┘                │
│                                                               │
│  ✅ World-class agentic system complete                       │
└─────────────────────────────────────────────────────────────┘
```

### Key Insight: Progressive Enhancement

**Phase 0 is NOT throwaway code** - it becomes the STM layer:

| Component | Phase 0 | Phase 1+ |
|-----------|---------|----------|
| Redis Checkpointer | ✅ Basic message storage | ✅ STM layer (same code) |
| Vector Search | ❌ Not needed yet | ✅ LTM episodic retrieval |
| RedisJSON | ❌ Not needed yet | ✅ Semantic memory facts |
| Mastra Agents | ❌ Not needed yet | ✅ Multi-agent orchestration |
| Caching | ❌ Not needed yet | ✅ LLM response cache |

**Result**: 4-6 hour investment solves immediate problem AND becomes foundation for 6-week transformation.

---

## Code Examples

### Complete Agent Implementation

```typescript
// src/lib/agents/project-agent.ts
import { Agent, AgentContext } from "@mastra/core";
import { RedisMemoryManager } from "@/lib/memory/redis-memory";
import { listProjectsTool, openProjectTool } from "@/lib/agent-tools";

export class ProjectAgent extends Agent {
  name = "project";
  description = "Handles project discovery, filtering, and recommendations";
  model = "gpt-4o";
  tools = [listProjectsTool, openProjectTool];

  private memory: RedisMemoryManager;

  constructor() {
    super({
      name: "project",
      model: "gpt-4o",
      tools: [listProjectsTool, openProjectTool],
    });

    this.memory = new RedisMemoryManager();
  }

  async execute(context: AgentContext) {
    const { query, userId } = context;

    // 1. Retrieve user interests from semantic memory
    const userFacts = await this.memory.getSemantic(userId);
    const interests = userFacts?.facts?.preferences?.interests || [];

    // 2. Vector search for relevant projects
    const relevantProjects = await this.memory.searchProjects(
      query,
      5 // Top 5 matches
    );

    // 3. Filter by user interests if available
    const filteredProjects = interests.length > 0
      ? relevantProjects.filter(p =>
          p.tags.some(tag => interests.includes(tag))
        )
      : relevantProjects;

    // 4. Enhanced system prompt with context
    const systemPrompt = `
      You are the Project specialist for Omer Akben's portfolio.

      USER INTERESTS: ${interests.join(", ") || "unknown"}

      RELEVANT PROJECTS:
      ${filteredProjects.map(p => `
        - ${p.title}
        - Tech: ${p.tags.join(", ")}
        - ${p.description}
      `).join("\n")}

      Provide personalized project recommendations based on:
      1. User's expressed interests
      2. Query intent
      3. Project relevance scores

      Use the list_projects and open_project tools as needed.
    `;

    // 5. Execute with enhanced context
    const response = await this.run({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
    });

    // 6. Update semantic memory with visited projects
    if (response.toolCalls?.some(t => t.name === "open_project")) {
      const visitedSlugs = response.toolCalls
        .filter(t => t.name === "open_project")
        .map(t => t.args.slug);

      await this.memory.updateSemantic(userId, {
        "facts.preferences.visitedProjects": visitedSlugs,
      });
    }

    return response;
  }
}
```

### Multi-Agent Workflow Example

```typescript
// src/lib/agents/coordinator/multi-agent-workflow.ts
export class InterviewPrepWorkflow {
  async execute(userId: string, threadId: string) {
    // Multi-step workflow: "Help me prepare for an interview"

    // Step 1: Get resume highlights
    const resumeHighlights = await resumeAgent.execute({
      query: "Summarize my key achievements and technical skills",
      userId,
      threadId,
    });

    // Step 2: Find top 3 most impressive projects
    const topProjects = await projectAgent.execute({
      query: "Show my 3 most technically complex projects with real-world impact",
      userId,
      threadId,
    });

    // Step 3: Generate talking points
    const talkingPoints = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: `Create interview talking points combining:

          RESUME: ${resumeHighlights}

          TOP PROJECTS: ${topProjects}

          Format as:
          1. Technical Skills Summary
          2. Key Achievements
          3. Project Deep-Dives (STAR format)
          4. Questions to Ask Interviewer`
      }],
    });

    // Step 4: Save to episodic memory for future reference
    await memory.saveLTM(threadId, [
      { role: "user", content: "Help me prepare for an interview" },
      { role: "assistant", content: talkingPoints.choices[0].message.content },
    ]);

    return {
      resume: resumeHighlights,
      projects: topProjects,
      talkingPoints: talkingPoints.choices[0].message.content,
    };
  }
}
```

### Memory Retrieval Pipeline

```typescript
// src/lib/memory/retrieval-pipeline.ts
export class MemoryRetrievalPipeline {
  async retrieve(query: string, userId: string) {
    // Parallel retrieval for speed
    const [episodic, semantic, vectorSearch] = await Promise.all([
      this.retrieveEpisodicMemories(query, 3),
      this.getSemanticMemory(userId),
      this.vectorSearchAllSources(query, 5),
    ]);

    // Rerank by relevance
    const reranked = await this.rerank(query, [
      ...episodic,
      ...vectorSearch,
    ]);

    return {
      context: {
        pastConversations: reranked.slice(0, 3),
        userProfile: semantic,
        relevantContent: reranked.slice(3, 8),
      },
      metadata: {
        retrievalTime: performance.now(),
        sourceCounts: {
          episodic: episodic.length,
          vectorSearch: vectorSearch.length,
        },
      },
    };
  }

  private async rerank(query: string, candidates: any[]) {
    // Simple cosine similarity reranking
    const queryEmbedding = await embed(query);

    const scored = candidates.map(c => ({
      ...c,
      score: cosineSimilarity(queryEmbedding, c.embedding),
    }));

    return scored.sort((a, b) => b.score - a.score);
  }
}
```

---

## Testing Strategy

### Unit Tests (Target: 250+ total)

```typescript
// tests/agents/resume-agent.test.ts
describe("ResumeAgent", () => {
  let agent: ResumeAgent;
  let mockMemory: jest.Mocked<RedisMemoryManager>;

  beforeEach(() => {
    mockMemory = createMockMemory();
    agent = new ResumeAgent(mockMemory);
  });

  it("recommends two-page format for recruiters", async () => {
    mockMemory.getSemantic.mockResolvedValue({
      facts: { preferences: { role: "recruiter" } },
    });

    const response = await agent.execute({
      query: "I need your resume",
      userId: "test-user",
    });

    expect(response).toContain("two-page PDF");
    expect(response).toContain("ATS-friendly");
  });

  it("calls download_resume tool with correct format", async () => {
    const spy = jest.spyOn(agent.tools[0], "execute");

    await agent.execute({
      query: "Download full resume",
      userId: "test-user",
    });

    expect(spy).toHaveBeenCalledWith({ format: "full" });
  });
});
```

### Integration Tests

```typescript
// tests/integration/memory-pipeline.test.ts
describe("Memory Pipeline Integration", () => {
  it("saves and retrieves episodic memories", async () => {
    const messages = [
      { role: "user", content: "Tell me about your React projects" },
      { role: "assistant", content: "I have 3 React projects..." },
    ];

    // Save
    await memory.saveLTM("thread-123", messages);

    // Retrieve
    const retrieved = await memory.retrieveEpisodic(
      "React projects",
      5
    );

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].content).toContain("React projects");
  });

  it("vector search returns relevant projects", async () => {
    await indexAllProjects(); // Setup

    const results = await memory.searchProjects(
      "AI chatbot with streaming",
      3
    );

    expect(results).toHaveLength(3);
    expect(results[0].tags).toContain("ai");
    expect(results[0].description).toContain("streaming");
  });
});
```

### E2E Tests

```typescript
// e2e/agentic-memory.spec.ts
import { test, expect } from "@playwright/test";

test("maintains context across conversation", async ({ page }) => {
  await page.goto("/");

  // Open chat
  await page.click("[data-testid='global-chat-button']");

  // First message
  await page.fill("[data-testid='chat-input']", "I'm interested in AI projects");
  await page.press("[data-testid='chat-input']", "Enter");

  await expect(page.locator(".message").last()).toContainText("AI projects");

  // Second message - references context
  await page.fill("[data-testid='chat-input']", "Tell me more about the first one");
  await page.press("[data-testid='chat-input']", "Enter");

  // Should remember "first one" refers to first AI project mentioned
  await expect(page.locator(".message").last()).toContainText(/portfolio|chatbot/i);
});
```

---

## Performance Benchmarks

### Target Metrics

| Operation                             | Target           | Current (Baseline) |
| ------------------------------------- | ---------------- | ------------------ |
| Memory retrieval (episodic)           | <50ms            | N/A (new feature)  |
| Agent routing (intent classification) | <100ms           | N/A (new feature)  |
| Vector search (top 5)                 | <30ms            | N/A (new feature)  |
| Full agent response (streaming start) | <500ms           | ~300ms (existing)  |
| Semantic fact extraction              | <2s (background) | N/A (new feature)  |
| Cache hit rate                        | >60%             | 0% (no caching)    |

### Cost Optimization

**Current Cost Structure** (estimated):

- Chat API calls: ~10K requests/month
- Average tokens: 1,500/request
- Cost: ~$30/month (GPT-4o)

**Optimized Cost Structure** (target):

- Cache hit rate: 60% → 6K cached responses
- Remaining: 4K LLM calls
- Coordinator: GPT-4o-mini (10x cheaper)
- Specialists: GPT-4o (only when needed)
- Estimated savings: ~50% ($15/month)

---

## Migration Strategy

### Zero-Downtime Deployment

1. **Feature Flag Pattern**

```typescript
// src/lib/feature-flags.ts
export const AGENTIC_SYSTEM_ENABLED =
  process.env.NEXT_PUBLIC_AGENTIC_ENABLED === "true";

// src/app/api/chat/route.ts
export async function POST(req: Request) {
  if (AGENTIC_SYSTEM_ENABLED) {
    return handleAgenticChat(req); // New system
  } else {
    return handleLegacyChat(req);  // Current system
  }
}
```

2. **Gradual Rollout**
   - Week 1-3: Deploy to staging, internal testing
   - Week 4: 10% traffic (feature flag)
   - Week 5: 50% traffic (A/B test)
   - Week 6: 100% traffic (full rollout)

3. **Rollback Plan**
   - Feature flag can instantly revert to legacy system
   - Redis data preserved (no destructive operations)
   - A/B test metrics determine rollout pace

### Data Migration

**No migration needed** - New system augments existing:

- Current localStorage thread memory → preserved
- Redis adds new capabilities (doesn't replace)
- Existing tools → wrapped in agents (same functionality)

---

## Monitoring & Observability

### Key Metrics

```typescript
// src/lib/monitoring/metrics.ts
export interface AgenticMetrics {
  // Performance
  agentRoutingTime: number;
  memoryRetrievalTime: number;
  vectorSearchTime: number;
  totalResponseTime: number;

  // Usage
  totalAgentCalls: number;
  agentDistribution: Record<string, number>; // Which agents called most
  cacheHitRate: number;

  // Cost
  llmCalls: number;
  totalTokens: number;
  estimatedCost: number;

  // Quality
  userSatisfaction: number; // Thumbs up/down
  multiStepWorkflows: number;
  contextRetentionRate: number; // % of queries using memory
}
```

### Dashboard (Vercel Analytics Integration)

```typescript
// Track custom events
import { track } from "@vercel/analytics";

track("agent_call", {
  agent: "project",
  intent: "discovery",
  memoryUsed: true,
  responseTime: 450,
});

track("cache_hit", {
  query: "tell me about React projects",
  savingsUSD: 0.002,
});
```

---

## Security & Privacy

### Data Protection

1. **Memory Isolation**

```typescript
// All Redis keys namespaced by user
const USER_NAMESPACE = `user:${hashUserId(userId)}`;

await redis.set(`${USER_NAMESPACE}:memory:episodic:*`, data);
// No cross-user data leakage possible
```

2. **PII Redaction**

```typescript
async function redactPII(content: string): Promise<string> {
  // Remove emails, phone numbers, addresses before storage
  return content
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[EMAIL]")
    .replace(/\d{3}-\d{3}-\d{4}/g, "[PHONE]");
}
```

3. **User Controls**

```typescript
// New API endpoint for memory management
// POST /api/memory/delete
export async function POST(req: Request) {
  const { userId, threadId } = await req.json();

  // Delete specific conversation
  if (threadId) {
    await redis.del(`memory:episodic:${threadId}:*`);
  }

  // Delete all user memories
  else {
    await redis.del(`memory:*:${userId}:*`);
  }

  return Response.json({ success: true });
}
```

### TTL Policies

| Memory Type        | TTL        | Rationale                       |
| ------------------ | ---------- | ------------------------------- |
| STM (checkpointer) | 2 hours    | Session-scoped only             |
| LTM (episodic)     | 90 days    | Balance retention & privacy     |
| Semantic (facts)   | Indefinite | User preferences persist        |
| Cache              | 7 days     | Balance performance & freshness |

---

## Success Criteria

### Quantitative Metrics

- [ ] **Performance**: p95 response time <500ms (maintained)
- [ ] **Memory**: >80% context retention in multi-turn conversations
- [ ] **Cost**: 50% reduction in LLM costs via caching
- [ ] **Tests**: 250+ tests passing (up from 175)
- [ ] **Cache Hit Rate**: >60% within 2 weeks of deployment

### Qualitative Improvements

- [ ] **Personalization**: Agents adapt responses based on user role
- [ ] **Context Retention**: Users can reference past conversations naturally
- [ ] **Multi-Step Workflows**: Support complex tasks (interview prep, project comparisons)
- [ ] **Proactive Suggestions**: Follow-ups generated from extracted user interests
- [ ] **Scalability**: System handles 10x traffic without degradation

---

## Conclusion

This architecture transforms the portfolio AI assistant from a basic tool-calling chatbot into a **world-class agentic system** with:

✅ **Multi-agent orchestration** (Mastra framework)
✅ **Persistent memory** (Redis tri-layered: STM/LTM/Semantic)
✅ **Context-aware responses** (Vector search + fact extraction)
✅ **Cost optimization** (60% cache hit rate target)
✅ **Production-ready** (Zero-downtime migration, comprehensive testing)

**Next Steps**: Begin Phase 0 implementation (CRITICAL FIX - 4-6 hours) to restore message persistence, then proceed with Phase 1 (Foundation setup)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-19
**Status**: ✅ Ready for Implementation
