import { describables, entities, games, navigables } from "@/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

/** Validation schema for a game. */
export const gameSchema = createSelectSchema(games);

/** Validation schema for a describable. */
export const describableSchema = createSelectSchema(describables);

export const newDescribableSchema = createInsertSchema(describables, {
  name: (schema) => schema.min(1, "Name cannot be empty"),
  description: (schema) => schema.min(1, "Description cannot be empty"),
}).omit({
  updatedAt: true,
});

export const updatedDescribableSchema = createUpdateSchema(describables).omit({
  updatedAt: true,
});

export const entitySchema = createSelectSchema(entities);

export const newEntitySchema = createInsertSchema(entities).omit({
  updatedAt: true,
});

/** Validation schema for a navigable. */
export const navigableSchema = createSelectSchema(navigables);

export const newNavigableSchema = createInsertSchema(navigables).omit({
  updatedAt: true,
});

export const updatedNavigableSchema = createUpdateSchema(navigables).omit({
  updatedAt: true,
});

/** Validation schema for a game graph. */
export const gameGraphSchema = gameSchema.extend({
  describables: z.array(describableSchema),
  navigables: z.array(navigableSchema),
});
