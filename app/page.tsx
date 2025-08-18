import { GameCard } from "@/features/games/components/game-card";
import { getAllGames } from "@/features/games/services";

export default async function Home() {
  const games = await getAllGames();

  return (
    <main className="grid w-full place-items-center text-center">
      <section>
        <h1 className="mb-8 text-8xl font-bold">Adventure Game Engine</h1>
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} gameId={game.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
