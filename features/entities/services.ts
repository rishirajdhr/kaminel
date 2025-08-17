import { db } from "@/db";
import { NewEntity } from "./types";
import { entities } from "@/db/schema";

/**
 * Create a new entity.
 *
 * @param newEntity the data of the new entity
 * @returns the created entity
 */
export async function createEntity(newEntity: NewEntity) {
  const [entity] = await db.insert(entities).values(newEntity).returning();
  return entity;
}
