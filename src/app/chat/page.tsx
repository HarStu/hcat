export const dynamic = 'force-dynamic'

import { redirect, useSearchParams } from 'next/navigation';
import { createChat } from '~/tools/chat-store';
import Link from 'next/link'

import type { Game } from '~/lib/games';
import { gameConfigs } from '~/lib/games';

export default async function Page() {
  const searchParams = useSearchParams()
  const gameName = searchParams.get('gameName')

  const game = gameConfigs.find((config) => config.name === gameName)

  if (game == undefined) {
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
