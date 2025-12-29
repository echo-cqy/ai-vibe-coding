import { detectStreamProtocol, StreamProtocol, parseOpenAISSE, parseNDJSON } from './stream-protocol';

export interface SSEOptions {
  url: string;
  body: unknown;
  headers?: Record<string, string>;
  onToken: (token: string) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
  onRetry?: (attempt: number) => void;
  signal?: AbortSignal;
  retry?: RetryOptions;
}

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  backoffFactor: number;
}

/**
 * Utility to wait for a specified duration
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Handles Server-Sent Events (SSE) and other stream protocols using the Fetch API.
 * Supports:
 * - Exponential Backoff Retry Strategy
 * - OpenAI SSE (data: {...})
 * - Standard SSE (data: {content: ...})
 * - NDJSON ({...}\n{...})
 * - Plain Text
 */
export async function fetchSSE({ url, body, headers, onToken, onDone, onError, onRetry, signal, retry }: SSEOptions) {
  let attempt = 0;
  const maxRetries = retry?.maxRetries ?? 3;
  const initialDelay = retry?.initialDelay ?? 1000;
  const backoffFactor = retry?.backoffFactor ?? 2;
  
  let hasReceivedData = false;
  let lastEventId: string | null = null;

  const executeFetch = async (): Promise<void> => {
    try {
      const headersWithResume = { ...headers };
      // 1. Add Last-Event-ID if we have one (Standard SSE mechanism)
      if (lastEventId) {
        headersWithResume['Last-Event-ID'] = lastEventId;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headersWithResume,
        },
        body: JSON.stringify(body),
        signal,
      });

      // Handle non-2xx responses
      if (!response.ok) {
        // 4xx errors (except 429) are usually client errors and shouldn't be retried
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
             const errorText = await response.text();
             throw new Error(`API Error: ${response.status} - ${errorText}`); // Non-retryable
        }
        throw new Error(`HTTP Error: ${response.status}`); // Retryable (5xx, 429)
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      // Initial protocol detection state
      let protocol: StreamProtocol = StreamProtocol.UNKNOWN;
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Detect protocol on first chunk
        if (isFirstChunk) {
          const detection = detectStreamProtocol(response.headers, chunk);
          protocol = detection.protocol;
          isFirstChunk = false;
        }

        const lines = buffer.split('\n');
        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine && protocol !== StreamProtocol.PLAIN_TEXT) continue;

          let content: string | null = null;

          // Protocol-specific parsing
          switch (protocol) {
              case StreamProtocol.OPENAI_SSE:
              case StreamProtocol.STANDARD_SSE:
                  const parsedSSE = parseOpenAISSE(trimmedLine);
                  content = parsedSSE.content;
                  if (parsedSSE.id) lastEventId = parsedSSE.id;
                  break;
              case StreamProtocol.NDJSON:
                  const parsedNDJSON = parseNDJSON(trimmedLine);
                  content = parsedNDJSON.content;
                  if (parsedNDJSON.id) lastEventId = parsedNDJSON.id;
                  break;
              case StreamProtocol.PLAIN_TEXT:
                  content = line + '\n'; 
                  break;
              default:
                  const fallbackSSE = parseOpenAISSE(trimmedLine);
                  if (fallbackSSE.content) {
                      content = fallbackSSE.content;
                      if (fallbackSSE.id) lastEventId = fallbackSSE.id;
                  } else {
                      const fallbackNDJSON = parseNDJSON(trimmedLine);
                      if (fallbackNDJSON.content) {
                          content = fallbackNDJSON.content;
                          if (fallbackNDJSON.id) lastEventId = fallbackNDJSON.id;
                      }
                  }
                  break;
          }

          if (content) {
            hasReceivedData = true; // Mark that we have successfully received data
            onToken(content);
          }
        }
      }
      
      // Process any remaining buffer
      if (buffer.trim()) {
           let content: string | null = null;
           const trimmedLine = buffer.trim();
           
           if (protocol === StreamProtocol.OPENAI_SSE || protocol === StreamProtocol.STANDARD_SSE) {
               const parsed = parseOpenAISSE(trimmedLine);
               content = parsed.content;
               if (parsed.id) lastEventId = parsed.id;
           } else if (protocol === StreamProtocol.NDJSON) {
               const parsed = parseNDJSON(trimmedLine);
               content = parsed.content;
               if (parsed.id) lastEventId = parsed.id;
           } else if (protocol === StreamProtocol.PLAIN_TEXT) {
               content = buffer;
           }

           if (content) {
             hasReceivedData = true;
             onToken(content);
           }
      }

      onDone?.();

    } catch (error: any) {
      if (signal?.aborted) {
        return;
      }
      
      // Check if we should retry
      const isRetryable = 
        !hasReceivedData && // Only retry if we haven't started streaming data to avoid duplicate content
        attempt < maxRetries && 
        (error.message.includes('NetworkError') || 
         error.message.includes('HTTP Error') || 
         error.message.includes('Failed to fetch'));

      if (isRetryable) {
        attempt++;
        // Exponential Backoff: delay = initialDelay * 2^(attempt-1)
        // Add Jitter: +/- 10% random factor to avoid thundering herd
        const baseDelay = initialDelay * Math.pow(backoffFactor, attempt - 1);
        const jitter = baseDelay * 0.1 * Math.random(); 
         const delay = baseDelay + jitter;

         console.warn(`SSE Connection failed, retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries})`, error);
         onRetry?.(attempt);
         
         await wait(delay);
         return executeFetch(); // Recursive retry
       }

      console.error('SSE Error:', error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return executeFetch();
}
