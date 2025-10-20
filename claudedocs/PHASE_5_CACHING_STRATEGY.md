# Phase 5: Caching Strategy Design

## Overview

Implement Redis-backed caching layer for OpenAI API calls to reduce costs, improve latency, and enable offline development. Target: **70%+ cache hit rate** for embeddings, **50%+ for completions**, **<50ms cache lookup**.

---

## Caching Opportunities

### 1. Embedding Generation (episodic.ts:83-86, 119-122)

**Current Implementation:**
```typescript
// saveConversation: Batch embedding generation
const embeddings = await openai.embeddings.create({
  model: EMBEDDING_MODEL,  // text-embedding-3-small
  input: chunks,           // Array of text chunks
});

// search: Single query embedding
const embedding = await openai.embeddings.create({
  model: EMBEDDING_MODEL,
  input: [query],
});
```

**Cache Characteristics:**
- **Deterministic**: Same input → same output (100% reproducible)
- **Frequency**: Every conversation save (saveLTM) + every search query
- **Input Size**: 4KB average per chunk
- **Cost**: $0.02 / 1M tokens (~$0.00008 per request)
- **Cache Hit Potential**: **80-90%** (repeated queries, similar conversations)

**Cache Strategy:**
- Key: `cache:embed:v1:{sha256(model+input)}`
- TTL: **30 days** (deterministic, safe to cache long-term)
- Storage: JSON `{embedding: number[], created_at: string}`

### 2. Fact Extraction (fact-extractor.ts:161-166)

**Current Implementation:**
```typescript
const result = await generateText({
  model: openai("gpt-4o-mini"),
  system: FACT_EXTRACTION_SYSTEM_PROMPT,  // 500 tokens
  prompt: `Analyze this conversation...`,  // 2000 tokens avg
  temperature: 0.3,  // Low temp for consistency
});
```

**Cache Characteristics:**
- **Semi-deterministic**: Temperature 0.3 → mostly consistent output
- **Frequency**: Every conversation end (chat API onFinish)
- **Input Size**: 2.5KB system prompt + 10KB conversation context
- **Cost**: $0.15 / 1M input tokens, $0.60 / 1M output tokens
- **Cache Hit Potential**: **50-60%** (similar conversations, same prompts)

**Cache Strategy:**
- Key: `cache:completion:v1:{sha256(model+system+prompt+temp)}`
- TTL: **7 days** (balance freshness vs cost savings)
- Storage: JSON `{text: string, usage: {}, created_at: string}`
- **Skip caching if**: Conversation has PII indicators, userId changes

### 3. Follow-up Suggestions (optional, if LLM-based)

**Analysis Needed**: Check if `suggest-followups` uses LLM or heuristic. If LLM:
- Apply same completion caching strategy
- TTL: 3 days (content changes more frequently)

---

## Implementation Plan

### Phase 5.1: Cache Utility Module ✅ (Design Complete)

**File**: `src/lib/cache/openai-cache.ts`

**API Design:**
```typescript
// Embedding cache
export async function getCachedEmbedding(
  input: string,
  model: string = "text-embedding-3-small"
): Promise<number[] | null>

export async function setCachedEmbedding(
  input: string,
  embedding: number[],
  model: string = "text-embedding-3-small"
): Promise<void>

// Completion cache
export async function getCachedCompletion(
  model: string,
  system: string,
  prompt: string,
  temperature: number
): Promise<string | null>

export async function setCachedCompletion(
  model: string,
  system: string,
  prompt: string,
  temperature: number,
  text: string
): Promise<void>

// Metrics
export async function recordCacheHit(type: "embedding" | "completion"): Promise<void>
export async function recordCacheMiss(type: "embedding" | "completion"): Promise<void>
export async function getCacheMetrics(type: "embedding" | "completion"): Promise<CacheMetrics>

interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalCalls: number;
  avgLookupTime: number;
}
```

**Key Generation:**
```typescript
function generateCacheKey(type: string, version: string, ...inputs: string[]): string {
  const content = inputs.join("::");
  const hash = createHash("sha256").update(content).digest("hex");
  return `cache:${type}:${version}:${hash}`;
}
```

### Phase 5.2: Embedding Cache Integration

**Files to Modify:**
- `src/lib/mastra/memory/episodic.ts:83-86` (saveConversation)
- `src/lib/mastra/memory/episodic.ts:119-122` (search)

**Implementation Pattern:**
```typescript
async function getEmbeddingWithCache(input: string): Promise<number[]> {
  // 1. Check cache
  const cached = await getCachedEmbedding(input, EMBEDDING_MODEL);
  if (cached) {
    await recordCacheHit("embedding");
    return cached;
  }

  // 2. Generate if miss
  await recordCacheMiss("embedding");
  const openai = getOpenAIClient();
  const result = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: [input],
  });

  // 3. Store in cache
  const embedding = result.data[0].embedding;
  await setCachedEmbedding(input, embedding, EMBEDDING_MODEL);
  return embedding;
}
```

**Batch Optimization:**
- Check cache for all chunks first
- Only call OpenAI for misses
- Parallel cache lookups with Promise.all

### Phase 5.3: Completion Cache Integration

**Files to Modify:**
- `src/lib/memory/fact-extractor.ts:161-166`

