'use client'
import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import type { Message } from '@ai-sdk/react'
import { createIdGenerator } from 'ai'
import { Spinner } from './ui/spinner'
import clsx from 'clsx'

type ChatProps = {
  id?: string | undefined
  initialMessages?: Message[]
}
export default function Chat(chatProps: ChatProps = {}) {
  const { messages, input, handleInputChange, handleSubmit, status, stop, error, reload } = useChat({
    id: chatProps.id,
    initialMessages: chatProps.initialMessages,
    sendExtraMessageFields: true,
    generateId: createIdGenerator({
      prefix: 'msgc',
      size: 16,
    }),
    maxSteps: 1,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'winTheGame') {
        console.log("You win")
        setGameState('win')
        return true
      } else if (toolCall.toolName == 'loseTheGame') {
        console.log("You lose")
        setGameState('lose')
      }
    },
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id }
    }
  })

  type GameState = 'win' | 'lose' | 'playing'
  const [gameState, setGameState] = useState<GameState>('playing')

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    console.log('full messages content')
    for (const msg of messages) {
      if (msg.toolInvocations) {
        for (const toolUse of msg.toolInvocations) {
          if (toolUse.toolName == 'winTheGame') {
            setGameState('win')
          } else if (toolUse.toolName == 'loseTheGame') {
            setGameState('lose')
          }
        }
      }
    }
  }, [messages])

  const buttonClass = 'flex px-2 min-w-16 border rounded items-center justify-center'
  let messagesContainerClass = 'flex-1 border rounded p-4 mb-0 mt-4 overflow-y-auto transition-all duration-900 ease-in-out'
  let inputPrompt = "Say something..."

  // Configure the UI based on gameState
  if (gameState == 'win') {
    messagesContainerClass += ' border-green-500'
    inputPrompt = "You Win!"
  } else if (gameState == 'lose') {
    messagesContainerClass += ' border-red-500'
    inputPrompt = "You Lose!"
  }

  const generating = (status === 'submitted' || status === 'streaming')

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-screen bg-background">
      <div className={clsx(messagesContainerClass)}>
        {messages.map(m => (
          <div key={m.id} className="mb-4">
            <strong>{m.role}: </strong>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={clsx('flex items-center transition-all duration-300 ease-in-out h-4', generating ? 'opacity-100 h-8 p-1' : 'opacity-0')} >
        <Spinner />
      </div>

      {
        error && (
          <div>
            <div>
              error communicating with AI
            </div>
            <button type='button' className={buttonClass} onClick={() => reload()}>
              retry
            </button>
          </div >
        )
      }

      <form onSubmit={handleSubmit} className="flex gap-2 pb-6 justify-end">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder={inputPrompt}
          className="flex-1 p-2 border rounded"
          disabled={error !== null && gameState !== 'playing'}
        />
        {(status === 'ready') ?
          (<button type='submit' className={buttonClass}>send</button>) :
          (<button type='button' className={buttonClass} onClick={() => stop()}>cancel</button>)
        }

      </form>
    </div >
  )
}