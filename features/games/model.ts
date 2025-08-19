import { Entity } from "../entities/types";
import { Room } from "../rooms/types";
import { getGameGraph } from "./api";
import { Command, CommandResult } from "./commands/command";
import { LookCommand } from "./commands/look";
import { MoveCommand } from "./commands/move";

const availableCommands: (new (model: GameModel) => Command)[] = [
  LookCommand,
  MoveCommand,
];

export class GameModel {
  gameId: number;
  name: string;
  description: string;
  commands: Map<string, Command>;
  rooms: Map<number, Room>;
  entities: Map<number, Entity>;
  status: "idle" | "pending" | "success" | "error";
  currentRoom: Room | null;

  constructor(gameId: number) {
    this.gameId = gameId;
    this.name = "";
    this.description = "";
    this.commands = new Map();
    this.rooms = new Map();
    this.entities = new Map();
    this.status = "idle";
    this.currentRoom = null;

    availableCommands.forEach((commandConstructor) => {
      const command = new commandConstructor(this);
      this.commands.set(command.verb, command);
    });
  }

  async init() {
    if (this.status === "success") return;

    this.status = "pending";

    try {
      const graph = await getGameGraph(this.gameId);

      this.name = graph.name;
      this.description = graph.description;

      graph.rooms.forEach(({ entities, ...room }) => {
        this.rooms.set(room.id, room);
        entities.forEach((entity) => this.entities.set(entity.id, entity));
      });

      if (graph.startRoomId !== null) {
        this.currentRoom = this.rooms.get(graph.startRoomId) ?? null;
      }
      this.status = "success";
    } catch (error) {
      this.status = "error";
      throw error;
    }
  }

  run(commandText: string): CommandResult {
    const [firstToken] = commandText.split(" ");
    const verb = firstToken.toLowerCase();
    const command = this.commands.get(verb);
    if (command === undefined) {
      return { success: false, message: `Unknown command: ${verb}` };
    } else {
      return command.execute(commandText);
    }
  }
}
