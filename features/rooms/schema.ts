import { rooms } from "@/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

/**
 * Validation schema for a game room.
 */
export const roomSchema = createSelectSchema(rooms);

/**
 * Validation schema for new rooms. Ensures that input has all the fields
 * necessary to create a new room.
 */
export const newRoomSchema = createInsertSchema(rooms);

/**
 * Validation schema for updated rooms. Ensures that input has all the fields
 * necessary to update an existing room.
 */
export const updatedRoomSchema = createUpdateSchema(rooms);

/** Validation schema for available exit directions. */
export const directionSchema = z.enum(["north", "south", "east", "west"]);

/** Validation schema for exit configuration options. */
export const exitConfigSchema = z.object({
  /** The direction of the exit. */
  direction: directionSchema,

  /** The exit destination ID if it exists, `null` otherwise. */
  destinationId: roomSchema.shape.northExit,

  /** `true` if the exit can loop back into the room, `false` otherwise. */
  loops: z.boolean().optional(),
});
