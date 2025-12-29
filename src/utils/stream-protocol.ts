/**
 * Supported Stream Protocols
 */
export enum StreamProtocol {
    OPENAI_SSE = 'OPENAI_SSE', // data: {"choices": [...]} \n\n
    STANDARD_SSE = 'STANDARD_SSE', // data: {"content": "..."} \n\n
    NDJSON = 'NDJSON', // {"type": "chunk", "content": "..."}\n
    PLAIN_TEXT = 'PLAIN_TEXT', // Raw text stream
    UNKNOWN = 'UNKNOWN'
}

/**
 * Protocol Detection Result
 */
export interface ProtocolDetectionResult {
    protocol: StreamProtocol;
    contentType: string | null;
}

/**
 * Detects the stream protocol based on HTTP headers and initial chunk data.
 * 
 * @param headers HTTP Headers from the fetch response
 * @param initialChunk The first chunk of data received (optional, for content sniffing)
 */
export function detectStreamProtocol(headers: Headers, initialChunk?: string): ProtocolDetectionResult {
    const contentType = headers.get('Content-Type');

    // 1. Detect via Content-Type Header
    if (contentType) {
        if (contentType.includes('text/event-stream')) {
            // Further distinction usually requires sniffing content, but default to Standard/OpenAI SSE logic
            // We will let the content parser decide between OpenAI vs Standard format
            return { protocol: StreamProtocol.OPENAI_SSE, contentType }; 
        }
        if (contentType.includes('application/x-ndjson') || contentType.includes('application/jsonl')) {
            return { protocol: StreamProtocol.NDJSON, contentType };
        }
        if (contentType.includes('text/plain')) {
            return { protocol: StreamProtocol.PLAIN_TEXT, contentType };
        }
    }

    // 2. Fallback: Sniff content if header is ambiguous or missing
    if (initialChunk) {
        const trimmed = initialChunk.trim();
        if (trimmed.startsWith('data:')) {
             return { protocol: StreamProtocol.OPENAI_SSE, contentType }; // Covers both OpenAI and Standard SSE
        }
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
             return { protocol: StreamProtocol.NDJSON, contentType };
        }
    }

    return { protocol: StreamProtocol.UNKNOWN, contentType };
}

/**
 * Parsers for different protocols
 */

// Parser for OpenAI-compatible SSE (e.g. vLLM, OpenAI, DeepSeek)
// Format: data: {"id":"...","choices":[{"delta":{"content":"Hello"}}]}
export function parseOpenAISSE(line: string): { content: string | null; id?: string } {
    if (!line.startsWith('data: ')) return { content: null };
    const data = line.slice(6); // Remove 'data: '
    if (data.trim() === '[DONE]') return { content: null };

    try {
        const json = JSON.parse(data);
        const id = json.id || undefined;
        
        // OpenAI format
        if (json.choices && json.choices[0]?.delta?.content) {
            return { content: json.choices[0].delta.content, id };
        }
        // Anthropic / Vibe Custom format fallback
        if (json.content) {
            return { content: json.content, id };
        }
    } catch (e) {
        // console.warn('Failed to parse SSE JSON:', e);
    }
    return { content: null };
}

// Parser for NDJSON (Newline Delimited JSON)
// Format: {"type":"chunk", "content":"Hello"}
export function parseNDJSON(line: string): { content: string | null; id?: string } {
    try {
        const json = JSON.parse(line);
        const id = json.id || undefined;

        if (json.content) return { content: json.content, id };
        if (json.text) return { content: json.text, id }; // Some other APIs use 'text'
    } catch (e) {
        // Ignore parse errors for partial lines
    }
    return { content: null };
}
