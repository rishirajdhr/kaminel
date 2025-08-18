import { Button } from "@/components/ui/button";
import { getGameById } from "@/features/games/services";
import { Play } from "lucide-react";
import Link from "next/link";

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
      <section className="max-w-lg space-y-4">
        <h1 className="text-6xl font-semibold tracking-tighter">{game.name}</h1>
        <p className="font-light text-gray-700">{game.description}</p>
        <Button variant="outline" asChild>
          <Link href={`/game/${gameId}/play`}>
            <Play className="text-gray-800" />
            <span className="text-gray-800">Play</span>
          </Link>
        </Button>
      </section>
    </main>
  );
}
