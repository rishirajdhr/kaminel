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
