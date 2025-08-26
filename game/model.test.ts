import { Describable, directions, Navigable } from "./behaviors";
import { GameModel } from "./model";
import { Graph } from "./types";
import { LookCommand, MoveCommand } from "./commands";

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

const broadcastSpire: Entity = {
  id: 94,
  describable: {
    id: 49,
    entityId: 94,
    gameId: GAME_ID,
    name: "Broadcast Spire",
    description:
      "A silent console faces the city. With power restored, it might carry your signal.",
  },
  navigable: {
    id: 50,
    entityId: 94,
    gameId: GAME_ID,
    north: null,
    south: null,
    east: null,
    west: null,
    isEntryPoint: false,
  },
};

const observationDeck: Entity = {
  id: 95,
  describable: {
    id: 51,
    entityId: 95,
    gameId: GAME_ID,
    name: "Observation Deck",
    description:
      "Wind howls through shattered panes. Nothing of note rests here.",
  },
  navigable: {
    id: 52,
    entityId: 95,
    gameId: GAME_ID,
    north: null,
    south: null,
    east: null,
    west: null,
    isEntryPoint: false,
  },
};

function createGraph(entities: Entity[]): Graph {
  return {
    gameId: GAME_ID,
    name: GAME_NAME,
    description: GAME_DESCRIPTION,
    describables: entities.map((e) => e.describable!),
    navigables: entities.map((e) => e.navigable!),
  };
}

it("sets game ID correctly", () => {
  const graph = createGraph([
    windTornPlaza,
    shutteredArchive,
    transitTunnel,
    broadcastSpire,
    observationDeck,
  ]);
  const model = new GameModel(graph);
  expect(model.gameId).toBe(graph.gameId);
});

it("sets name correctly", () => {
  const graph = createGraph([
    windTornPlaza,
    shutteredArchive,
    transitTunnel,
    broadcastSpire,
    observationDeck,
  ]);
  const model = new GameModel(graph);
  expect(model.name).toBe(graph.name);
});

it("sets description correctly", () => {
  const graph = createGraph([
    windTornPlaza,
    shutteredArchive,
    transitTunnel,
    broadcastSpire,
    observationDeck,
  ]);
  const model = new GameModel(graph);
  expect(model.description).toBe(graph.description);
});

it("maps entities to their describables correctly", () => {
  const entities = [
    windTornPlaza,
    shutteredArchive,
    transitTunnel,
    broadcastSpire,
    observationDeck,
  ];
  const graph = createGraph(entities);
  const model = new GameModel(graph);

  entities.forEach((e) => {
    const describable = model.describables.get(e.id);
    if (describable === undefined) {
      throw new Error(`Describable not found for entity with ID: ${e.id}`);
    }

    expect(describable.entityId).toBe(e.id);
    expect(describable.name).toBe(e.describable!.name);
    expect(describable.description).toBe(e.describable!.description);
  });
});

it("maps entities to their navigables correctly", () => {
  const entities: Entity[] = [
    {
      ...windTornPlaza,
      navigable: {
        ...windTornPlaza.navigable!,
        north: shutteredArchive.id,
        east: transitTunnel.id,
      },
    },
    {
      ...shutteredArchive,
      navigable: { ...shutteredArchive.navigable!, south: windTornPlaza.id },
    },
    {
      ...transitTunnel,
      navigable: {
        ...transitTunnel.navigable!,
        north: broadcastSpire.id,
        east: observationDeck.id,
        west: windTornPlaza.id,
      },
    },
    {
      ...broadcastSpire,
      navigable: { ...broadcastSpire.navigable!, south: transitTunnel.id },
    },
    {
      ...observationDeck,
      navigable: { ...observationDeck.navigable!, west: transitTunnel.id },
    },
  ];
  const graph = createGraph(entities);
  const model = new GameModel(graph);

  entities.forEach((e) => {
    const navigable = model.navigables.get(e.id);
    if (navigable === undefined) {
      throw new Error(`Navigable not found for entity with ID: ${e.id}`);
    }

    expect(navigable.entityId).toBe(e.id);
    directions.forEach((dir) => expect(navigable[dir]).toBe(e.navigable![dir]));
  });
});

it("initializes current location to null for no entry point", () => {
  const entities = [
    windTornPlaza,
    shutteredArchive,
    transitTunnel,
    broadcastSpire,
    observationDeck,
  ];
  const graph = createGraph(entities);
  const model = new GameModel(graph);
  expect(model.currentLocation).toBeNull();
});

it("initializes current location to entry point if present", () => {
  const entities = [
    {
      ...windTornPlaza,
      navigable: { ...windTornPlaza.navigable!, isEntryPoint: true },
    },
    shutteredArchive,
    transitTunnel,
    broadcastSpire,
    observationDeck,
  ];
  const graph = createGraph(entities);
  const model = new GameModel(graph);
  expect(model.currentLocation).toBe(windTornPlaza.id);
});

it("invokes LOOK command correctly", () => {
  const executeMock = jest
    .spyOn(LookCommand.prototype, "execute")
    .mockReturnValue({ ok: true, message: "Intercepted LOOK command" });
  const graph = createGraph([windTornPlaza]);
  const model = new GameModel(graph);

  const lookCommands = ["  Look ", "look ", " LOOK", " lOoK "];
  lookCommands.forEach((command, index) => {
    model.run(command);
    expect(executeMock).toHaveBeenCalledTimes(index + 1);
    expect(executeMock).toHaveBeenCalledWith(command);
  });
});

it("invokes MOVE command correctly", () => {
  const executeMock = jest
    .spyOn(MoveCommand.prototype, "execute")
    .mockReturnValue({ ok: true, message: "Intercepted MOVE command" });
  const graph = createGraph([windTornPlaza]);
  const model = new GameModel(graph);

  const moveCommands = [
    "  Move North ",
    "move east ",
    " MOVE WEST",
    " moVE soUth ",
  ];
  moveCommands.forEach((command, index) => {
    model.run(command);
    expect(executeMock).toHaveBeenCalledTimes(index + 1);
    expect(executeMock).toHaveBeenCalledWith(command);
  });
});

it("handles an unknown command correctly", () => {
  const graph = createGraph([windTornPlaza]);
  const model = new GameModel(graph);
  const result = model.run("not-a-command");
  expect(result.ok).toBe(false);
  expect(result.message).toBe("Unknown command: not-a-command");
});
