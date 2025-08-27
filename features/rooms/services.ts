import { db } from "@/db";
import { describables, entities, navigables } from "@/db/schema";
import type { ExitConfig, NewRoom, Room, UpdatedRoom } from "./types";
import { and, eq } from "drizzle-orm";
import { entranceByDirection } from "./utils";

/**
 * Create a new room for a game.
 *
 * @param newRoom the data of the new room
 * @returns the created room
 *
 * @throws if `newRoom.gameId` is invalid
 */
export async function createRoom(newRoom: NewRoom): Promise<Room> {
  const game = await db.query.games.findFirst({
    where: (games, { eq }) => eq(games.id, newRoom.gameId),
  });
  if (game === undefined) {
    throw new Error(`No game found with ID: ${newRoom.gameId}`);
  }

  const [entity] = await db
    .insert(entities)
    .values({ gameId: game.id, updatedAt: new Date() })
    .returning();
  const [[describable], [navigable]] = await Promise.all([
    db
      .insert(describables)
      .values({
        ...newRoom.describable,
        entityId: entity.id,
        gameId: game.id,
        updatedAt: new Date(),
      })
      .returning(),
    db
      .insert(navigables)
      .values({
        ...newRoom.navigable,
        entityId: entity.id,
        gameId: game.id,
        updatedAt: new Date(),
      })
      .returning(),
  ]);

  const room = {
    ...entity,
    describable,
    navigable,
  };
  return room;
}

/**
 * Get all the rooms in a game.
 *
 * @param gameId the game ID
 * @returns a list of rooms in the game
 */
export async function getAllRooms(gameId: number): Promise<Room[]> {
  const result = await db
    .select()
    .from(entities)
    .innerJoin(describables, eq(entities.id, describables.entityId))
    .innerJoin(navigables, eq(entities.id, navigables.entityId))
    .where(eq(entities.gameId, gameId));
  const rooms = result.map((row) => ({
    ...row.entities,
    describable: row.describables,
    navigable: row.navigables,
  }));
  return rooms;
}

/**
 * Get all the game rooms with their entities.
 *
 * @param gameId the game ID
 * @returns a list of rooms in the game, each with its entities
 */
// export async function getAllRoomsWithEntities(gameId: number) {
//   const roomsWithEntities = await db.query.rooms.findMany({
//     where: (rooms, { eq }) => eq(rooms.gameId, gameId),
//     with: {
//       entities: true,
//     },
//   });
//   return roomsWithEntities;
// }

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
  const entityQuery = db.query.entities.findFirst({
    where: (entities, { and, eq }) =>
      and(eq(entities.gameId, gameId), eq(entities.id, roomId)),
  });
  const describableQuery = db.query.describables.findFirst({
    where: (describables, { and, eq }) =>
      and(eq(describables.gameId, gameId), eq(describables.entityId, roomId)),
  });
  const navigableQuery = db.query.navigables.findFirst({
    where: (navigables, { and, eq }) =>
      and(eq(navigables.gameId, gameId), eq(navigables.entityId, roomId)),
  });

  const [entity, describable, navigable] = await Promise.all([
    entityQuery,
    describableQuery,
    navigableQuery,
  ]);
  if (
    entity === undefined ||
    describable === undefined ||
    navigable === undefined
  ) {
    return undefined;
  }

  const room = { ...entity, describable, navigable };
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
  let candidateNavigables = await db.query.navigables.findMany({
    where: (navigables, { and, eq, isNull, or }) =>
      and(
        eq(navigables.gameId, gameId),
        or(isNull(navigables[entrance]), eq(navigables.entityId, roomId))
      ),
  });

  const destinationId = room.navigable[options.direction];
  if (destinationId !== null) {
    const destinationNavigable = await db.query.navigables.findFirst({
      where: (navigables, { eq }) => eq(navigables.entityId, destinationId),
    });
    if (destinationNavigable !== undefined) {
      candidateNavigables = [...candidateNavigables, destinationNavigable];
    }
  }

  const loopsDisabled = !options.loops;
  if (loopsDisabled) {
    candidateNavigables = candidateNavigables.filter(
      (c) => c.entityId !== roomId
    );
  }

  const candidates: Room[] = [];
  const candidateIds = candidateNavigables.map((c) => c.entityId);
  for (const id of candidateIds) {
    const candidateRoom = await getRoomById(gameId, id);
    if (candidateRoom !== undefined) {
      candidates.push(candidateRoom);
    }
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

  const exit = options.direction;
  const entrance = entranceByDirection[exit];
  if (options.destinationId !== null) {
    const destination = await getRoomById(gameId, options.destinationId);
    if (destination === undefined || destination.navigable[entrance] !== null) {
      return room;
    }
  }

  await db.transaction(async (tx) => {
    const existingDestinationId = room.navigable[exit];
    if (existingDestinationId !== null) {
      await tx
        .update(navigables)
        .set({ [entrance]: null })
        .where(
          and(
            eq(navigables.gameId, gameId),
            eq(navigables.entityId, existingDestinationId)
          )
        );
    }

    if (options.destinationId !== null) {
      await tx
        .update(navigables)
        .set({ [entrance]: roomId })
        .where(
          and(
            eq(navigables.gameId, gameId),
            eq(navigables.entityId, options.destinationId)
          )
        );
    }

    await tx
      .update(navigables)
      .set({ [exit]: options.destinationId })
      .where(
        and(eq(navigables.gameId, gameId), eq(navigables.entityId, roomId))
      );
  });

  return getRoomById(gameId, roomId);
}

// /**
//  * Update a room by its ID.
//  *
//  * @param gameId the game ID
//  * @param roomId the room ID
//  * @param updatedRoom the updated data for the room
//  * @returns the updated room
//  */
// export async function updateRoomById(
//   gameId: number,
//   roomId: number,
//   updatedRoom: UpdatedRoom
// ): Promise<Room | undefined> {
//   const [room] = await db
//     .update(rooms)
//     .set(updatedRoom)
//     .where(and(eq(rooms.gameId, gameId), eq(rooms.id, roomId)))
//     .returning();
//   return room;
// }
