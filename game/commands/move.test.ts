import { Describable, directions, Navigable } from "../behaviors";
import { GameModel } from "../model";
import { Graph } from "../types";
import { CommandResult } from "./base";
import { MoveCommand } from "./move";

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

const shutteredArchive: Entity = {
  id: 28,
  describable: {
    id: 45,
    entityId: 28,
    gameId: GAME_ID,
    name: "Shuttered Archive",
    description:
      "Dusty stacks and inert terminals. A sealed access door leads east.",
  },
  navigable: {
    id: 46,
    entityId: 28,
    gameId: GAME_ID,
    north: null,
    south: null,
    east: null,
    west: null,
    isEntryPoint: false,
  },
};

const transitTunnel: Entity = {
  id: 93,
  describable: {
    id: 47,
    entityId: 93,
    gameId: GAME_ID,
    name: "Transit Tunnel",
    description:
      "Echoing rails and flickering lights. A patrol drone hums nearby.",
  },
  navigable: {
    id: 48,
    entityId: 93,
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
  const graph = createGraph([]);
  const model = new GameModel(graph);
  const moveCommand = new MoveCommand(model);

  expect(moveCommand.verb).toBe("move");
});

it("executes valid command successfully", () => {
  const graph = createGraph([
    {
      ...windTornPlaza,
      navigable: {
        ...windTornPlaza.navigable!,
        north: shutteredArchive.id,
        east: transitTunnel.id,
        isEntryPoint: true,
      },
    },
    {
      ...shutteredArchive,
      navigable: { ...shutteredArchive.navigable!, south: windTornPlaza.id },
    },
    {
      ...transitTunnel,
      navigable: { ...transitTunnel.navigable!, west: windTornPlaza.id },
    },
  ]);
  const model = new GameModel(graph);
  const moveCommand = new MoveCommand(model);

  expect(model.currentLocation).toBe(windTornPlaza.id);
  let result: CommandResult;

  result = moveCommand.execute("move north");
  expect(result.ok).toBe(true);
  expect(model.currentLocation).toBe(shutteredArchive.id);

  result = moveCommand.execute("MOVE SOUTH");
  expect(result.ok).toBe(true);
  expect(model.currentLocation).toBe(windTornPlaza.id);

  result = moveCommand.execute("   MoVe eaST ");
  console.log(result);
  expect(result.ok).toBe(true);
  expect(model.currentLocation).toBe(transitTunnel.id);
});

it("does not move if location is not set", () => {
  const graph = createGraph([windTornPlaza]);
  const model = new GameModel(graph);
  const moveCommand = new MoveCommand(model);

  const result = moveCommand.execute("move east");
  expect(result.ok).toBe(false);
  expect(result.message).toBe("Location is not set, cannot move from nowhere");
});

it("does not move if location has no navigable", () => {
  const graph = createGraph([{ ...windTornPlaza, navigable: undefined }]);
  const model = new GameModel(graph);
  const moveCommand = new MoveCommand(model);

  model.currentLocation = windTornPlaza.id;
  const result = moveCommand.execute("move west");
  expect(result.ok).toBe(false);
  expect(result.message).toBe("Location is not navigable");
});

it("does not move if direction is not connected", () => {
  const graph = createGraph([
    {
      ...windTornPlaza,
      navigable: {
        ...windTornPlaza.navigable!,
        north: shutteredArchive.id,
        isEntryPoint: true,
      },
    },
    {
      ...shutteredArchive,
      navigable: { ...shutteredArchive.navigable!, south: windTornPlaza.id },
    },
  ]);
  const model = new GameModel(graph);
  const moveCommand = new MoveCommand(model);

  const result = moveCommand.execute("move south");
  expect(result.ok).toBe(false);
  expect(result.message).toBe(
    "Cannot move south, no exit found in that direction"
  );
});

it("does not move if connected location has no navigable", () => {
  const graph = createGraph([
    {
      ...windTornPlaza,
      navigable: {
        ...windTornPlaza.navigable!,
        north: shutteredArchive.id,
        isEntryPoint: true,
      },
    },
    { ...shutteredArchive, navigable: undefined },
  ]);
  const model = new GameModel(graph);
  const moveCommand = new MoveCommand(model);

  const result = moveCommand.execute("move north");
  expect(result.ok).toBe(false);
  expect(result.message).toBe("Cannot move north, the exit is not navigable");
});

it("fails execution if command is invalid", () => {
  const graph = createGraph([windTornPlaza]);
  const model = new GameModel(graph);
  const moveCommand = new MoveCommand(model);

  const invalidCommands = [
    "  ",
    "move",
    "  move brother  ",
    "  Go SOUTH",
    "NaViGaTe ",
  ];
  invalidCommands.forEach((command) => {
    const result = moveCommand.execute(command);
    expect(result.ok).toBe(false);
    expect(result.message).toBe("Invalid Move Command");
  });
});
