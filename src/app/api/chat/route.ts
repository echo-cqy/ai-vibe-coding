import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // Check for Last-Event-ID header for resume support
    const lastEventId = req.headers.get('Last-Event-ID');
    let startIndex = 0;
    
    if (lastEventId) {
        console.log(`[Server] Resuming from ID: ${lastEventId}`);
        // Simple mock logic: ID corresponds to chunk index
        // In real app, this would be a database ID or token sequence number
        startIndex = parseInt(lastEventId, 10) + 1;
    }

    // Create a TransformStream for SSE
    const encoder = new TextEncoder();
    const stream = new TransformStream({
      async start(controller) {
        const sendEvent = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Simulate initial delay
        if (startIndex === 0) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
            console.log(`[Server] Skipping initial delay for resume`);
        }

        const responseText = `I received your message: "${lastMessage}".\n\nI am a simulated AI agent running on the server (Next.js Edge Runtime). I can help you with:\n1. React Components\n2. API Routes\n3. Database Integration\n\nHere is a code snippet:\n\`\`\`typescript\nconsole.log("Hello from Server Action!");\n\`\`\``;
        
        const chunks = responseText.split(/(?=[\s\S])/); // Split by char for smooth effect

        // Resume logic: Skip already sent chunks
        if (startIndex >= chunks.length) {
             // Already done
             controller.enqueue(encoder.encode('data: [DONE]\n\n'));
             controller.terminate();
             return;
        }

        for (let i = startIndex; i < chunks.length; i++) {
          const chunk = chunks[i];
          
          // Simulate network jitter
          if (Math.random() < 0.1) {
             await new Promise((resolve) => setTimeout(resolve, 50));
          }
          
          // OpenAI format with ID for resume support
          sendEvent({
            id: i.toString(), // Assign sequence ID
            choices: [{ delta: { content: chunk } }]
          });
        }

        // Send [DONE]
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.terminate();
      },
    });

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
