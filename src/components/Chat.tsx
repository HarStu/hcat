'use client'
import { useChat } from 'ai/react'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } = useChat()

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
          {status === 'submitted' && <div>*</div>}
          <button type='button' onClick={() => stop()}>
            cancel
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 py-8 justify-end">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}