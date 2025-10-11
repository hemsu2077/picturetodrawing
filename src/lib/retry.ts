/**
 * Retry utility with exponential backoff for handling transient network failures
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  timeout?: number;
  retryableErrors?: string[];
  onRetry?: (error: Error, attempt: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  timeout: 30000, // 30 seconds
  retryableErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'EPIPE',
    'EAI_AGAIN',
    'fetch failed',
    'network timeout',
  ],
  onRetry: () => {},
};

/**
 * Check if an error is retryable based on error code or message
 */
function isRetryableError(error: unknown, retryableErrors: string[]): boolean {
  if (!error) return false;

  const errorStr = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code;
  const causeCode = (error as any)?.cause?.code;

  return retryableErrors.some(
    (retryable) =>
      errorStr.includes(retryable) ||
      errorCode === retryable ||
      causeCode === retryable
  );
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const exponentialDelay = initialDelay * Math.pow(multiplier, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  // Add jitter (±25%) to prevent thundering herd
  const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.floor(cappedDelay + jitter);
}

/**
 * Wrap a promise with a timeout
 */
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutError)), timeoutMs)
    ),
  ]);
}

/**
 * Retry an async operation with exponential backoff
 * 
 * @param operation - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the operation
 * @throws The last error if all retries fail
 * 
 * @example
 * ```ts
 * const result = await retryWithBackoff(
 *   async () => await fetch('https://api.example.com'),
 *   { maxAttempts: 3, initialDelayMs: 1000 }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      // Wrap operation with timeout
      const result = await withTimeout(
        operation(),
        config.timeout,
        `Operation timed out after ${config.timeout}ms`
      );
      
      // Success - return result
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      const isLastAttempt = attempt === config.maxAttempts;
      const shouldRetry = isRetryableError(error, config.retryableErrors);

      if (isLastAttempt || !shouldRetry) {
        // Don't retry - throw the error
        throw lastError;
      }

      // Calculate delay and notify
      const delay = calculateDelay(
        attempt,
        config.initialDelayMs,
        config.maxDelayMs,
        config.backoffMultiplier
      );

      config.onRetry(lastError, attempt);

      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `Retry attempt ${attempt}/${config.maxAttempts} after ${delay}ms due to:`,
          lastError.message
        );
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError!;
}

/**
 * Retry configuration presets for common scenarios
 */
export const RetryPresets = {
  /** Fast retry for quick operations (3 attempts, 500ms initial delay) */
  fast: {
    maxAttempts: 3,
    initialDelayMs: 500,
    maxDelayMs: 5000,
    timeout: 15000,
  } as RetryOptions,

  /** Standard retry for normal operations (3 attempts, 1s initial delay) */
  standard: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    timeout: 30000,
  } as RetryOptions,

  /** Aggressive retry for critical operations (5 attempts, 2s initial delay) */
  aggressive: {
    maxAttempts: 5,
    initialDelayMs: 2000,
    maxDelayMs: 20000,
    timeout: 60000,
  } as RetryOptions,

  /** File upload retry (4 attempts, longer timeout for large files) */
  fileUpload: {
    maxAttempts: 4,
    initialDelayMs: 1500,
    maxDelayMs: 15000,
    timeout: 60000, // 60 seconds for large files
  } as RetryOptions,
};
