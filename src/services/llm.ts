import { Message } from "@/features/chat/types";
import { detectStreamProtocol, StreamProtocol, parseOpenAISSE, parseNDJSON } from "@/utils/stream-protocol";

// Approximately 4 characters per token
const CHARS_PER_TOKEN = 4;
const MAX_CONTEXT_TOKENS = 4000; // Safe limit for most models
const MAX_CONTEXT_CHARS = MAX_CONTEXT_TOKENS * CHARS_PER_TOKEN;

/**
 * Crops the message history to fit within the context window.
 * Always keeps the system message (if any) and the last user message.
 * Removes oldest messages from the middle until it fits.
 */
export function cropMessages(messages: Pick<Message, 'role' | 'content'>[]): Pick<Message, 'role' | 'content'>[] {
  if (messages.length === 0) return [];

  const lastMessage = messages[messages.length - 1];
  let currentLength = lastMessage.content.length;
  const croppedMessages = [lastMessage];
  
  // We process in reverse (excluding the last one which we already added)
  for (let i = messages.length - 2; i >= 0; i--) {
    const msg = messages[i];
    const msgLength = msg.content.length;
    
    if (currentLength + msgLength > MAX_CONTEXT_CHARS) {
        // If adding this message exceeds limit, stop adding older messages.
        // But if it's the very first one and it's important (like system prompt), 
        // we might want to keep it? For now, simple cropping.
        break; 
    }
    
    croppedMessages.unshift(msg);
    currentLength += msgLength;
  }

  return croppedMessages;
}

export async function* streamCompletion(messages: Message[]) {
  // 1. Prepare context
  const history = cropMessages(messages.map(m => ({ role: m.role, content: m.content })));
  
  // 2. Mock API Call (Replace with real fetch)
  // const response = await fetch('/api/chat', { ... });
  
  // For now, we continue using the mock generator, but here is how we would integrate the protocol detection:
  /*
  const response = await fetch('http://localhost:3000/api/mock-llm', { // Hypothetical endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
  });

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  // Detect Protocol
  const { protocol } = detectStreamProtocol(response.headers);
  console.log(`Detected Protocol: ${protocol}`);

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;
    
    // Split by newlines
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
        if (!line.trim()) continue;

        let content: string | null = null;

        if (protocol === StreamProtocol.OPENAI_SSE || protocol === StreamProtocol.STANDARD_SSE) {
            content = parseOpenAISSE(line);
        } else if (protocol === StreamProtocol.NDJSON) {
            content = parseNDJSON(line);
        } else {
            // Plain text or unknown
            content = line; 
        }

        if (content) {
            yield content;
        }
    }
  }
  */

  // Fallback to existing mock for demo purposes
  yield* mockStreamCompletion(messages);
}

export async function* mockStreamCompletion(messages: Message[]) {
  const lastUserMessage = messages.findLast(m => m.role === 'user')?.content || "";
  
  const responseText = "我是模拟的 AI 助手（增强版）。我收到了你的消息：\"" + lastUserMessage + "\"。\n\n我可以帮你：\n1. 编写 React 组件\n2. 解释 Next.js App Router\n3. 调试 Tailwind 样式\n\n这是一个代码示例：\n```tsx\nconst Hello = () => <div>你好，世界</div>\n```";
  
  const chunks = responseText.split(/(?=[\s\S])/);
  
  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
    yield chunk;
  }
}
