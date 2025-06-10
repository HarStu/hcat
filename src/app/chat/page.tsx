export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation';
import { createChat } from '~/tools/chat-store';
import Link from 'next/link'

import type { Game } from '~/lib/games';
import { gameConfigs } from '~/lib/games';

export default async function Page() {
  return (
    <div>
      Error, you shouldn't be here
    </div>
  )
}
