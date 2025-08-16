import { z } from "zod";
import { roomSchema } from "./schema";

export type Room = z.infer<typeof roomSchema>;
