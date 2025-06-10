import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";
import { gameConfigs } from "~/lib/games";
import type { Game } from "~/lib/games";


function GameLink({ game }: { game: Game }) {
  return (
    <div>
      <div>
        {game.name}
      </div>
      <div>
        {game.description}
      </div>
      <Link className="outline" href={{ pathname: "/chat", query: { gameName: game.name } }}>
        play!
      </Link>
    </div >
  )
}

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-col items-center">
        <h1 className="font-bold">
          Welcome to Hcat
        </h1>
        <div>
          the following games are available to play...
        </div>
        <div>
          {gameConfigs.map((game, index) => {
            return <GameLink key={index} game={game} />
          })}
        </div>
      </main>
    </HydrateClient>
  );
}