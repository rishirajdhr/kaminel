import { Describable, Navigable } from "./behaviors";
import { Graph } from "./types";

/** Represents the domain model for the game. */
export class GameModel {
  /** The ID of the game. */
  gameId: number;

  /** The name of the game. */
  name: string;

  /** The description of the game. */
  description: string;

  /** The describables present in the game. */
  describables: Map<number, Describable>;

  /** The navigables present in the game. */
  navigables: Map<number, Navigable>;

  /** The entity ID of the player's current location in the game. */
  currentLocation: number | null;

  /**
   * Create the domain model for a game.
   *
   * @param graph the graph of the game
   */
  constructor(graph: Graph) {
    this.gameId = graph.gameId;
    this.name = graph.name;
    this.description = graph.description;
    this.describables = new Map(graph.describables.map((d) => [d.entityId, d]));
    this.navigables = new Map(graph.navigables.map((n) => [n.entityId, n]));
    const entryPoint = graph.navigables.find((n) => n.isEntryPoint);
    if (entryPoint === undefined) {
      this.currentLocation = null;
    } else {
      this.currentLocation = entryPoint.entityId;
    }
  }
}
