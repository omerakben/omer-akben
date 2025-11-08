/**
 * Centralized AI Model Configuration
 *
 * Single source of truth for all AI model names across the application.
 * Supports environment variable overrides for production flexibility.
 *
 * Benefits:
 * - Easy model updates (change once, applies everywhere)
 * - Future-proof for new model releases
 * - Environment-based model selection for A/B testing or gradual rollouts
 * - Type-safe model references throughout codebase
 *
 * Usage:
 * ```typescript
 * import { PRIMARY_REASONING_MODEL, FALLBACK_MODEL } from '@/lib/ai/model-config';
 * import { xai } from '@ai-sdk/xai';
 *
 * const model = xai(PRIMARY_REASONING_MODEL);
 * ```
 */

/**
 * Model Configuration Schema
 */
export const AI_MODEL_CONFIG = {
  /**
   * Primary Provider: XAI (Grok models)
   * Used for all primary LLM operations with automatic fallback to OpenAI
   */
  primary: {
    provider: "xai" as const,
    models: {
      /**
       * Grok-4-Fast-Reasoning
       * Use for: Multi-step reasoning, agentic tool orchestration, chat conversations
       * Context: 2M tokens, Pricing: $0.20 input / $0.50 output per 1M tokens
       */
      reasoning:
        process.env.XAI_REASONING_MODEL || "grok-4-fast-reasoning",

      /**
       * Grok-4-Fast-Non-Reasoning
       * Use for: Classification, extraction, follow-ups, workflows, text editing
       * Context: 2M tokens, Pricing: $0.20 input / $0.50 output per 1M tokens
       * Expected: 70-85% faster than reasoning variant for non-reasoning tasks
       */
      nonReasoning:
        process.env.XAI_NON_REASONING_MODEL || "grok-4-fast-non-reasoning",
    },
  },

  /**
   * Fallback Provider: OpenAI (GPT models)
   * Used for automatic failover when primary provider is unavailable
   */
  fallback: {
    provider: "openai" as const,
    /**
     * GPT-4o-mini
     * Use for: Automatic fallback on primary model errors/timeouts
     * Context: 128K tokens, Pricing: $0.15 input / $0.60 output per 1M tokens
     */
    model: process.env.OPENAI_FALLBACK_MODEL || "gpt-4o-mini",
  },

  /**
   * Embedding Provider: OpenAI
   * Used for: Semantic search, episodic memory, vector similarity
   * Note: Grok does not provide embedding models, so OpenAI is always used
   */
  embedding: {
    provider: "openai" as const,
    /**
     * text-embedding-3-small
     * Dimensions: 1536, Cost-effective for production use
     */
    model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  },
} as const;

/**
 * Typed Model Exports
 * Use these constants throughout the codebase for type-safe model references
 */

/** Primary reasoning model for agentic chat and multi-step reasoning */
export const PRIMARY_REASONING_MODEL = AI_MODEL_CONFIG.primary.models.reasoning;

/** Primary non-reasoning model for classification, extraction, workflows */
export const PRIMARY_NON_REASONING_MODEL =
  AI_MODEL_CONFIG.primary.models.nonReasoning;

/** Fallback model for automatic error recovery */
export const FALLBACK_MODEL = AI_MODEL_CONFIG.fallback.model;

/** Embedding model for semantic search and vector operations */
export const EMBEDDING_MODEL = AI_MODEL_CONFIG.embedding.model;

/**
 * Model Variant Type
 * Used by model-fallback.ts to select appropriate model
 */
export type ModelVariant = "reasoning" | "non-reasoning";

/**
 * Get model name by variant
 */
export function getModelByVariant(variant: ModelVariant): string {
  return variant === "reasoning"
    ? PRIMARY_REASONING_MODEL
    : PRIMARY_NON_REASONING_MODEL;
}

/**
 * Model Provider Type Guard
 */
export function isXAIModel(modelName: string): boolean {
  return (
    modelName === PRIMARY_REASONING_MODEL ||
    modelName === PRIMARY_NON_REASONING_MODEL
  );
}

export function isOpenAIModel(modelName: string): boolean {
  return modelName === FALLBACK_MODEL || modelName === EMBEDDING_MODEL;
}

/**
 * Mastra-formatted Model Strings
 * Mastra uses "provider/model-name" format for agent configuration
 */

/** Mastra format for primary reasoning model: xai/grok-4-fast-reasoning */
export const MASTRA_PRIMARY_REASONING = `xai/${PRIMARY_REASONING_MODEL}`;

/** Mastra format for primary non-reasoning model: xai/grok-4-fast-non-reasoning */
export const MASTRA_PRIMARY_NON_REASONING = `xai/${PRIMARY_NON_REASONING_MODEL}`;

/** Mastra format for fallback model: openai/gpt-4o-mini */
export const MASTRA_FALLBACK = `openai/${FALLBACK_MODEL}`;

/** Mastra format for embedding model: openai/text-embedding-3-small */
export const MASTRA_EMBEDDING = `openai/${EMBEDDING_MODEL}`;
