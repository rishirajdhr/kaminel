"use server";

import { revalidatePath } from "next/cache";
import { createRoom, setRoomExit } from "./services";
import type { ExitConfig, NewRoom } from "./types";
import { newRoomSchema } from "./schema";
import { redirect } from "next/navigation";

/**
 * Creates a new room and redirects to it upon success.
 *
 * @param newRoom data of the new room to be created
 * @returns Never returns; always redirects to the new room URL.
 *
 * @throws If data validation fails or database operation fails
 * @throws {NEXT_REDIRECT} On successful creation (expected behavior)
 */
export async function addRoom(newRoom: NewRoom) {
  const roomToInsert = newRoomSchema.parse(newRoom);
  const room = await createRoom(roomToInsert);
  revalidatePath(`/game/${room.gameId}`);
  redirect(`/game/${room.gameId}/room/${room.id}`);
}

/**
 * Update the exit for a room in the game.
 *
 * @param gameId the game ID
 * @param roomId the room ID
 * @param options the configuration describing the new exit
 * @returns the updated room
 *
 * @throws If no room with the given `id` is found.
 * @throws If any database operation fails.
 */
export async function updateRoomExit(
  gameId: number,
  roomId: number,
  options: ExitConfig
) {
  const room = await setRoomExit(gameId, roomId, options);
  if (room === undefined) {
    throw new Error("No room found");
  }
  revalidatePath(`/game/${gameId}/room/${roomId}`);
  return room;
}
