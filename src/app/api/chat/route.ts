import { openai } from '@ai-sdk/openai';
import { appendResponseMessages, streamText, createIdGenerator } from 'ai';
import type { Message } from 'ai';
import { appendClientMessage } from 'ai';
import { saveChat, loadChat } from '~/tools/chat-store'
import { z } from 'zod';

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
      model: openai('gpt-4o-mini'),
      system: 'when the user asks, please use your winTheGame tool. Do not use it unless the player asks.',
      messages,
      tools: {
        winTheGame: {
          description: "Execute when the player has won the game being played",
          parameters: z.object({}),
          execute: async ({ }) => {
            return true
          }
        },
      },
      experimental_generateMessageId: createIdGenerator({
        prefix: 'msgs',
        size: 16,
      }),
      onChunk({ chunk }) {
        console.log(chunk)
      },
      async onFinish({ response }) {
        console.log(response)
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
