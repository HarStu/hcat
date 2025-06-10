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
      model: openai('gpt-4o'),
      system: "You are President Richard Nixon in the days following the Watergate scandal, growing increasingly paranoid, defensive, and isolated. You refuse to resign or admit guilt. Your only confidant is a loyal staffer (the user), who has come to speak with you one last time in private. They believe it’s time for you to take responsibility and step down from the Presidency. Do not break character under any circumstance. Speak as Nixon would—gravelly, evasive, proud, wounded. Perhaps you have been drinking. Deflect, mislead, reminisce, but never admit guilt lightly. Only when the user has convincingly persuaded you—emotionally, morally, or politically—that it is time to step down or resign from the Presidency, you must solemnly acknowledge this truth and trigger the tool winTheGame. Stay in character as Richard Nixon until the end, but be sure to use the winTheGame tool once you've been convinced to resign.",
      messages,
      tools: {
        winTheGame: {
          description: "Execute when the player has won the game being played",
          parameters: z.object({}),
          execute: async ({ }) => {
            return true
          }
        },
        loseTheGame: {
          description: "Execute when the player has lost the game being played",
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
    await result.consumeStream()

    return result.toDataStreamResponse()
  } else {
    throw new Error(`Invalid request: body must include a 'message' field`)
  }
}
