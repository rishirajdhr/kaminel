import { db } from "@/db";
import { rooms } from "@/db/schema";
import type {
  Exit,
  ExitConfig,
  NewRoom,
  Room,
  UpdatedRoom,
} from "@/features/rooms/types";
import { eq } from "drizzle-orm";
import { entranceByDirection } from "./utils";

/**
 * Create a new room.
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
 * @returns a list of rooms in the game
 */
export async function getAllRooms(): Promise<Room[]> {
  const rooms = await db.query.rooms.findMany();
  return rooms;
}

/**
 * Get a room by its ID.
 *
 * @param id the room ID
 * @returns the room if found, `undefined` otherwise
 */
export async function getRoomById(id: number): Promise<Room | undefined> {
  const room = await db.query.rooms.findFirst({
    where: (rooms, { eq }) => eq(rooms.id, id),
  });
  return room;
}

/**
 * Find the rooms that can be linked to a room exit.
 *
 * @param id the room ID
 * @param options the exit configuration
 * @returns list of room candidates
 */
export async function getRoomExitCandidates(
  id: number,
  options: ExitConfig
): Promise<Room[]> {
  const room = await getRoomById(id);
  if (room === undefined) {
    return [];
  }

  const entrance = entranceByDirection[options.direction];
  let candidates = await db.query.rooms.findMany({
    where: (rooms, { eq, isNull, or }) =>
      or(isNull(rooms[entrance]), eq(rooms.id, id)),
  });

  const exit: Exit = `${options.direction}Exit`;
  if (room[exit] !== null) {
    const destination = await getRoomById(room[exit]);
    if (destination === undefined) {
      return [];
    }
    candidates = [...candidates, destination];
  }

  const loopsDisabled = !options.loops;
  if (loopsDisabled) {
    candidates = candidates.filter((c) => c.id !== id);
  }

  return candidates;
}

/**
 * Set the room exit destination. Clears the exit if `options.destinationId` is
 * set to `null`.
 *
 * @param id the room ID
 * @param options the exit configuration
 * @returns the updated room
 */
export async function setRoomExit(
  id: number,
  options: ExitConfig
): Promise<Room | undefined> {
  const room = await getRoomById(id);
  if (room === undefined) {
    return room;
  }

  const entrance = entranceByDirection[options.direction];
  if (options.destinationId !== null) {
    const destination = await getRoomById(options.destinationId);
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
        .where(eq(rooms.id, existingDestination));
    }

    if (options.destinationId !== null) {
      await tx
        .update(rooms)
        .set({ [entrance]: id })
        .where(eq(rooms.id, options.destinationId));
    }

    const result = await tx
      .update(rooms)
      .set({ [exit]: options.destinationId })
      .where(eq(rooms.id, id))
      .returning();
    return result;
  });
  return updatedRoom;
}

/**
 * Update a room by its ID.
 *
 * @param id the room ID
 * @param updatedRoom the updated data for the room
 * @returns the updated room
 */
export async function updateRoomById(
  id: number,
  updatedRoom: UpdatedRoom
): Promise<Room | undefined> {
  const [room] = await db
    .update(rooms)
    .set(updatedRoom)
    .where(eq(rooms.id, id))
    .returning();
  return room;
}
