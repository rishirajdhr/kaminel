import { GameModel } from "../model";
import { Command, CommandResult } from "./command";

export class LookCommand extends Command {
  constructor(model: GameModel) {
    super(model);
    this.verb = "look";
  }

  execute(command: string): CommandResult {
    if (command.toLowerCase() !== this.verb) {
      return {
        success: false,
        message: `${command} is not a valid LOOK command`,
      };
    }

    if (this.model.currentRoom === null) {
      return { success: false, message: "Cannot look nowhere" };
    }

    const intro = `You are standing in the ${this.model.currentRoom.name}`;
    const body = this.model.currentRoom.description;
    const lookMessage = intro + "\n\n" + body;

    return { success: true, message: lookMessage };
  }
}
