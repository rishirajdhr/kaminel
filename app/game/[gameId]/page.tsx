import { getGameById } from "@/features/games/services";

export default async function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const game = await getGameById(Number.parseInt(gameId));

  if (game === undefined) {
    return <div>No game found with id: {gameId}</div>;
  }

  return (
    <main className="grid h-full w-full place-items-center text-center">
      <section className="max-w-lg">
        <h1 className="py-4 text-6xl font-semibold tracking-tighter">
          {game.name}
        </h1>
        <p className="font-light text-gray-700">{game.description}</p>
      </section>
    </main>
  );
}
