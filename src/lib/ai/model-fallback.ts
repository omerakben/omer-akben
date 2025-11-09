/**
 * Model Fallback Utility
 *
 * Provides primary/fallback pattern for all LLM calls across the application.
 * - Primary: Grok-4-Fast (xAI) - reasoning or non-reasoning variants
 * - Fallback: GPT-4o-mini (OpenAI) - automatic failover on errors
 *
 * Model names are centralized in model-config.ts for easy updates.
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
import {
  getModelByVariant,
  FALLBACK_MODEL,
  type ModelVariant,
} from "./model-config";
import { extractJSON } from "./json-extractor";
import { getPostHogServer } from "@/lib/analytics/posthog-server";
import {
  retryWithBackoff,
  classifyError,
} from "./error-handler";

/**
 * Get primary model based on variant
 */
function getPrimaryModel(variant: ModelVariant) {
  return xai(getModelByVariant(variant));
}

/**
 * Get fallback model from centralized config
 */
function getFallbackModel() {
  return openai(FALLBACK_MODEL);
}

/**
 * Generate text with primary/fallback pattern
 */
export async function generateWithFallback(options: {
  variant: ModelVariant;
  temperature?: number;
  onFallback?: (error: Error) => void;
  component?: string;
  userId?: string;
} & ({ prompt: string; messages?: never } | { messages: CoreMessage[]; prompt?: never }) & {
  system?: string;
}) {
  const { variant, temperature = 0.5, onFallback, component, userId, ...generateOptions } = options;

  const primaryModel = getPrimaryModel(variant);
  const fallbackModel = getFallbackModel();
  const primaryModelName = getModelByVariant(variant);

  const startTime = Date.now();
  let retryAttempts = 0;
  let lastErrorType: string | undefined;

  try {
    // Wrap primary model call with retry logic
    const result = await retryWithBackoff(
      async () => {
        return await generateText({
          model: primaryModel,
          ...generateOptions,
          temperature,
        });
      },
      undefined, // use default retry config
      (attempt, classifiedError, delayMs) => {
        retryAttempts = attempt;
        lastErrorType = classifiedError.type;
        console.log(
          `[ModelFallback] Retrying ${component || 'LLM call'} after ${delayMs}ms ` +
          `(attempt ${attempt}, error: ${classifiedError.type})`
        );
      }
    );

    // Log metrics for successful primary call
    if (component && result.usage) {
      const latencyMs = Date.now() - startTime;
      logLLMMetric(
        {
          timestamp: new Date().toISOString(),
          component,
          primaryModel: primaryModelName,
          fallbackUsed: false,
          latencyMs,
          tokenUsage: {
            input: result.usage.inputTokens || 0,
            output: result.usage.outputTokens || 0,
          },
          success: true,
          retryAttempts: retryAttempts > 0 ? retryAttempts : undefined,
          errorType: lastErrorType,
        },
        userId
      );
    }

    return result;
  } catch (primaryError) {
    const classifiedPrimaryError = classifyError(primaryError);
    console.warn(
      `[ModelFallback] Primary (grok-4-fast-${variant}) failed after ${retryAttempts} retries ` +
      `(${classifiedPrimaryError.type}), using fallback:`,
      primaryError
    );

    if (onFallback) {
      onFallback(primaryError as Error);
    }

    try {
      const result = await generateText({
        model: fallbackModel,
        ...generateOptions,
        temperature,
      });

      // Log metrics for successful fallback call
      if (component && result.usage) {
        const latencyMs = Date.now() - startTime;
        logLLMMetric(
          {
            timestamp: new Date().toISOString(),
            component,
            primaryModel: primaryModelName,
            fallbackUsed: true,
            latencyMs,
            tokenUsage: {
              input: result.usage.inputTokens || 0,
              output: result.usage.outputTokens || 0,
            },
            success: true,
            retryAttempts: retryAttempts > 0 ? retryAttempts : undefined,
            errorType: classifiedPrimaryError.type,
          },
          userId
        );
      }

      return result;
    } catch (fallbackError) {
      const classifiedFallbackError = classifyError(fallbackError);
      console.error(`[ModelFallback] Both models failed:`, {
        primary: primaryError,
        fallback: fallbackError,
      });

      // Log metrics for failed call
      if (component) {
        const latencyMs = Date.now() - startTime;
        logLLMMetric(
          {
            timestamp: new Date().toISOString(),
            component,
            primaryModel: primaryModelName,
            fallbackUsed: true,
            latencyMs,
            tokenUsage: { input: 0, output: 0 },
            success: false,
            error: (fallbackError as Error).message,
            retryAttempts: retryAttempts > 0 ? retryAttempts : undefined,
            errorType: classifiedFallbackError.type,
          },
          userId
        );
      }

      throw fallbackError;
    }
  }
}

