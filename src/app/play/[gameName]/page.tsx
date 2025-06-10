export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation';
import { createChat } from '~/tools/chat-store';
import Link from 'next/link'

import type { Game } from '~/lib/games';
import { gameConfigs } from '~/lib/games';

export default async function Page(props: { params: Promise<{ gameName: string }> }) {
  const { gameName } = await props.params
  const game = gameConfigs.find((config) => {
    console.log(`Looking at config: ${JSON.stringify(config)}`)
    console.log(`The name of this game is: ${config.name}, which we are comparing to: ${gameName}`)
    return config.name === gameName
  })

  if (game === undefined) {
    return (
      <div>
        <div>
          error, invalid link to game
        </div>
        <Link className="outline" href="/">
          return to lobby
        </Link>
      </div>
    )
  } else {
    const id = await createChat(game)
    redirect(`/chat/${id}`)
  }
}



