import { detectStreamProtocol, parseNDJSON, parseOpenAISSE, StreamProtocol } from '../src/utils/stream-protocol';

// Mock Headers
class MockHeaders {
    private headers: Record<string, string> = {};
    constructor(init?: Record<string, string>) {
        this.headers = init || {};
    }
    get(key: string) {
        return this.headers[key] || null;
    }
}

describe('Protocol Detection', () => {
    test('Should detect OpenAI SSE via Content-Type', () => {
        const headers = new MockHeaders({ 'Content-Type': 'text/event-stream' }) as unknown as Headers;
        const result = detectStreamProtocol(headers);
        expect(result.protocol).toBe(StreamProtocol.OPENAI_SSE);
    });

    test('Should detect NDJSON via Content-Type', () => {
        const headers = new MockHeaders({ 'Content-Type': 'application/x-ndjson' }) as unknown as Headers;
        const result = detectStreamProtocol(headers);
        expect(result.protocol).toBe(StreamProtocol.NDJSON);
    });

    test('Should detect via Content Sniffing (OpenAI SSE)', () => {
        const headers = new MockHeaders({}) as unknown as Headers;
        const chunk = 'data: {"choices": []}\n\n';
        const result = detectStreamProtocol(headers, chunk);
        expect(result.protocol).toBe(StreamProtocol.OPENAI_SSE);
    });

    test('Should detect via Content Sniffing (NDJSON)', () => {
        const headers = new MockHeaders({}) as unknown as Headers;
        const chunk = '{"type": "chunk", "content": "hello"}\n';
        const result = detectStreamProtocol(headers, chunk);
        expect(result.protocol).toBe(StreamProtocol.NDJSON);
    });
});

describe('Protocol Parsing', () => {
    test('Parse OpenAI SSE', () => {
        const line = 'data: {"choices":[{"delta":{"content":"Hello"}}]}';
        expect(parseOpenAISSE(line)).toBe("Hello");
    });

    test('Parse Standard SSE', () => {
        const line = 'data: {"content":"World"}';
        expect(parseOpenAISSE(line)).toBe("World");
    });

    test('Parse NDJSON', () => {
        const line = '{"type":"chunk", "content":"React"}';
        expect(parseNDJSON(line)).toBe("React");
    });

    test('Handle Invalid Data Gracefully', () => {
        expect(parseOpenAISSE('data: [DONE]')).toBeNull();
        expect(parseOpenAISSE('invalid json')).toBeNull();
    });
});
