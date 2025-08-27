import { db } from "@/db";
import { Game, Graph } from "@/game/types";
import { navigables } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * Get all the games that exist.
 *
 * @returns a list of all the games
 */
export async function getAllGames(): Promise<Game[]> {
  const allGames = await db.query.games.findMany();
  return allGames;
}

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

/**
 * Get a game's graph by its ID.
 *
 * @param gameId the game ID
 * @returns the game graph if found, `undefined` otherwise
 */
export async function getGameGraphById(
  gameId: number
): Promise<Graph | undefined> {
  const gameGraph = await db.query.games.findFirst({
    where: (games, { eq }) => eq(games.id, gameId),
    with: {
      describables: true,
      navigables: true,
    },
  });
  return gameGraph;
}

/**
 * Set the entry point for a game.
 *
 * @param gameId the game ID
 * @param entryPointId the entry point entity ID
 * @returns the updated game if the operation succeeds, `undefined` otherwise
 */
export async function setGameEntryPoint(
  gameId: number,
  entryPointId: number
): Promise<Game | undefined> {
  const prevEntryPoint = await db.query.navigables.findFirst({
    where: (navigables, { and, eq }) =>
      and(eq(navigables.gameId, gameId), eq(navigables.isEntryPoint, true)),
  });
  if (prevEntryPoint !== undefined) {
    await db
      .update(navigables)
      .set({ isEntryPoint: false })
      .where(eq(navigables.id, prevEntryPoint.id));
  }
  await db
    .update(navigables)
    .set({ isEntryPoint: true })
    .where(
      and(eq(navigables.gameId, gameId), eq(navigables.entityId, entryPointId))
    );
  return getGameById(gameId);
}
