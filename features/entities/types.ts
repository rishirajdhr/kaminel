import { z } from "zod";
import { entitySchema, newEntitySchema } from "./schema";

/** Represents an existing entity in the game. */
export type Entity = z.infer<typeof entitySchema>;

/** Represents the subset of data needed to create an entity. */
export type NewEntity = z.infer<typeof newEntitySchema>;