/**
 * Generate structured object with primary/fallback pattern
 *
 * Note: XAI Grok models don't support the responseFormat parameter,
 * so we use generateText() + manual JSON parsing for the primary call.
 * Falls back to OpenAI's native generateObject() support if parsing fails.
 */
export async function generateObjectWithFallback<T>(options: {
  variant: ModelVariant;
  temperature?: number;
  onFallback?: (error: Error) => void;
  schema: z.ZodSchema<T>;
  component?: string;
  userId?: string;
} & ({ prompt: string; messages?: never } | { messages: CoreMessage[]; prompt?: never }) & {
  system?: string;
}) {
  const { variant, temperature = 0.5, onFallback, schema, component, userId, ...generateOptions } = options;

  const primaryModel = getPrimaryModel(variant);
  const fallbackModel = getFallbackModel();
  const primaryModelName = getModelByVariant(variant);

  const startTime = Date.now();
  let retryAttempts = 0;
  let lastErrorType: string | undefined;

  try {
    // XAI Grok doesn't support responseFormat, use generateText + manual parsing
    // Wrap the entire operation (generate + parse + validate) with retry logic
    const validated = await retryWithBackoff(
      async () => {
        const result = await generateText({
          model: primaryModel,
          ...generateOptions,
          temperature,
        });

        // Extract JSON (handles markdown code blocks and mixed content)
        const parsed = extractJSON(result.text);
        const validatedData = schema.parse(parsed);

        return { validatedData, usage: result.usage };
      },
      undefined, // use default retry config
      (attempt, classifiedError, delayMs) => {
        retryAttempts = attempt;
        lastErrorType = classifiedError.type;
        console.log(
          `[ModelFallback] Retrying ${component || 'LLM object generation'} after ${delayMs}ms ` +
          `(attempt ${attempt}, error: ${classifiedError.type})`
        );
      }
    );

    // Log metrics for successful primary call
    if (component && validated.usage) {
      const latencyMs = Date.now() - startTime;
      logLLMMetric(
        {
          timestamp: new Date().toISOString(),
          component,
          primaryModel: primaryModelName,
          fallbackUsed: false,
          latencyMs,
          tokenUsage: {
            input: validated.usage.inputTokens || 0,
            output: validated.usage.outputTokens || 0,
          },
          success: true,
          retryAttempts: retryAttempts > 0 ? retryAttempts : undefined,
          errorType: lastErrorType,
        },
        userId
      );
    }

    return { object: validated.validatedData };
  } catch (primaryError) {
    const classifiedPrimaryError = classifyError(primaryError);
    console.warn(
      `[ModelFallback] Primary (grok-4-fast-${variant}) generateObject failed after ${retryAttempts} retries ` +
      `(${classifiedPrimaryError.type}), using fallback:`,
      primaryError
    );

    if (onFallback) {
      onFallback(primaryError as Error);
    }

    try {
      // OpenAI supports native generateObject with responseFormat
      const result = await generateObject({
        model: fallbackModel,
        schema,
        ...generateOptions,
        temperature,
      });

      // Log metrics for successful fallback call
      if (component && result.usage) {
        const latencyMs = Date.now() - startTime;
        logLLMMetric(
          {
            timestamp: new Date().toISOString(),
            component,
            primaryModel: primaryModelName,
            fallbackUsed: true,
            latencyMs,
            tokenUsage: {
              input: result.usage.inputTokens || 0,
              output: result.usage.outputTokens || 0,
            },
            success: true,
            retryAttempts: retryAttempts > 0 ? retryAttempts : undefined,
            errorType: classifiedPrimaryError.type,
          },
          userId
        );
      }

      return result;
    } catch (fallbackError) {
      const classifiedFallbackError = classifyError(fallbackError);
      console.error(`[ModelFallback] Both models failed for generateObject:`, {
        primary: primaryError,
        fallback: fallbackError,
      });

      // Log metrics for failed call
      if (component) {
        const latencyMs = Date.now() - startTime;
        logLLMMetric(
          {
            timestamp: new Date().toISOString(),
            component,
            primaryModel: primaryModelName,
            fallbackUsed: true,
            latencyMs,
            tokenUsage: { input: 0, output: 0 },
            success: false,
            error: (fallbackError as Error).message,
            retryAttempts: retryAttempts > 0 ? retryAttempts : undefined,
            errorType: classifiedFallbackError.type,
          },
          userId
        );
      }

      throw fallbackError;
    }
  }
}

