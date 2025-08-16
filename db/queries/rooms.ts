import { db } from "@/db";
import { rooms } from "@/db/schema";
import type {
  Direction,
  Exit,
  ExitConfig,
  NewRoom,
  Room,
} from "@/features/rooms/types";

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
 * @param direction the exit direction
 * @returns list of room candidates
 */
export async function getRoomExitCandidates(
  id: number,
  direction: Direction,
  options?: ExitConfig
): Promise<Room[]> {
  const room = await getRoomById(id);
  if (room === undefined) {
    return [];
  }

  const leadsTo: Record<Direction, Exit> = {
    north: "southExit",
    south: "northExit",
    east: "westExit",
    west: "eastExit",
  };

  const entrance = leadsTo[direction];
  let candidates = await db.query.rooms.findMany({
    where: (rooms, { eq, isNull, or }) =>
      or(isNull(rooms[entrance]), eq(rooms.id, id)),
  });

  const exit: Exit = `${direction}Exit`;
  if (room[exit] !== null) {
    const destination = await getRoomById(room[exit]);
    if (destination === undefined) {
      return [];
    }
    candidates = [...candidates, destination];
  }

  const loopsDisabled = !options?.loops;
  if (loopsDisabled) {
    candidates = candidates.filter((c) => c.id !== id);
  }

  return candidates;
}
