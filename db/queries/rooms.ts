import { db } from "@/db";
import { rooms } from "@/db/schema";
import type {
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
