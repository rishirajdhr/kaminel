import { Exit } from "@/features/rooms/types";
import { GameModel } from "../model";
import { z } from "zod";
import { directionSchema } from "@/features/rooms/schema";
import { Command, CommandResult } from "./command";

const verb = "move";

const moveCommandSchema = z
  .string()
  .transform((val) => val.toLowerCase())
  .pipe(z.templateLiteral([verb, " ", directionSchema]));

export class MoveCommand extends Command {
  constructor(model: GameModel) {
    super(model);
    this.verb = verb;
  }

  static isMoveCommand(command: string) {
    const result = moveCommandSchema.safeParse(command);
    return result.success;
  }

  execute(command: string): CommandResult {
    if (this.model.currentRoom === null) {
      return { success: false, message: "Cannot move from nowhere" };
    }

    if (!MoveCommand.isMoveCommand(command)) {
      return {
        success: false,
        message: `'${command}' is not a valid MOVE command`,
      };
    }

    const [, direction] = command.split(" ");
    const exit = directionSchema
      .transform((d): Exit => `${d}Exit`)
      .parse(direction);

    const destinationId = this.model.currentRoom[exit];
    if (destinationId === null) {
      return { success: false, message: `Cannot move ${direction}` };
    }

    const destination = this.model.rooms.get(destinationId);
    if (destination === undefined) {
      return { success: false, message: `Invalid ${exit} ID` };
    }

    this.model.currentRoom = destination;
    return { success: true, message: `You are in the ${destination.name}` };
  }
}
