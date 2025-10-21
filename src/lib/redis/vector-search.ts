import { getRedisClient } from "@/lib/redis/client";
import { getVectorClient } from "@/lib/redis/vector-client";

export interface VectorSearchResult {
  key: string;
  score: number;
  fields: Record<string, string>;
}

/**
 * Encode embedding vector to buffer for Redis FT.SEARCH
 */
function encodeVectorToBuffer(vector: number[]): Uint8Array {
  const typed = new Float32Array(vector);
  return new Uint8Array(typed.buffer);
}

/**
 * Type guard for Record objects
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Perform KNN search using Redis FT.SEARCH (for project embeddings)
 */
async function knnSearchRedis(
  index: string,
  vector: number[],
  limit: number,
  returnFields: string[]
): Promise<VectorSearchResult[]> {
  const redis = getRedisClient();
  const blob = encodeVectorToBuffer(vector);
  const scoreAlias = "vector_score";
  const uniqueReturnFields = Array.from(new Set([...returnFields, scoreAlias]));

  const response = await redis.call(
    "FT.SEARCH",
    index,
    `*=>[KNN ${limit} @embedding $BLOB AS ${scoreAlias}]`,
    "PARAMS",
    "2",
    "BLOB",
    blob,
    "RETURN",
    String(uniqueReturnFields.length),
    ...uniqueReturnFields,
    "DIALECT",
    "2"
  );

  if (!Array.isArray(response)) {
    return [];
  }

  const [, ...matches] = response as unknown[];
  const results: VectorSearchResult[] = [];

  for (let i = 0; i < matches.length; i += 2) {
    const key = matches[i];
    const fields = matches[i + 1];
    if (typeof key !== "string" || !Array.isArray(fields)) {
      continue;
    }

    const parsed: Record<string, string> = {};
    for (let j = 0; j < fields.length; j += 2) {
      const fieldKey = fields[j];
      const fieldValue = fields[j + 1];
      if (typeof fieldKey === "string") {
        if (typeof fieldValue === "string") {
          parsed[fieldKey] = fieldValue;
        } else if (isRecord(fieldValue)) {
          parsed[fieldKey] = JSON.stringify(fieldValue);
        }
      }
    }

    const scoreValue = parsed["vector_score"]
      ? Number(parsed["vector_score"])
      : NaN;
    results.push({
      key,
      score: Number.isNaN(scoreValue) ? 0 : scoreValue,
      fields: parsed,
    });
  }

  return results;
}

/**
 * Perform KNN search using Upstash Vector (for episodic memory)
 */
async function knnSearchVector(
  vector: number[],
  limit: number,
  returnFields: string[]
): Promise<VectorSearchResult[]> {
  const vectorClient = getVectorClient();

  // Query Upstash Vector with the embedding
  const response = await vectorClient.query({
    vector,
    topK: limit,
    includeMetadata: true,
    includeVectors: false,
  });

  // Map Upstash Vector response to existing VectorSearchResult format
  const results: VectorSearchResult[] = response.map((item) => {
    // Extract metadata fields
    const fields: Record<string, string> = {};

    if (item.metadata) {
      for (const [key, value] of Object.entries(item.metadata)) {
        // Only include requested fields (or all if none specified)
        if (returnFields.length === 0 || returnFields.includes(key)) {
          fields[key] = typeof value === "string" ? value : String(value);
        }
      }
    }

    // Add vector_score to fields for backwards compatibility
    fields["vector_score"] = String(item.score);

    return {
      key: String(item.id),
      score: item.score,
      fields,
    };
  });

  return results;
}

/**
 * Perform KNN (k-nearest neighbors) vector search with dual-path routing
 *
 * Routes to Redis FT.SEARCH for project embeddings (project_embeddings_idx)
 * and Upstash Vector for episodic memory (empty or undefined index)
 *
 * @param index - Index name ("project_embeddings_idx" for Redis, empty/undefined for Vector)
 * @param vector - Query embedding vector
 * @param limit - Maximum number of results to return
 * @param returnFields - Fields to include in results (metadata keys)
 * @returns Array of search results with scores and metadata
 */
export async function knnSearch(
  index: string | undefined,
  vector: number[],
  limit: number,
  returnFields: string[] = []
): Promise<VectorSearchResult[]> {
  // Route to Redis FT.SEARCH for project embeddings
  if (index === "project_embeddings_idx") {
    return knnSearchRedis(index, vector, limit, returnFields);
  }

  // Route to Upstash Vector for episodic memory (empty or undefined index)
  return knnSearchVector(vector, limit, returnFields);
}
