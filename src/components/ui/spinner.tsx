import { Loader2 } from 'lucide-react'

export function Spinner() {
  return (
    <div className='flex items-center gap-2 px-4 py-2'>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Generating response...</span>
    </div>
  )
}