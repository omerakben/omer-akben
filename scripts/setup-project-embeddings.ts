/**
 * Setup Project Embeddings Script
 *
 * This script:
 * 1. Creates Redis vector index for project embeddings
 * 2. Generates embeddings for all projects using OpenAI text-embedding-3-small
 * 3. Stores embeddings in Redis for semantic search
 *
 * Usage: npx tsx scripts/setup-project-embeddings.ts
 */

import { projects } from "@/data/projects";
import {
  createProjectEmbeddingsIndex,
  embedAllProjects,
} from "@/lib/redis/embeddings";

async function main() {
  console.log("[Setup] Starting project embeddings setup...");
  console.log(`[Setup] Found ${projects.length} projects to embed`);

  try {
    // Step 1: Create Redis vector index
    console.log("\n[Step 1/2] Creating Redis vector index...");
    await createProjectEmbeddingsIndex();
    console.log("✅ Index created successfully");

    // Step 2: Embed all projects
    console.log("\n[Step 2/2] Embedding projects...");
    await embedAllProjects(projects);
    console.log(`✅ Embedded ${projects.length} projects successfully`);

    console.log("\n✨ Setup complete! Semantic search is ready.");
    console.log("\nTest semantic search with:");
    console.log('  - "Show me projects with machine learning"');
    console.log('  - "What have you built with real-time features?"');
    console.log('  - "Find projects related to AI"');
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

main();
