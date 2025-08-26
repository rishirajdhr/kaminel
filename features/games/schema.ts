import { describables, games, navigables } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/** Validation schema for a game. */
export const gameSchema = createSelectSchema(games);

/** Validation schema for a describable. */
export const describableSchema = createSelectSchema(describables);

/** Validation schema for a navigable. */
export const navigableSchema = createSelectSchema(navigables);

/** Validation schema for a game graph. */
export const gameGraphSchema = gameSchema.extend({
  describables: z.array(describableSchema),
  navigables: z.array(navigableSchema),
});
