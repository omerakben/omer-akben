import { getVectorClient } from "@/lib/redis/vector-client";

export interface VectorSearchResult {
  key: string;
  score: number;
  fields: Record<string, string>;
}

/**
 * Perform KNN (k-nearest neighbors) vector search using Upstash Vector
 *
 * @param index - Index name (not used with Upstash Vector, kept for API compatibility)
 * @param vector - Query embedding vector
 * @param limit - Maximum number of results to return
 * @param returnFields - Fields to include in results (metadata keys)
 * @returns Array of search results with scores and metadata
 */
export async function knnSearch(
  index: string,
  vector: number[],
  limit: number,
  returnFields: string[] = []
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
