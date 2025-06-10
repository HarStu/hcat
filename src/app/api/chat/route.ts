import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { appendResponseMessages, streamText, createIdGenerator } from 'ai';
import type { Message } from 'ai';
import { appendClientMessage } from 'ai';
import { saveChat, loadChat } from '~/tools/chat-store'
import { z } from 'zod';

import { model_tools } from '~/lib/model_tools'
import type { ToolName } from '~/lib/model_tools'

// Allowing streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const reqJson: unknown = await req.json();

  if (reqJson && typeof reqJson === 'object' && 'message' in reqJson) {
    // get the last message from the client
    const { message, id } = reqJson as { message: Message, id: string }

    // grab previous messages and the prompt for the game
    const [previousMessages, gamePrompt, requiredTools] = await loadChat(id);

    // append the new message to the previous messages 
    const messages = appendClientMessage({
      messages: previousMessages,
      message
    })

    // configure the model to use
    const PROVIDER = process.env.PROVIDER
    let model = undefined
    if (PROVIDER === 'google') {
      model = google('gemini-2.0-flash')
    } else if (PROVIDER === 'openai') {
      model = openai('gpt-4o-mini')
    } else {
      throw new Error('No valid model provider configured!')
    }

    // setup the tools available to the model
    const toolList = Object.entries(model_tools)
    const filteredToolList = toolList.filter(tool => requiredTools.includes(tool[0] as ToolName))
    const useTools = Object.fromEntries(filteredToolList)

    console.log(`System has access to the following tools: ${JSON.stringify(useTools)}`)

    const result = streamText({
      model: model,
      system: gamePrompt,
      messages,
      tools: useTools,
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
