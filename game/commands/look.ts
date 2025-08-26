import { GameModel } from "@/game/model";
import { Command, CommandResult } from "./base";
import { verbs } from "./commands.config";

/**
 * Represents a LOOK command for a game.
 */
export class LookCommand extends Command {
  /**
   * Create a look command for a game.
   *
   * @param gameModel the domain model for the game
   */
  constructor(gameModel: GameModel) {
    super(gameModel, verbs.LOOK);
  }

  /**
   * Execute a specific command. Expects a valid look command.
   *
   * @param command the command to run (e.g. "Look")
   * @returns {CommandResult} object containing the execution result
   */
  execute(command: string): CommandResult {
    const isValid = this.validate(command);
    if (isValid) {
      const currentLocation = this.model.currentLocation;
      if (currentLocation === null) {
        return {
          ok: false,
          message: "Location is not set, cannot look at nothing",
        };
      }

      const describable = this.model.describables.get(currentLocation);
      if (describable === undefined) {
        return { ok: false, message: "Location is missing description data" };
      }

      const message =
        "You are standing in the " +
        describable.name +
        ".\n\n" +
        describable.description;
      return { ok: true, message: message };
    } else {
      return { ok: false, message: "Invalid Look Command" };
    }
  }

  /**
   * Validate a specific command.
   *
   * @param command the command to validate (e.g. "Look")
   * @returns `true` if it is a valid look command, `false` otherwise
   */
  protected validate(command: string): boolean {
    return this.verb === command.trim().toLowerCase();
  }
}
