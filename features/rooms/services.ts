import { db } from "@/db";
import { rooms } from "@/db/schema";
import type {
  Exit,
  ExitConfig,
  NewRoom,
  Room,
  UpdatedRoom,
} from "@/features/rooms/types";
import { and, eq } from "drizzle-orm";
import { entranceByDirection } from "./utils";

/**
 * Create a new room for a game.
 *
 * @param newRoom the data of the new room
 * @returns the created room
 */
export async function createRoom(newRoom: NewRoom): Promise<Room> {
  const [room] = await db.insert(rooms).values(newRoom).returning();
  return room;
}

/**
 * Get all the rooms in a game.
 *
 * @param gameId the game ID
 * @returns a list of rooms in the game
 */
export async function getAllRooms(gameId: number): Promise<Room[]> {
  const allRooms = await db.query.rooms.findMany({
    where: (rooms, { eq }) => eq(rooms.gameId, gameId),
  });
  return allRooms;
}

/**
 * Get a game room by its ID.
 *
 * @param gameId the game ID
 * @param roomId the room ID
 * @returns the room if found, `undefined` otherwise
 */
export async function getRoomById(
  gameId: number,
  roomId: number
): Promise<Room | undefined> {
  const room = await db.query.rooms.findFirst({
    where: (rooms, { and, eq }) =>
      and(eq(rooms.gameId, gameId), eq(rooms.id, roomId)),
  });
  return room;
}

/**
 * Find the rooms in a game that can be linked to a room exit.
 *
 * @param gameId the game ID
 * @param roomId the room ID
 * @param options the exit configuration
 * @returns list of room candidates
 */
export async function getRoomExitCandidates(
  gameId: number,
  roomId: number,
  options: ExitConfig
): Promise<Room[]> {
  const room = await getRoomById(gameId, roomId);
  if (room === undefined) {
    return [];
  }

  const entrance = entranceByDirection[options.direction];
  let candidates = await db.query.rooms.findMany({
    where: (rooms, { and, eq, isNull, or }) =>
      and(
        eq(rooms.gameId, gameId),
        or(isNull(rooms[entrance]), eq(rooms.id, roomId))
      ),
  });

  const exit: Exit = `${options.direction}Exit`;
  if (room[exit] !== null) {
    const destination = await getRoomById(gameId, room[exit]);
    if (destination === undefined) {
      return [];
    }
    candidates = [...candidates, destination];
  }

  const loopsDisabled = !options.loops;
  if (loopsDisabled) {
    candidates = candidates.filter((c) => c.id !== roomId);
  }

  return candidates;
}

/**
 * Set the room exit destination. Clears the exit if `options.destinationId` is
 * set to `null`.
 *
 * @param gameId the game ID
 * @param roomId the room ID
 * @param options the exit configuration
 * @returns the updated room
 */
export async function setRoomExit(
  gameId: number,
  roomId: number,
  options: ExitConfig
): Promise<Room | undefined> {
  const room = await getRoomById(gameId, roomId);
  if (room === undefined) {
    return room;
  }

  const entrance = entranceByDirection[options.direction];
  if (options.destinationId !== null) {
    const destination = await getRoomById(gameId, options.destinationId);
    if (destination === undefined || destination[entrance] !== null) {
      return room;
    }
  }

  const exit: Exit = `${options.direction}Exit`;

  const [updatedRoom] = await db.transaction(async (tx) => {
    const existingDestination = room[exit];
    if (existingDestination !== null) {
      await tx
        .update(rooms)
        .set({ [entrance]: null })
        .where(
          and(eq(rooms.gameId, gameId), eq(rooms.id, existingDestination))
        );
    }

    if (options.destinationId !== null) {
      await tx
        .update(rooms)
        .set({ [entrance]: roomId })
        .where(
          and(eq(rooms.gameId, gameId), eq(rooms.id, options.destinationId))
        );
    }

    const result = await tx
      .update(rooms)
      .set({ [exit]: options.destinationId })
      .where(and(eq(rooms.gameId, gameId), eq(rooms.id, roomId)))
      .returning();
    return result;
  });
  return updatedRoom;
}

/**
 * Update a room by its ID.
 *
 * @param gameId the game ID
 * @param roomId the room ID
 * @param updatedRoom the updated data for the room
 * @returns the updated room
 */
export async function updateRoomById(
  gameId: number,
  roomId: number,
  updatedRoom: UpdatedRoom
): Promise<Room | undefined> {
  const [room] = await db
    .update(rooms)
    .set(updatedRoom)
    .where(and(eq(rooms.gameId, gameId), eq(rooms.id, roomId)))
    .returning();
  return room;
}
