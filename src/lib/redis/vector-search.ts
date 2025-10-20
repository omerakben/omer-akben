import { getRedisClient } from "@/lib/redis/client";

export interface VectorSearchResult {
  key: string;
  score: number;
  fields: Record<string, string>;
}

function encodeVectorToBuffer(vector: number[]): Uint8Array {
  const typed = new Float32Array(vector);
  return new Uint8Array(typed.buffer);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function knnSearch(
  index: string,
  vector: number[],
  limit: number,
  returnFields: string[] = []
): Promise<VectorSearchResult[]> {
  const redis = getRedisClient();
  const blob = encodeVectorToBuffer(vector);

  const response = await redis.call(
    "FT.SEARCH",
    index,
    `*=>[KNN ${limit} @embedding $BLOB]`,
    "PARAMS",
    "2",
    "BLOB",
    blob,
    "RETURN",
    String(returnFields.length),
    ...returnFields,
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

    const scoreValue = parsed["vector_score"] ? Number(parsed["vector_score"]) : NaN;
    results.push({
      key,
      score: Number.isNaN(scoreValue) ? 0 : scoreValue,
      fields: parsed,
    });
  }

  return results;
}
