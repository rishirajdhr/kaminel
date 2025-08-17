import { entities } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Validation schema for an entity. Ensures that input has all the fields
 * necessary to describe an entity.
 */
export const entitySchema = createSelectSchema(entities);

/**
 * Validation schema for a new entity. Ensures that input has all the fields
 * necessary to create a new entity.
 */
export const newEntitySchema = createInsertSchema(entities, {
  name: (schema) => schema.min(1),
});
