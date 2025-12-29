import { useRef, useCallback } from 'react';
import { fetchSSE } from '@/utils/client-sse';
import { mockStreamCompletion } from '@/services/llm';

export function useSSE() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const stream = useCallback(async (
    url: string,
    body: Record<string, unknown>,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: unknown) => void,
    onRetry?: (attempt: number) => void
  ) => {
    // Mock Implementation logic
    // In a real app, you might check an environment variable or a specific flag in the body
    const useMock = !process.env.NEXT_PUBLIC_API_URL && url === '/api/chat';

    if (useMock) {
        try {
            const messages: any = body.messages || [];
            // Simulate generator consumption
            for await (const chunk of mockStreamCompletion(messages)) {
                onChunk(chunk);
            }
            onDone();
        } catch (e) {
            onError(e);
        }
        return;
    }

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Delegate retry logic to fetchSSE (Exponential Backoff)
    await fetchSSE({
        url,
        body,
        signal: abortController.signal,
        onToken: onChunk,
        onDone: () => {
            abortControllerRef.current = null;
            onDone();
        },
        onError: (err) => {
            abortControllerRef.current = null;
            onError(err);
        },
        onRetry,
        retry: {
            maxRetries: 3,
            initialDelay: 1000,
            backoffFactor: 2
        }
    });
    
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return { stream, stop };
}
