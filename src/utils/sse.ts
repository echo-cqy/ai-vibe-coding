export const createSSEEncoder = () => {
  const encoder = new TextEncoder();
  
  return {
    encode: (data: string) => encoder.encode(`data: ${JSON.stringify({ content: data })}\n\n`),
    encodeDone: () => encoder.encode('data: [DONE]\n\n'),
  };
};
