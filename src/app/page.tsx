import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-col items-center">
        <h1 className="font-bold">
          Welcome to the interactive post-watergate experience
        </h1>
        <div>
          As a trusted staffer, it is up to you to convince our 37th president to step down in the wake of the Watergate scandal. Best of luck.
        </div>
        <Link className="outline" href="/chat">
          step into the oval office...
        </Link>
      </main>
    </HydrateClient>
  );
}