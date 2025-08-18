import { z } from "zod";
import { gameSchema } from "./schema";
import { Room } from "../rooms/types";
import { Entity } from "../entities/types";

export type Game = z.infer<typeof gameSchema>;

export type GameGraph = Game & {
  rooms: Array<Room & { entities: Array<Entity> }>;
};
