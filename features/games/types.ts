import { z } from "zod";
import { gameSchema } from "./schema";

export type Game = z.infer<typeof gameSchema>;
