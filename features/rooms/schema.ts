import { z } from "zod";
import {
  describableSchema,
  entitySchema,
  navigableSchema,
  newDescribableSchema,
  newEntitySchema,
  newNavigableSchema,
  updatedDescribableSchema,
  updatedNavigableSchema,
} from "../games/schema";
import { directions } from "@/game/behaviors";

/**
 * Validation schema for a game room.
 */
export const roomSchema = entitySchema.extend({
  describable: describableSchema,
  navigable: navigableSchema,
});

/**
 * Validation schema for new rooms. Ensures that input has all the fields
 * necessary to create a new room.
 */
export const newRoomSchema = newEntitySchema.extend({
  describable: newDescribableSchema.omit({ entityId: true }),
  navigable: newNavigableSchema.omit({ entityId: true }),
});

/**
 * Validation schema for updated rooms. Ensures that input has all the fields
 * necessary to update an existing room.
 */
export const updatedRoomSchema = z.object({
  describable: updatedDescribableSchema,
  navigable: updatedNavigableSchema,
});

/** Validation schema for exit configuration options. */
export const exitConfigSchema = z.object({
  /** The direction of the exit. */
  direction: z.enum(directions),

  /** The exit destination ID if it exists, `null` otherwise. */
  destinationId: entitySchema.shape.id.nullable(),

  /** `true` if the exit can loop back into the room, `false` otherwise. */
  loops: z.boolean().optional(),
});
