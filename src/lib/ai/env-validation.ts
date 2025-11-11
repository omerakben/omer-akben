/**
 * Environment Variable Validation for AI Configuration
 *
 * Validates all required environment variables on application startup.
 * Throws clear errors if any required variables are missing.
 */

interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  errorMessage?: string;
}

const REQUIRED_ENV_VARS = [
  "OPENAI_API_KEY",
  "XAI_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "UPSTASH_VECTOR_REST_URL",
  "UPSTASH_VECTOR_REST_TOKEN",
] as const;

/**
 * Validates that all required AI configuration environment variables are set.
 * Should be called on application startup (e.g., in root layout.tsx).
 *
 * @throws {Error} If any required environment variables are missing
 * @returns {void}
 */
export function validateAIConfig(): void {
  const result = checkRequiredEnvVars();

  if (!result.isValid) {
    throw new Error(result.errorMessage);
  }

  // Validation successful - silent in production
}

/**
 * Checks which required environment variables are missing.
 * Returns validation result with missing variables list.
 *
 * @returns {EnvValidationResult} Validation result
 */
function checkRequiredEnvVars(): EnvValidationResult {
  const missingVars = REQUIRED_ENV_VARS.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length === 0) {
    return { isValid: true, missingVars: [] };
  }

  const errorMessage = `Missing required environment variables:
${missingVars.map((v) => `  - ${v}`).join("\n")}

Please ensure all required environment variables are set in your .env.local file.
See .env.example for reference.`;

  return {
    isValid: false,
    missingVars,
    errorMessage,
  };
}

/**
 * Non-throwing version that returns validation result.
 * Useful for health checks or diagnostic endpoints.
 *
 * @returns {EnvValidationResult} Validation result
 */
export function getEnvValidationStatus(): EnvValidationResult {
  return checkRequiredEnvVars();
}
