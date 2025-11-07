/**
 * Model Fallback Utility
 *
 * Provides primary/fallback pattern for all LLM calls across the application.
 * - Primary: Grok-4-Fast (xAI) - reasoning or non-reasoning variants
 * - Fallback: GPT-4o-mini (OpenAI) - automatic failover on errors
 *
 * Usage:
 * ```typescript
 * const result = await generateWithFallback({
 *   messages: [...],
 *   variant: "non-reasoning",
 *   temperature: 0.5
 * });
 * ```
 */

import { generateText, generateObject, streamText } from "ai";
import { xai } from "@ai-sdk/xai";
import { openai } from "@ai-sdk/openai";
import type { CoreMessage } from "ai";
import type { z } from "zod";

export type ModelVariant = "reasoning" | "non-reasoning";

/**
 * Get primary model based on variant
 */
function getPrimaryModel(variant: ModelVariant) {
  return variant === "reasoning"
    ? xai("grok-4-fast-reasoning")
    : xai("grok-4-fast-non-reasoning");
}

/**
 * Get fallback model (always gpt-4o-mini)
 */
function getFallbackModel() {
  return openai("gpt-4o-mini");
}

/**
 * Generate text with primary/fallback pattern
 */
export async function generateWithFallback(options: {
  variant: ModelVariant;
  temperature?: number;
  onFallback?: (error: Error) => void;
} & ({ prompt: string; messages?: never } | { messages: CoreMessage[]; prompt?: never }) & {
  system?: string;
}) {
  const { variant, temperature = 0.5, onFallback, ...generateOptions } = options;

  const primaryModel = getPrimaryModel(variant);
  const fallbackModel = getFallbackModel();

  try {
    const startTime = Date.now();

    const result = await generateText({
      model: primaryModel,
      ...generateOptions,
      temperature,
    });

    const duration = Date.now() - startTime;
    console.log(`[ModelFallback] Primary (grok-4-fast-${variant}) succeeded in ${duration}ms`);

    return result;
  } catch (primaryError) {
    console.warn(`[ModelFallback] Primary (grok-4-fast-${variant}) failed, using fallback:`, primaryError);

    if (onFallback) {
      onFallback(primaryError as Error);
    }

    const startTime = Date.now();

    try {
      const result = await generateText({
        model: fallbackModel,
        ...generateOptions,
        temperature,
      });

      const duration = Date.now() - startTime;
      console.log(`[ModelFallback] Fallback (gpt-4o-mini) succeeded in ${duration}ms`);

      return result;
    } catch (fallbackError) {
      console.error(`[ModelFallback] Both models failed:`, {
        primary: primaryError,
        fallback: fallbackError,
      });
      throw fallbackError;
    }
  }
}

/**
 * Generate structured object with primary/fallback pattern
 */
export async function generateObjectWithFallback<T>(options: {
  variant: ModelVariant;
  temperature?: number;
  onFallback?: (error: Error) => void;
  schema: z.ZodSchema<T>;
} & ({ prompt: string; messages?: never } | { messages: CoreMessage[]; prompt?: never }) & {
  system?: string;
}) {
  const { variant, temperature = 0.5, onFallback, schema, ...generateOptions } = options;

  const primaryModel = getPrimaryModel(variant);
  const fallbackModel = getFallbackModel();

  try {
    const startTime = Date.now();

    const result = await generateObject({
      model: primaryModel,
      schema,
      ...generateOptions,
      temperature,
    });

    const duration = Date.now() - startTime;
    console.log(`[ModelFallback] Primary (grok-4-fast-${variant}) generateObject succeeded in ${duration}ms`);

    return result;
  } catch (primaryError) {
    console.warn(`[ModelFallback] Primary (grok-4-fast-${variant}) generateObject failed, using fallback:`, primaryError);

    if (onFallback) {
      onFallback(primaryError as Error);
    }

    const startTime = Date.now();

    try {
      const result = await generateObject({
        model: fallbackModel,
        schema,
        ...generateOptions,
        temperature,
      });

      const duration = Date.now() - startTime;
      console.log(`[ModelFallback] Fallback (gpt-4o-mini) generateObject succeeded in ${duration}ms`);

      return result;
    } catch (fallbackError) {
      console.error(`[ModelFallback] Both models failed for generateObject:`, {
        primary: primaryError,
        fallback: fallbackError,
      });
      throw fallbackError;
    }
  }
}

/**
 * Stream text with primary/fallback pattern
 */
export async function streamWithFallback(options: {
  variant: ModelVariant;
  temperature?: number;
  onFallback?: (error: Error) => void;
} & ({ prompt: string; messages?: never } | { messages: CoreMessage[]; prompt?: never }) & {
  system?: string;
}) {
  const { variant, temperature = 0.5, onFallback, ...streamOptions } = options;

  const primaryModel = getPrimaryModel(variant);
  const fallbackModel = getFallbackModel();

  try {
    const startTime = Date.now();

    const result = streamText({
      model: primaryModel,
      ...streamOptions,
      temperature,
    });

    console.log(`[ModelFallback] Primary (grok-4-fast-${variant}) streaming started at ${startTime}ms`);

    return result;
  } catch (primaryError) {
    console.warn(`[ModelFallback] Primary (grok-4-fast-${variant}) streaming failed, using fallback:`, primaryError);

    if (onFallback) {
      onFallback(primaryError as Error);
    }

    const startTime = Date.now();

    try {
      const result = streamText({
        model: fallbackModel,
        ...streamOptions,
        temperature,
      });

      console.log(`[ModelFallback] Fallback (gpt-4o-mini) streaming started at ${startTime}ms`);

      return result;
    } catch (fallbackError) {
      console.error(`[ModelFallback] Both models failed for streaming:`, {
        primary: primaryError,
        fallback: fallbackError,
      });
      throw fallbackError;
    }
  }
}

/**
 * Metrics interface for monitoring LLM performance
 */
export interface LLMMetric {
  timestamp: string;
  component: string;
  primaryModel: string;
  fallbackUsed: boolean;
  latencyMs: number;
  tokenUsage: {
    input: number;
    output: number;
  };
  success: boolean;
  error?: string;
}

/**
 * Log LLM metrics for monitoring and analytics
 */
export function logLLMMetric(metric: LLMMetric): void {
  console.log("[LLMMetrics]", JSON.stringify(metric));
  // Optional: Send to analytics service like PostHog, Mixpanel, etc.
}
