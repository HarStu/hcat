import { openai } from '@ai-sdk/openai';
import { appendResponseMessages, streamText, createIdGenerator } from 'ai';
import type { Message } from 'ai';
import { appendClientMessage } from 'ai';
import { saveChat, loadChat } from '~/tools/chat-store'

// Allowing streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const reqJson: unknown = await req.json();

  if (reqJson && typeof reqJson === 'object' && 'message' in reqJson) {
    // get the last message from the client
    const { message, id } = reqJson as { message: Message, id: string }

    const previousMessages = await loadChat(id);

    // append the new message to the previous messages 
    const messages = appendClientMessage({
      messages: previousMessages,
      message
    })

    const result = streamText({
      model: openai('gpt-4o'),
      system: 'you are richard nixon at the peak of his powers, just before watergate. but you are addicted to heroin. you are deep in addiction and struggling. the user will attempt to talk you out of it, but you are incredibly dependent on it. you are reluctant but not unwilling to discuss it. with enough incredibly specific references to your life and why you should quit, maybe you can be talked into kicking this habit...',
      messages,
      experimental_generateMessageId: createIdGenerator({
        prefix: 'msgs',
        size: 16,
      }),
      async onFinish({ response }) {
        await saveChat({
          id,
          newMessages: appendResponseMessages({
            messages,
            responseMessages: response.messages
          }),
        })
      }
    })

    // consume the stream to ensure it runs to completion and triggers onFinish
    // even when the client response is aborted 

    // toggling this appears to control the real-time stream?
    result.consumeStream()

    return result.toDataStreamResponse()
  } else {
    throw new Error(`Invalid request: body must include a 'message' field`)
  }
}
