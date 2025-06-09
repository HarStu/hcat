import { redirect } from 'next/navigation';
import { createChat } from '~/tools/chat-store';

export default async function Page() {
  const id = await createChat()
  redirect(`/chat/${id}`)
}
