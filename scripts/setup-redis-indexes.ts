import { getRedisClient } from "@/lib/redis/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const EPISODIC_INDEX = "episodic_idx";
const EPISODIC_PREFIX = "memory:episodic:";
const PROJECT_INDEX = "project_idx";
const PROJECT_PREFIX = "project:";

async function ensureIndex(
  name: string,
  command: string[],
  existsCommand: string[]
) {
  const redis = getRedisClient();
  if (typeof redis.call !== "function") {
    throw new Error(
      "[setup-redis-indexes] Redis client does not support raw call interface"
    );
  }

  try {
    await redis.call(existsCommand[0], ...existsCommand.slice(1));
    console.info(
      `[setup-redis-indexes] Index '${name}' already exists, skipping`
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unknown Index")) {
      console.info(`[setup-redis-indexes] Creating index '${name}'`);
      await redis.call(command[0], ...command.slice(1));
      console.info(`[setup-redis-indexes] Index '${name}' created`);
    } else {
      console.error(
        `[setup-redis-indexes] Failed to verify index '${name}'`,
        error
      );
      throw error;
    }
  }
}

async function main() {
  await ensureIndex(
    EPISODIC_INDEX,
    [
      "FT.CREATE",
      EPISODIC_INDEX,
      "ON",
      "HASH",
      "PREFIX",
      "1",
      EPISODIC_PREFIX,
      "SCHEMA",
      "threadId",
      "TAG",
      "chunkId",
      "TAG",
      "content",
      "TEXT",
      "embedding",
      "VECTOR",
      "FLAT",
      "6",
      "TYPE",
      "FLOAT32",
      "DIM",
      "1536",
      "DISTANCE_METRIC",
      "COSINE",
    ],
    ["FT.INFO", EPISODIC_INDEX]
  );

  await ensureIndex(
    PROJECT_INDEX,
    [
      "FT.CREATE",
      PROJECT_INDEX,
      "ON",
      "HASH",
      "PREFIX",
      "1",
      PROJECT_PREFIX,
      "SCHEMA",
      "slug",
      "TAG",
      "title",
      "TEXT",
      "description",
      "TEXT",
      "embedding",
      "VECTOR",
      "FLAT",
      "6",
      "TYPE",
      "FLOAT32",
      "DIM",
      "1536",
      "DISTANCE_METRIC",
      "COSINE",
    ],
    ["FT.INFO", PROJECT_INDEX]
  );

  console.info("[setup-redis-indexes] Complete");
}

main().catch((error) => {
  console.error("[setup-redis-indexes] Unhandled error", error);
  process.exit(1);
});
