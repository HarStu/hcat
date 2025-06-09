import { Loader2 } from 'lucide-react'

type SpinnerProps = {
  message?: string
}
export function Spinner({ message }: SpinnerProps) {
  return (
    <div className='flex items-center gap-2 px-4 py-2'>
      <Loader2 className="h-4 w-4 animate-spin" />
      {message && <div>{message}</div>}
    </div>
  )
}