/**
 * Stream text with primary/fallback pattern
 *
 * Note: Streaming metrics are not tracked because token usage is not available
 * until the stream is consumed. For detailed metrics tracking, use generateWithFallback
 * or generateObjectWithFallback instead.
 *
 * Retry logic is not applicable to streaming because:
 * - streamText() returns synchronously (errors happen during consumption)
 * - Partial streams cannot be retried
 * - For better error handling with retries, use generateWithFallback
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
    const result = streamText({
      model: primaryModel,
      ...streamOptions,
      temperature,
    });

    return result;
  } catch (primaryError) {
    console.warn(`[ModelFallback] Primary (grok-4-fast-${variant}) streaming failed, using fallback:`, primaryError);

    if (onFallback) {
      onFallback(primaryError as Error);
    }

    try {
      const result = streamText({
        model: fallbackModel,
        ...streamOptions,
        temperature,
      });

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
  retryAttempts?: number;
  errorType?: string;
}

/**
 * Calculate estimated cost based on token usage and model
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @param model - Model name (e.g., "grok-4-fast-reasoning", "gpt-4o-mini")
 * @returns Estimated cost in USD
 */
function calculateCost(inputTokens: number, outputTokens: number, model: string): number {
  // Pricing per 1M tokens (as of Nov 2025)
  const pricing: Record<string, { input: number; output: number }> = {
    // Grok models (xAI)
    "grok-4-fast-reasoning": { input: 2, output: 10 },
    "grok-4-fast-non-reasoning": { input: 2, output: 10 },
    // OpenAI models
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
  };

  const modelPricing = pricing[model] || { input: 0, output: 0 };
  const inputCost = (inputTokens / 1_000_000) * modelPricing.input;
  const outputCost = (outputTokens / 1_000_000) * modelPricing.output;

  return inputCost + outputCost;
}

/**
 * Log LLM metrics for monitoring and analytics
 * Sends events to PostHog for tracking model performance, costs, and fallback rates
 */
export function logLLMMetric(metric: LLMMetric, userId?: string): void {
  try {
    const posthog = getPostHogServer();

    // Calculate cost based on token usage
    const estimatedCost = calculateCost(
      metric.tokenUsage.input,
      metric.tokenUsage.output,
      metric.primaryModel
    );

    // Capture event in PostHog
    posthog.capture({
      distinctId: userId || 'anonymous',
      event: 'llm_call',
      properties: {
        component: metric.component,
        primary_model: metric.primaryModel,
        fallback_used: metric.fallbackUsed,
        latency_ms: metric.latencyMs,
        input_tokens: metric.tokenUsage.input,
        output_tokens: metric.tokenUsage.output,
        total_tokens: metric.tokenUsage.input + metric.tokenUsage.output,
        estimated_cost_usd: estimatedCost,
        success: metric.success,
        error: metric.error,
        timestamp: metric.timestamp,
      },
    });
  } catch (error) {
    // Log errors but don't throw to avoid breaking LLM calls
    console.error('[PostHog] Failed to log LLM metric:', error);
  }
}
