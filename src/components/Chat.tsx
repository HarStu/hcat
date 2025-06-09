'use client'
import { useChat } from 'ai/react'
import { Spinner } from './ui/spinner'

export function Chat() {
  const { messages, setMessages, input, handleInputChange, handleSubmit, status, stop, error, reload } = useChat()

  const buttonClass = 'flex px-2 border rounded items-center'

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-screen">
      <div className="flex-1 overflow-y-auto">
        {messages.map(m => (
          <div key={m.id} className="mb-4">
            <strong>{m.role}: </strong>
            {m.content}
          </div>
        ))}
      </div>

      {(status === 'submitted' || status === 'streaming') && (
        <div>
          <button type='button' className={buttonClass} onClick={() => stop()}>
            cancel
          </button>
        </div>
      )}

      {error && (
        <div>
          <div>
            error communicating with AI
          </div>
          <button type='button' className={buttonClass} onClick={() => reload()}>
            retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 py-8 justify-end">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          className="flex-1 p-2 border rounded"
          disabled={error != null}
        />
        {(status === 'ready') ?
          (<button type='submit' className={buttonClass}>Send</button>) :
          (<Spinner />)
        }

      </form>
    </div >
  )
}