import { Describable, Navigable } from "./behaviors";
import {
  Command,
  CommandResult,
  LookCommand,
  MoveCommand,
  config,
} from "./commands";
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

  /** The available game commands indexed by their corresponding verbs. */
  commands: Map<string, Command>;

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

    this.commands = new Map<string, Command>([
      [config.verbs.LOOK, new LookCommand(this)],
      [config.verbs.MOVE, new MoveCommand(this)],
    ]);
  }

  /**
   * Process a game command.
   *
   * @param instruction the raw text representing a command (e.g. 'move east')
   * @returns {CommandResult} object containing the execution result
   */
  run(instruction: string): CommandResult {
    const verb = instruction.trim().toLowerCase().split(" ")[0];
    const command = this.commands.get(verb);
    if (command === undefined) {
      return { ok: false, message: `Unknown command: ${verb}` };
    } else {
      return command.execute(instruction);
    }
  }
}
