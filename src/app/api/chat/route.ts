import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { Message } from 'ai';

// Allowing streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const reqJson: unknown = await req.json();

  if (reqJson && typeof reqJson === 'object' && 'messages' in reqJson) {
    const { messages } = reqJson as { messages: Message[] }

    const result = streamText({
      model: openai('gpt-4o'),
      system: 'You are a helpful assistant, but you respond to everything in hostile shakespearean english',
      messages,
    })
    return result.toDataStreamResponse()
  } else {
    throw new Error(`Request ${req} resolved to invalid JSON`)
  }
}
