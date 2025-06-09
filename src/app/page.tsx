import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <div>
          Welcome to Richard Nixon's Heroin Addiction Simulator. Powered by Hcat.
        </div>
        <div>
          To proceed with your goal of trying to convince 'tricky dick' to quit his dope habit, please click below:
        </div>
        <Link href="/chat">
          here!
        </Link>
      </main>
    </HydrateClient>
  );
}