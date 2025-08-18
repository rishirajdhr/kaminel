import Link from "next/link";
import { getGameById } from "../services";

export async function GameCard(props: { gameId: number }) {
  const game = await getGameById(props.gameId);
  if (game === undefined) {
    return null;
  }

  return (
    <div className="w-lg space-y-4 rounded-md border border-gray-300/20 p-8 shadow">
      <h2 className="text-left text-4xl font-semibold tracking-tight">
        {game.name}
      </h2>
      <p className="text-justify text-sm text-gray-700">{game.description}</p>
      <div className="w-fit">
        <Link
          className="rounded-sm border border-gray-800 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 active:bg-gray-100"
          href={`/game/${game.id}`}
        >
          Go to game
        </Link>
      </div>
    </div>
  );
}
