import { z } from "zod";

const exitSchema = z.number().nullable();

export const roomSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  name: z.string(),
  description: z.string(),
  northExit: exitSchema,
  southExit: exitSchema,
  eastExit: exitSchema,
  westExit: exitSchema,
});
