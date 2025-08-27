import { Describable, Navigable } from "./behaviors";

/** Represents a game graph with all its related entities and behaviors. */
export type Graph = {
  /** The ID of the game. */
  id: number;

  /** The name of the game. */
  name: string;

  /** The description of the game. */
  description: string;

  /** The describables linked to the game. */
  describables: Array<Describable>;

  /** The navigables linked to the game. */
  navigables: Array<Navigable>;
};

export type Game = Pick<Graph, "id" | "name" | "description">;
