import { games } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { roomSchema } from "../rooms/schema";
import { entitySchema } from "../entities/schema";

/** Validation schema for a game. */
export const gameSchema = createSelectSchema(games);

/** Validation schema for a game graph. */
export const gameGraphSchema = gameSchema.extend({
  rooms: z.array(roomSchema.extend({ entities: z.array(entitySchema) })),
});
