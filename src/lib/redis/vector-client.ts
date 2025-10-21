/**
 * Upstash Vector Client
 * Centralized vector database client for episodic memory storage and semantic search
 */

import { Index } from "@upstash/vector";

let vectorClient: Index | null = null;

/**
 * Get or create singleton Upstash Vector client
 * @returns Configured Vector index instance
 * @throws Error if environment variables are missing
 */
export function getVectorClient(): Index {
  if (vectorClient) {
    return vectorClient;
  }

  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing Upstash Vector credentials. Please set UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN environment variables."
    );
  }

  vectorClient = new Index({
    url,
    token,
  });

  return vectorClient;
}

/**
 * Reset vector client (useful for testing)
 */
export function resetVectorClient(): void {
  vectorClient = null;
}