**Implementation Pattern:**
```typescript
export async function extractFacts(messages: UIMessage[]): Promise<ExtractedFacts | null> {
  if (messages.length < 2) {
    return null;
  }

  const context = buildAnalysisContext(messages, 10);
  const prompt = `Analyze this conversation and extract user facts:\n\n${context}\n\nExtract facts as JSON:`;

  // 1. Check cache
  const cached = await getCachedCompletion(
    "gpt-4o-mini",
    FACT_EXTRACTION_SYSTEM_PROMPT,
    prompt,
    0.3
  );

  if (cached) {
    await recordCacheHit("completion");
    return parseAndValidate(cached);
  }

  // 2. Generate if miss
  await recordCacheMiss("completion");
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: FACT_EXTRACTION_SYSTEM_PROMPT,
    prompt,
    temperature: 0.3,
  });

  // 3. Store in cache
  await setCachedCompletion(
    "gpt-4o-mini",
    FACT_EXTRACTION_SYSTEM_PROMPT,
    prompt,
    0.3,
    result.text
  );

  return parseAndValidate(result.text);
}
```

### Phase 5.4: Metrics and Monitoring

**Metrics Storage:**
- Key: `cache:metrics:{type}:{YYYY-MM-DD}`
- Data: Hash with `hits`, `misses`, `lookup_times` (array)
- TTL: 90 days

**Metrics API:**
```typescript
// GET /api/cache-metrics?type=embedding&days=7
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as "embedding" | "completion";
  const days = parseInt(searchParams.get("days") || "7", 10);

  const metrics = await getCacheMetrics(type, days);
  return Response.json(metrics);
}
```

**Dashboard Logging:**
```typescript
// Log metrics every 100 requests
if (totalCalls % 100 === 0) {
  console.log(`[Cache:${type}] Hit rate: ${hitRate.toFixed(1)}%, Avg lookup: ${avgTime}ms`);
}
```

### Phase 5.5: Testing

**Unit Tests** (`src/lib/cache/openai-cache.test.ts`):
- Cache key generation (deterministic hashing)
- Embedding cache hit/miss
- Completion cache hit/miss
- Metrics tracking (increment counters)
- TTL enforcement (mock Redis expire)

**Integration Tests** (`src/lib/mastra/memory/episodic.test.ts`):
- Verify embeddings cached after first call
- Verify batch caching (multiple chunks)
- Verify search query caching

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Embedding cache hit rate | 70%+ | cache:metrics:embedding:hits / total_calls |
| Completion cache hit rate | 50%+ | cache:metrics:completion:hits / total_calls |
| Cache lookup latency | <50ms | Avg of lookup_times array |
| Cost reduction | 60%+ | (hits / total_calls) * avg_cost_per_request |

---

## Cost Savings Estimation

**Assumptions:**
- 1000 conversations/day
- 5 episodic searches/day per user (100 users)
- 1000 fact extractions/day

**Embedding Costs** (text-embedding-3-small):
- Without cache: 1500 requests/day * $0.00008 = **$0.12/day** ($43.80/year)
- With 80% hit rate: 300 requests/day * $0.00008 = **$0.024/day** ($8.76/year)
- **Savings: $35/year (80%)**

**Completion Costs** (gpt-4o-mini):
- Without cache: 1000 requests/day * $0.001 = **$1/day** ($365/year)
- With 50% hit rate: 500 requests/day * $0.001 = **$0.50/day** ($182.50/year)
- **Savings: $182.50/year (50%)**

**Total Annual Savings: ~$217.50** (67% reduction)

---

## Risks and Mitigation

### Risk 1: Stale Cache (Low Probability)

**Scenario**: System prompt changes, cached completions outdated
**Mitigation**:
- Include version in cache key (`cache:completion:v1:...`)
- Increment version when prompts change
- Clear old cache with `SCAN + DEL` script

### Risk 2: Memory Pressure (Low Impact)

**Scenario**: Cache grows too large (>10GB)
**Mitigation**:
- Aggressive TTLs (30 days for embeddings, 7 for completions)
- Monitor Redis memory with `INFO memory`
- Implement LRU eviction policy in Redis config

### Risk 3: Cache Poisoning (Very Low)

**Scenario**: Malicious input → cached bad embedding
**Mitigation**:
- Validate input before caching (max length, no control chars)
- Skip caching for suspicious patterns
- Monitor cache hit rate anomalies

---

## Success Criteria

✅ **Phase 5 Complete When:**
1. Embedding cache implemented with 70%+ hit rate
2. Completion cache implemented with 50%+ hit rate
3. Cache lookup <50ms (p95)
4. Metrics dashboard functional (GET /api/cache-metrics)
5. 15+ unit tests passing
6. Cost reduction verified via metrics

---

## Next Steps

After Phase 5.1 design approval:
1. **Phase 5.2**: Implement `openai-cache.ts` utility module
2. **Phase 5.3**: Integrate embedding cache into episodic.ts
3. **Phase 5.4**: Integrate completion cache into fact-extractor.ts
4. **Phase 5.5**: Add metrics API and logging
5. **Phase 5.6**: Write comprehensive unit tests
6. **Phase 5.7**: Run integration tests and verify targets
