import { eq } from "drizzle-orm";
import { db } from "./index";
import * as schema from "./schema";

type Room = {
  name: string;
  description: string;
  exits: {
    northExit: string | null;
    southExit: string | null;
    eastExit: string | null;
    westExit: string | null;
  };
  entities: Array<{ name: string; description: string }>;
};

const rooms: Array<Room> = [
  {
    name: "Docking Bay",
    description:
      "A cavernous, dimly lit hangar with rain pounding on the translucent roof. The metallic scent of fuel lingers in the air. A single shuttle rests on the platform.",
    exits: {
      northExit: "Control Center",
      southExit: null,
      eastExit: "Supply Corridor",
      westExit: null,
    },
    entities: [
      {
        name: "Maintenance Droid",
        description:
          "A squat, cylindrical robot with rusting panels and a flickering optical sensor. It emits a low whirring as it moves between crates.",
      },
      {
        name: "Fuel Drum",
        description:
          "A dented metal barrel smelling strongly of diesel. A small leak drops onto the grated floor.",
      },
    ],
  },
  {
    name: "Control Center",
    description:
      "A circular chamber filled with flickering consoles and a central holographic map of the facility. Red warning lights pulse along the walls.",
    exits: {
      northExit: null,
      southExit: "Docking Bay",
      eastExit: "Observation Deck",
      westExit: null,
    },
    entities: [
      {
        name: "Chief Engineer Varrin",
        description:
          'A wiry human with oil-stained gloves and a permanent scowl. He mutters about "power fluctuations" and "storm damage".',
      },
    ],
  },
  {
    name: "Supply Corridor",
    description:
      "A narrow, echoing passage stacked with crates and supply pods. The hum of refrigeration units can be heard in the distance.",
    exits: {
      northExit: "Observation Deck",
      southExit: null,
      eastExit: "Generator Room",
      westExit: "Docking Bay",
    },
    entities: [
      {
        name: "Security Crate",
        description:
          "A sealed, heavy-duty container with a biometric lock. A faint beeping comes from within.",
      },
      {
        name: "Loose Data Pad",
        description:
          "A scuffed tablet lying on top of a crate. Its screen flickers with fragments of a log entry.",
      },
      {
        name: "Stray Hydrobot",
        description:
          "A spider-like maintenance bot, dripping seawater and twitching erratically.",
      },
    ],
  },
  {
    name: "Observation Deck",
    description:
      "A glass-walled overlook facing the stormy sea. Lightning flashes illuminate the distant silhouettes of massive spires.",
    exits: {
      northExit: null,
      southExit: "Supply Corridor",
      eastExit: null,
      westExit: "Control Center",
    },
    entities: [
      {
        name: "Storm Hawk",
        description:
          "A large seabird perched on the railing, its feathers slick with rain. It regards you with sharp, unblinking eyes.",
      },
      {
        name: "Broken Telescope",
        description:
          "A floor-mounted telescope with a cracked lens, still pointed at the horizon.",
      },
    ],
  },
  {
    name: "Generator Room",
    description:
      "A cramped, oil-slicked chamber vibrating with the deep thrum of the power core. Thick cables snake across the floor, glowing faintly with residual energy.",
    exits: {
      northExit: null,
      southExit: null,
      eastExit: null,
      westExit: "Supply Corridor",
    },
    entities: [],
  },
];

async function seedDb() {
  for (const room of rooms) {
    await db
      .insert(schema.rooms)
      .values({ name: room.name, description: room.description })
      .onConflictDoNothing();
    for (const entity of room.entities) {
      await db
        .insert(schema.entities)
        .values({ name: entity.name, description: entity.description });
    }
  }

  for (const room of rooms) {
    const roomInDb = await db.query.rooms.findFirst({
      where: (roomsDb, { eq }) => eq(roomsDb.name, room.name),
    });
    if (roomInDb === undefined) continue;
    for (const exit of Object.keys(room.exits) as Array<keyof Room["exits"]>) {
      const destinationName = room.exits[exit];
      if (destinationName !== null) {
        const destination = await db.query.rooms.findFirst({
          where: (roomsDb, { eq }) => eq(roomsDb.name, destinationName),
        });
        if (destination === undefined) {
          console.warn(
            `Error encountered when assigning ${exit} for ${room.name}. Could not find a room with the name ${destinationName}`
          );
        } else {
          await db
            .update(schema.rooms)
            .set({ [exit]: destination.id })
            .where(eq(schema.rooms.id, roomInDb.id));
        }
      }
    }
    for (const entity of room.entities) {
      await db
        .update(schema.entities)
        .set({ roomId: roomInDb.id })
        .where(eq(schema.entities.name, entity.name));
    }
  }
}

seedDb();
