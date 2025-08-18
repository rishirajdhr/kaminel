import { games } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";

/** Validation schema for a game. */
export const gameSchema = createSelectSchema(games);
