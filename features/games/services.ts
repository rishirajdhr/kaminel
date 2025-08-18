import { db } from "@/db";
import { Game } from "./types";

/**
 * Get a game by its ID.
 *
 * @param gameId the game ID
 * @returns the game if found, `undefined` otherwise
 */
export async function getGameById(gameId: number): Promise<Game | undefined> {
  const game = await db.query.games.findFirst({
    where: (games, { eq }) => eq(games.id, gameId),
  });
  return game;
}
