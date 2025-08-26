import dedent from "dedent";
import { Describable, Navigable } from "@/game/behaviors";
import { GameModel } from "@/game/model";
import { Graph } from "@/game/types";
import { LookCommand } from "./look";

const GAME_ID = 57;
const GAME_NAME = "The Reverberations of Rebellion";
const GAME_DESCRIPTION =
  "Slip through a storm-battered spire to broadcast a rebel message while dodging patrols and sealed doors.";

type Entity = {
  id: number;
  describable?: Describable;
  navigable?: Navigable;
};

const windTornPlaza: Entity = {
  id: 92,
  describable: {
    id: 36,
    entityId: 92,
    gameId: GAME_ID,
    name: "Wind-torn Plaza",
    description:
      "A cracked plaza ringed by broken holoscreens. The spire looms to the north.",
  },
  navigable: {
    id: 37,
    entityId: 92,
    gameId: GAME_ID,
    north: null,
    south: null,
    east: null,
    west: null,
    isEntryPoint: false,
  },
};

function createGraph(entities: Entity[]): Graph {
  const describables: Describable[] = [];
  const navigables: Navigable[] = [];

  entities.forEach((e) => {
    if (e.describable !== undefined) {
      describables.push(e.describable);
    }

    if (e.navigable !== undefined) {
      navigables.push(e.navigable);
    }
  });

  return {
    id: GAME_ID,
    name: GAME_NAME,
    description: GAME_DESCRIPTION,
    describables,
    navigables,
  };
}

it("configures command verb correctly", () => {
  const graph = createGraph([windTornPlaza]);
  const model = new GameModel(graph);
  const lookCommand = new LookCommand(model);

  expect(lookCommand.verb).toBe("look");
});

it("executes valid command successfully", () => {
  const graph = createGraph([
    {
      ...windTornPlaza,
      navigable: { ...windTornPlaza.navigable!, isEntryPoint: true },
    },
  ]);
  const model = new GameModel(graph);
  const lookCommand = new LookCommand(model);

  const message = dedent(
    `You are standing in the Wind-torn Plaza.

    A cracked plaza ringed by broken holoscreens. The spire looms to the north.`
  );
  const validCommands = ["  look  ", "LOOK", "Look ", " lOoK"];
  validCommands.forEach((command) => {
    const result = lookCommand.execute(command);
    expect(result.ok).toBe(true);
    expect(result.message).toBe(message);
  });
});

it("fails execution if location is not set", () => {
  const graph = createGraph([windTornPlaza]);
  const model = new GameModel(graph);
  const lookCommand = new LookCommand(model);

  const result = lookCommand.execute("look");
  expect(result.ok).toBe(false);
  expect(result.message).toBe("Location is not set, cannot look at nothing");
});

it("fails execution if location description is missing", () => {
  const graph = createGraph([
    {
      ...windTornPlaza,
      describable: undefined,
      navigable: { ...windTornPlaza.navigable!, isEntryPoint: true },
    },
  ]);
  const model = new GameModel(graph);
  const lookCommand = new LookCommand(model);

  const result = lookCommand.execute("look");
  expect(result.ok).toBe(false);
  expect(result.message).toBe("Location is missing description data");
});

it("fails execution if command is invalid", () => {
  const graph = createGraph([windTornPlaza]);
  const model = new GameModel(graph);
  const lookCommand = new LookCommand(model);

  const invalidCommands = ["  see  ", "looky-loo", "glance ", " lowk"];
  invalidCommands.forEach((command) => {
    const result = lookCommand.execute(command);
    expect(result.ok).toBe(false);
    expect(result.message).toBe("Invalid Look Command");
  });
});
