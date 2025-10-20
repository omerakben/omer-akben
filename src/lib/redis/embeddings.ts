import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { getRedisClient } from "@/lib/redis/client";
import { knnSearch, type VectorSearchResult } from "@/lib/redis/vector-search";
import type { Project } from "@/data/projects";

/**
 * Generate embedding for text using OpenAI text-embedding-3-small
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  });

  return embedding;
}

/**
 * Generate embeddings for all projects and store in Redis
 * Key format: project:embedding:{slug}
 * Uses HSET to store: slug, title, description, embedding (as Float32 blob)
 */
export async function embedProject(project: Project): Promise<void> {
  const redis = getRedisClient();

  // Combine title and longDescription for better semantic understanding
  const textToEmbed = `${project.title}. ${project.longDescription || project.description}. Technologies: ${project.technologies.join(", ")}. Category: ${project.category}. Role: ${project.role}.`;

  const embedding = await generateEmbedding(textToEmbed);

  // Convert embedding array to Float32Array buffer
  const embeddingBuffer = new Float32Array(embedding);
  const embeddingBytes = new Uint8Array(embeddingBuffer.buffer);

  // Store in Redis Hash
  const key = `project:embedding:${project.slug}`;
  await redis.hset(key, {
    slug: project.slug,
    title: project.title,
    description: project.description,
    category: project.category,
    role: project.role,
    technologies: project.technologies.join(","),
    featured: project.featured.toString(),
    demoUrl: project.demoUrl || "",
    githubUrl: project.githubUrl || "",
    embedding: embeddingBytes,
  });
}

/**
 * Embed all projects and store in Redis
 */
export async function embedAllProjects(projects: Project[]): Promise<void> {
  for (const project of projects) {
    await embedProject(project);
  }
}

/**
 * Create Redis vector index for project embeddings
 * Index name: project_embeddings_idx
 * Vector field: embedding (FLOAT32, dimension: 1536, distance: COSINE)
 */
export async function createProjectEmbeddingsIndex(): Promise<void> {
  const redis = getRedisClient();

  try {
    // Try to drop existing index first (ignore error if doesn't exist)
    try {
      await redis.call("FT.DROPINDEX", "project_embeddings_idx", "DD");
    } catch {
      // Index doesn't exist, continue
    }

    // Create new index
    await redis.call(
      "FT.CREATE",
      "project_embeddings_idx",
      "ON",
      "HASH",
      "PREFIX",
      "1",
      "project:embedding:",
      "SCHEMA",
      "slug", "TEXT",
      "title", "TEXT",
      "description", "TEXT",
      "category", "TAG",
      "role", "TAG",
      "technologies", "TAG",
      "featured", "TAG",
      "embedding", "VECTOR", "FLAT", "6", "TYPE", "FLOAT32", "DIM", "1536", "DISTANCE_METRIC", "COSINE"
    );
  } catch (error) {
    console.error("[Embeddings] Failed to create index:", error);
    throw error;
  }
}

/**
 * Search projects by semantic similarity
 * Returns top K most similar projects
 */
export async function searchProjectsBySimilarity(
  query: string,
  limit: number = 5
): Promise<Array<{ slug: string; score: number; project: Partial<Project> }>> {
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query);

  // Search using KNN
  const results = await knnSearch(
    "project_embeddings_idx",
    queryEmbedding,
    limit,
    ["slug", "title", "description", "category", "role", "technologies", "featured", "demoUrl", "githubUrl"]
  );

  // Transform results
  return results.map((result: VectorSearchResult) => ({
    slug: result.fields.slug || "",
    score: result.score,
    project: {
      slug: result.fields.slug || "",
      title: result.fields.title || "",
      description: result.fields.description || "",
      category: result.fields.category as Project["category"],
      role: result.fields.role as Project["role"],
      technologies: result.fields.technologies ? result.fields.technologies.split(",") : [],
      featured: result.fields.featured === "true",
      demoUrl: result.fields.demoUrl || undefined,
      githubUrl: result.fields.githubUrl || undefined,
    },
  }));
}
