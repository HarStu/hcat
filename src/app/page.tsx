import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <h1>
          Welcome to the interactive post-watergate experience
        </h1>
        <div>
          As a trusted staff, it is up to you to convince our 37th president to step down in the wake of the Watergate Scandal. Best of luck.
        </div>
        <Link className="outline" href="/chat">
          step into the oval office...
        </Link>
      </main>
    </HydrateClient>
  );
}