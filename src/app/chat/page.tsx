import { redirect } from 'next/navigation';
import { createChat } from '~/tools/chat-store';

export const dynamic = "force-dynamic"

export default async function Page() {
  const id = await createChat()
  redirect(`/chat/${id}`)
}
