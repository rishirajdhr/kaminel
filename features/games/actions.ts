"use server";

import { revalidatePath } from "next/cache";
import { setGameStartRoom } from "./services";
import { Game } from "./types";

/**
 * Update the start room for a game.
 *
 * @param gameId the game ID
 * @param roomId the room ID
 * @returns the updated game if it exists, `undefined` otherwise
 *
 * @throws if a database operation fails.
 */
export async function updateGameStartRoom(
  gameId: number,
  roomId: number
): Promise<Game | undefined> {
  const game = await setGameStartRoom(gameId, roomId);
  if (game !== undefined) {
    revalidatePath(`/game/${gameId}`);
    revalidatePath(`/game/${gameId}/room/${roomId}`);
  }
  return game;
}
