import { loadChat } from '~/tools/chat-store'
import Chat from '~/components/Chat'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params // get the chat ID from the url
  const messages = await loadChat(id)
  return <Chat id={id} initialMessages={messages} />
}