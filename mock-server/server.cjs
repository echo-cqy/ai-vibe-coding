const http = require('http');

const PORT = 4000;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const messages = JSON.parse(body).messages || [];
      const lastMsg = messages[messages.length - 1]?.content || "";
      
      console.log('Received request for:', lastMsg.slice(0, 20));

      // Simulate a long response for performance testing
      const longResponse = generateLongResponse(lastMsg);
      const chunks = longResponse.split(/(?=[\s\S])/); // Split by char

      let i = 0;
      // High speed streaming: 1ms interval
      const interval = setInterval(() => {
        if (i >= chunks.length) {
          clearInterval(interval);
          res.write(`data: [DONE]\n\n`);
          res.end();
          return;
        }

        // Batch send a few chars to simulate packet grouping, but keep it granular enough to stress test
        const packetSize = Math.floor(Math.random() * 5) + 1; 
        const chunkPart = chunks.slice(i, i + packetSize).join('');
        i += packetSize;

        if (chunkPart) {
            res.write(`data: ${JSON.stringify({ content: chunkPart })}\n\n`);
        }
      }, 2); // Very fast 2ms interval
    });

    return;
  }

  res.writeHead(404);
  res.end();
});

function generateLongResponse(input) {
  let text = `收到消息: "${input}"。\n\n这是一段用于性能测试的长文本回复。\n`;
  
  // Add Markdown structure
  text += `\n## 1. 性能测试\n我们将生成大量的 Token 来测试前端的渲染性能。\n`;
  
  // Add Code Block
  text += `\n\`\`\`javascript\n`;
  for (let i = 0; i < 50; i++) {
    text += `console.log("Line ${i}: 正在进行高频渲染测试...");\n`;
  }
  text += `\`\`\`\n`;

  // Add List
  text += `\n## 2. 列表渲染\n`;
  for (let i = 0; i < 20; i++) {
    text += `- 测试项 ${i}: 确保虚拟列表在流式更新时不会抖动。\n`;
  }

  return text;
}

server.listen(PORT, () => {
  console.log(`Mock SSE Server running at http://localhost:${PORT}`);
});
