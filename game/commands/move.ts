import { Direction, directions } from "../behaviors";
import { GameModel } from "../model";
import { Command, CommandResult } from "./base";
import { verbs } from "./commands.config";

/**
 * Represents a MOVE command for a game.
 */
export class MoveCommand extends Command {
  private static commandRegex = new RegExp(
    `^\\s*${verbs.MOVE} (?<direction>${directions.join("|")})\\s*$`,
    "i"
  );

  /**
   * Create a move command for a game.
   *
   * @param gameModel the domain model for the game
   */
  constructor(gameModel: GameModel) {
    super(gameModel, verbs.MOVE);
  }

  /**
   * Execute a specific command. Expects a valid move command.
   *
   * @param command the command to run (e.g. "move east")
   * @returns {CommandResult} object containing the execution result
   */
  execute(command: string): CommandResult {
    const result = MoveCommand.commandRegex.exec(command);
    if (
      result === null ||
      result.groups === undefined ||
      !("direction" in result.groups)
    ) {
      return { ok: false, message: "Invalid Move Command" };
    } else {
      const currentLocation = this.model.currentLocation;
      if (currentLocation === null) {
        return {
          ok: false,
          message: "Location is not set, cannot move from nowhere",
        };
      }

      const fromNavigable = this.model.navigables.get(currentLocation);
      if (fromNavigable === undefined) {
        return { ok: false, message: "Location is not navigable" };
      }

      const direction = result.groups.direction.toLowerCase() as Direction;
      const nextLocation = fromNavigable[direction];
      if (nextLocation === null) {
        return {
          ok: false,
          message: `Cannot move ${direction}, no exit found in that direction`,
        };
      }

      const toNavigable = this.model.navigables.get(nextLocation);
      if (toNavigable === undefined) {
        return {
          ok: false,
          message: `Cannot move ${direction}, the exit is not navigable`,
        };
      }

      this.model.currentLocation = nextLocation;
      return { ok: true, message: `Moved ${direction}` };
    }
  }

  /**
   * Validate a specific command.
   *
   * @param command the command to validate (e.g. "move east")
   * @returns `true` if it is a valid move command, `false` otherwise
   */
  protected validate(command: string): boolean {
    return MoveCommand.commandRegex.test(command);
  }
}
