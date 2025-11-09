/**
 * LLM Error Classification and Retry Logic
 *
 * Provides intelligent error handling for LLM API calls with:
 * - Error classification (rate limit, timeout, API error, network error)
 * - Exponential backoff with jitter
 * - Configurable retry strategies per error type
 * - Retry-After header support for rate limits
 */

/**
 * Error types for LLM API calls
 */
export enum LLMErrorType {
  RATE_LIMIT = "rate_limit",
  TIMEOUT = "timeout",
  API_ERROR = "api_error",
  NETWORK_ERROR = "network_error",
  VALIDATION_ERROR = "validation_error",
  UNKNOWN = "unknown",
}

/**
 * Classified error with metadata
 */
export interface ClassifiedError {
  type: LLMErrorType;
  originalError: Error;
  isRetryable: boolean;
  retryAfterMs?: number;
  statusCode?: number;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterFactor: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000, // 1 second
  maxDelayMs: 30000, // 30 seconds
  jitterFactor: 0.3, // 30% jitter
};

/**
 * Classify an error from LLM API call
 */
export function classifyError(error: unknown): ClassifiedError {
  const err = error as Error & {
    status?: number;
    statusCode?: number;
    code?: string;
    response?: { status?: number; headers?: Headers };
  };

  // Extract status code from various error formats
  const statusCode =
    err.status ||
    err.statusCode ||
    err.response?.status ||
    undefined;

  // Rate limit errors (429, or explicit rate_limit code)
  if (
    statusCode === 429 ||
    err.code === "rate_limit_exceeded" ||
    err.code === "RATE_LIMIT_EXCEEDED" ||
    err.message?.toLowerCase().includes("rate limit")
  ) {
    const retryAfter = err.response?.headers?.get?.("Retry-After");
    const retryAfterMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : undefined;

    return {
      type: LLMErrorType.RATE_LIMIT,
      originalError: err,
      isRetryable: true,
      retryAfterMs,
      statusCode,
    };
  }

  // Timeout errors
  if (
    err.code === "ETIMEDOUT" ||
    err.code === "TIMEOUT" ||
    err.message?.toLowerCase().includes("timeout") ||
    err.message?.toLowerCase().includes("timed out")
  ) {
    return {
      type: LLMErrorType.TIMEOUT,
      originalError: err,
      isRetryable: true,
      statusCode,
    };
  }

  // Network errors
  if (
    err.code === "ECONNREFUSED" ||
    err.code === "ECONNRESET" ||
    err.code === "ENOTFOUND" ||
    err.code === "ENETUNREACH" ||
    err.message?.toLowerCase().includes("network") ||
    err.message?.toLowerCase().includes("connection")
  ) {
    return {
      type: LLMErrorType.NETWORK_ERROR,
      originalError: err,
      isRetryable: true,
      statusCode,
    };
  }

  // Validation errors (4xx client errors, not retryable)
  if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
    return {
      type: LLMErrorType.VALIDATION_ERROR,
      originalError: err,
      isRetryable: false,
      statusCode,
    };
  }

  // API errors (5xx server errors, retryable)
  if (statusCode && statusCode >= 500) {
    return {
      type: LLMErrorType.API_ERROR,
      originalError: err,
      isRetryable: true,
      statusCode,
    };
  }

  // Unknown errors (default: not retryable to be safe)
  return {
    type: LLMErrorType.UNKNOWN,
    originalError: err,
    isRetryable: false,
    statusCode,
  };
}

/**
 * Calculate retry delay with exponential backoff and jitter
 *
 * Formula: min(maxDelay, baseDelay * 2^attempt * (1 + jitter))
 * Jitter: random value between [-jitterFactor, +jitterFactor]
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  retryAfterMs?: number
): number {
  // If server provides Retry-After, respect it
  if (retryAfterMs !== undefined) {
    return Math.min(retryAfterMs, config.maxDelayMs);
  }

  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);

  // Add jitter: random value between [-jitterFactor, +jitterFactor]
  const jitter = 1 + (Math.random() * 2 - 1) * config.jitterFactor;

  // Apply jitter and cap at maxDelay
  const delayWithJitter = exponentialDelay * jitter;
  return Math.min(delayWithJitter, config.maxDelayMs);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation with exponential backoff
 *
 * @param operation - Async function to retry
 * @param config - Retry configuration
 * @param onRetry - Optional callback invoked before each retry
 * @returns Result of successful operation
 * @throws Last error if all retries exhausted
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (attempt: number, error: ClassifiedError, delayMs: number) => void
): Promise<T> {
  let lastError: ClassifiedError | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      // Attempt operation
      return await operation();
    } catch (error) {
      // Classify error
      const classified = classifyError(error);
      lastError = classified;

      // If not retryable or last attempt, throw
      if (!classified.isRetryable || attempt === config.maxRetries) {
        throw classified.originalError;
      }

      // Calculate delay
      const delayMs = calculateRetryDelay(
        attempt,
        config,
        classified.retryAfterMs
      );

      // Invoke callback if provided
      if (onRetry) {
        onRetry(attempt + 1, classified, delayMs);
      }

      // Log retry attempt
      console.warn(
        `[ErrorHandler] Retry attempt ${attempt + 1}/${config.maxRetries} ` +
          `for ${classified.type} error (delay: ${delayMs}ms)`,
        {
          errorType: classified.type,
          statusCode: classified.statusCode,
          retryAfterMs: classified.retryAfterMs,
        }
      );

      // Wait before retry
      await sleep(delayMs);
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError?.originalError || new Error("Retry exhausted");
}
