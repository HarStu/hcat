import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Chat from '~/components/Chat'

export default async function Home() {
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <Chat />
      </main>
    </HydrateClient>
  );
}
