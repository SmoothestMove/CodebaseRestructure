export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}

const defaultOptions: Required<Pick<RetryOptions, 'retries' | 'baseDelayMs' | 'maxDelayMs' | 'jitter'>> = {
  retries: 2,
  baseDelayMs: 500,
  maxDelayMs: 4000,
  jitter: true,
};

function createDelay(delayMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Operation aborted', 'AbortError'));
    }

    const timeout = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, delayMs);

    const onAbort = () => {
      clearTimeout(timeout);
      reject(new DOMException('Operation aborted', 'AbortError'));
    };

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

function computeDelay(attempt: number, baseDelayMs: number, maxDelayMs: number, jitter: boolean) {
  const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
  if (!jitter) return delay;
  const jitterFactor = 0.5 + Math.random() * 0.5; // between 0.5 and 1.0
  return Math.ceil(delay * jitterFactor);
}

export async function retryWithBackoff<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries,
    baseDelayMs,
    maxDelayMs,
    jitter,
  } = { ...defaultOptions, ...options };

  const signal = options.signal;
  const shouldRetry = options.shouldRetry ?? (() => true);
  const onRetry = options.onRetry ?? (() => {});

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (signal?.aborted) {
      throw new DOMException('Operation aborted', 'AbortError');
    }

    try {
      return await operation(attempt);
    } catch (error) {
      const willRetry = attempt < retries && shouldRetry(error, attempt);
      if (!willRetry) {
        throw error;
      }

      const delayMs = computeDelay(attempt, baseDelayMs, maxDelayMs, jitter);
      onRetry(error, attempt, delayMs);
      await createDelay(delayMs, signal);
    }
  }

  throw new Error('Retry operation exited unexpectedly');
}
