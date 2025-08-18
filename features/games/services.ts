import { db } from "@/db";
import { Game } from "./types";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";

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
 * Set the start room for a game.
 *
 * @param gameId the game ID
 * @param roomId the room ID
 * @returns the updated game if the operation succeeds, `undefined` otherwise
 */
export async function setGameStartRoom(
  gameId: number,
  roomId: number
): Promise<Game | undefined> {
  const room = await db.query.rooms.findFirst({
    where: (rooms, { and, eq }) =>
      and(eq(rooms.gameId, gameId), eq(rooms.id, roomId)),
  });
  if (room === undefined) {
    return undefined;
  }

  const game = await getGameById(gameId);
  if (game === undefined) {
    return undefined;
  }

  const [updatedGame] = await db
    .update(games)
    .set({ startRoomId: roomId })
    .where(eq(games.id, gameId))
    .returning();
  return updatedGame;
}
