import { z } from "zod";
import { newRoomSchema, roomSchema } from "./schema";

/** Represents an existing room in the game. */
export type Room = z.infer<typeof roomSchema>;

/** Represents the subset of data needed to create a room. */
export type NewRoom = z.infer<typeof newRoomSchema>;

/** Represents the set of possible exits in a room. */
export type Exit = Extract<keyof Room, `${string}Exit`>;

/** Represents the set of possible directions in the game. */
export type Direction = Exit extends `${infer D}Exit` ? D : never;

/** Represents the set of exit configuration options. */
export type ExitConfig = {
  /** `true` if the exit can loop back into the room, `false` otherwise */
  loops?: boolean;
};
