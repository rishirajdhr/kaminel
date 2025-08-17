import type { Direction, Exit } from "./types";

export const entranceByDirection: Record<Direction, Exit> = {
  north: "southExit",
  south: "northExit",
  east: "westExit",
  west: "eastExit",
};
