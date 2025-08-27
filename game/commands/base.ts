import { GameModel } from "@/game/model";

/**
 * Represents the result of executing a command.
 */
export type CommandResult = {
  /** Result status - `true` for a successful execution, `false` otherwise. */
  ok: boolean;

  /** Human-readable message describing the outcome of running the command. */
  message: string;
};

/** Represents the available features for a command in the game. */
export abstract class Command {
  protected model: GameModel;
  private _verb: string;

  /**
   * Create a game command.
   *
   * @param gameModel the domain model for the game
   * @param verb the verb used to identify the command (case-insensitive). Any
   *             surrounding whitespace is trimmed off.
   *
   * @throws {Error} if `verb` is an empty string.
   */
  constructor(gameModel: GameModel, verb: string) {
    this.model = gameModel;

    const normalizedVerb = verb.trim().toLowerCase();
    if (normalizedVerb === "") {
      throw new Error("Command verb must be a non-empty string");
    }
    this._verb = normalizedVerb;
  }

  /**
   * The command verb in lowercase.
   */
  get verb() {
    return this._verb;
  }

  /**
   * Execute a specific command.
   *
   * @param command the command to run (e.g. "move north")
   * @returns {CommandResult} object containing the execution result
   */
  abstract execute(command: string): CommandResult;

  /**
   * Validate a specific command.
   *
   * @param command the command to validate (e.g. "move north")
   * @returns `true` if the command is valid, `false` otherwise
   */
  protected abstract validate(command: string): boolean;
}
