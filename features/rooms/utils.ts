import type { Direction } from "@/game/behaviors";

export const entranceByDirection: Record<Direction, Direction> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};
