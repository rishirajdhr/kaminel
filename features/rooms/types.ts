import { z } from "zod";
import {
  directionSchema,
  exitConfigSchema,
  newRoomSchema,
  roomSchema,
  updatedRoomSchema,
} from "./schema";

/** Represents an existing room in the game. */
export type Room = z.infer<typeof roomSchema>;

/** Represents the subset of data needed to create a room. */
export type NewRoom = z.infer<typeof newRoomSchema>;

/** Represents the subset of data needed to update a room. */
export type UpdatedRoom = z.infer<typeof updatedRoomSchema>;

/** Represents the set of possible exits in a room. */
export type Exit = Extract<keyof Room, `${string}Exit`>;

/** Represents the set of possible directions in the game. */
export type Direction = z.infer<typeof directionSchema>;

/** Represents the set of exit configuration options. */
export type ExitConfig = z.infer<typeof exitConfigSchema>;
