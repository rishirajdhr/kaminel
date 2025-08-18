import { db } from "@/db";
import { Entity, NewEntity } from "./types";
import { entities } from "@/db/schema";

/**
 * Create a new entity.
 *
 * @param newEntity the data of the new entity
 * @returns the created entity
 */
export async function createEntity(newEntity: NewEntity): Promise<Entity> {
  const [entity] = await db.insert(entities).values(newEntity).returning();
  return entity;
}

/**
 * Get a game entity by its ID.
 *
 * @param gameId the game ID
 * @param entityId the entity ID
 * @returns the entity if found, `undefined` otherwise
 */
export async function getEntityById(
  gameId: number,
  entityId: number
): Promise<Entity | undefined> {
  const entity = await db.query.entities.findFirst({
    where: (entities, { and, eq }) =>
      and(eq(entities.gameId, gameId), eq(entities.id, entityId)),
  });
  return entity;
}
