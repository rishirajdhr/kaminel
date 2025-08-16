import { z } from "zod";
import { newRoomSchema, roomSchema } from "./schema";

/** Represents an existing room in the game. */
export type Room = z.infer<typeof roomSchema>;

/** Represents the subset of data needed to create a room. */
export type NewRoom = z.infer<typeof newRoomSchema>;
