import { rooms } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Validation schema for new rooms. Ensures that input has all the fields
 * necessary to create a new room.
 */
export const newRoomSchema = createInsertSchema(rooms);

/**
 * Validation schema for a game room.
 */
export const roomSchema = createSelectSchema(rooms);
