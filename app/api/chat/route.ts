import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const result = await streamText({
      // Dùng Model được gửi từ ChatInterface (gpt-4o cho Pro, gpt-4-turbo cho Flash)
      model: openai(model || 'gpt-4o'),
      system: `You are Gemini Pro, a helpful AI assistant. 
      When asked for an invoice, always end your response with this JSON block: 
      [DATA]{"customer": "Customer Name", "items": [{"desc": "Item Name", "price": 123}]}[/DATA]`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to connect to OpenAI" }), { status: 500 });
  }
}