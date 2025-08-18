import { GameModel } from "../model";

export type CommandResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export abstract class Command {
  verb: string;
  model: GameModel;

  constructor(model: GameModel) {
    this.model = model;
    this.verb = "<verb>";
  }

  abstract execute(command: string): CommandResult;
}
