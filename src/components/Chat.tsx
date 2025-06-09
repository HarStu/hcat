'use client'
import { useChat } from 'ai/react'
import { Spinner } from './ui/spinner'
import clsx from 'clsx'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status, stop, error, reload } = useChat()

  const buttonClass = 'flex px-2 min-w-16 border rounded items-center justify-center'
  const messagesContainerClass = 'flex-1 border rounded p-4 mb-0 mt-4 overflow-y-auto transition-all duration-900 ease-in-out'

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
          placeholder="Say something..."
          className="flex-1 p-2 border rounded"
          disabled={error != null}
        />
        {(status === 'ready') ?
          (<button type='submit' className={buttonClass}>send</button>) :
          (<button type='button' className={buttonClass} onClick={() => stop()}>cancel</button>)
        }

      </form>
    </div >
  )
}