"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { newEntitySchema } from "./schema";
import { createEntity } from "./services";
import { NewEntity } from "./types";

/**
 * Creates a new entity and redirects to it upon success.
 *
 * @param newEntity data of the new entity to be created
 * @returns Never returns; always redirects to the new entity URL.
 *
 * @throws If data validation fails or database operation fails
 * @throws {NEXT_REDIRECT} On successful creation (expected behavior)
 */
export async function addEntity(newEntity: NewEntity) {
  const entityToInsert = newEntitySchema.parse(newEntity);
  const entity = await createEntity(entityToInsert);
  revalidatePath("/");
  redirect(`/entity/${entity.id}`);
}
