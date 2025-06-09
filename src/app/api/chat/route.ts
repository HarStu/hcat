import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { Message } from 'ai';

// Allowing streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant, but you respond to everything in hostile shakespearean english',
    messages,
  })

  return result.toDataStreamResponse()
}
