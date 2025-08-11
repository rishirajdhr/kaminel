import { createInsertSchema, CreateInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { rooms } from "@/db/schema";

export const addRoomFormSchema = createInsertSchema(rooms, {
  name: (schema) => schema.min(1),
});

export type AddRoomFormData = z.infer<typeof addRoomFormSchema>;
