import { eq } from "drizzle-orm";
import { db, client } from "./index";
import * as schema from "./schema";

type Game = {
  name: string;
  description: string;
  rooms: Array<Room>;
};

type Room = {
  name: string;
  description: string;
  exits: {
    northExit: string | null;
    southExit: string | null;
    eastExit: string | null;
    westExit: string | null;
  };
  entities: Array<Entity>;
};

type Entity = { name: string; description: string };

const games: Game[] = [
  {
    name: "Echoes of the Abyss",
    description:
      "In the depths of a storm-wracked ocean world, ancient machines still stir. Halls of glass and steel whisper with forgotten voices, while strange guardians test all who enter. Explore the ruins, unlock their secrets, and discover what was left behind.",
    rooms: [
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
    ],
  },
  {
    name: "Whisperwood",
    description:
      "Deep in an ancient forest, the trees themselves seem to breathe, watching intruders with silent intent. Within its hidden glades lie cottages, ruins, and shrines — each holding secrets, each guarded by creatures of fable.",
    rooms: [
      {
        name: "The Hollow Oak",
        description:
          "A vast, gnarled oak tree with a hollow trunk wide enough to walk inside. Faint light filters through cracks in the bark.",
        exits: {
          northExit: "The Mossy Clearing",
          southExit: null,
          eastExit: "Abandoned Cottage",
          westExit: null,
        },
        entities: [
          {
            name: "Lantern Wisp",
            description:
              "A small floating light that drifts just out of reach.",
          },
          {
            name: "Carved Totem",
            description:
              "A wooden figure left behind by forest dwellers, its eyes seem to follow you.",
          },
        ],
      },
      {
        name: "The Mossy Clearing",
        description:
          "A serene glade covered in thick moss, where mushrooms glow faintly at dusk. The air feels still, as if time has slowed.",
        exits: {
          northExit: null,
          southExit: "The Hollow Oak",
          eastExit: "The Sunken Shrine",
          westExit: null,
        },
        entities: [
          {
            name: "Stone Circle",
            description: "Weathered standing stones inscribed with runes.",
          },
          {
            name: "Deer Spirit",
            description: "A spectral stag with antlers wrapped in ivy.",
          },
        ],
      },
      {
        name: "Abandoned Cottage",
        description:
          "A rotting wooden hut with broken shutters and a sagging roof. Strange herbs hang from the rafters, long since dried.",
        exits: {
          northExit: "The Sunken Shrine",
          southExit: null,
          eastExit: null,
          westExit: "The Hollow Oak",
        },
        entities: [
          {
            name: "Witch's Journal",
            description:
              "An old book written in a language you can't fully decipher.",
          },
        ],
      },
      {
        name: "The Sunken Shrine",
        description:
          "A shrine half-swallowed by earth and roots, its statues crumbled but still exuding reverence. The sound of running water echoes nearby.",
        exits: {
          northExit: "The Silent Pond",
          southExit: "Abandoned Cottage",
          eastExit: null,
          westExit: "The Mossy Clearing",
        },
        entities: [
          {
            name: "Crumbling Idol",
            description: "A weathered statue missing half its face.",
          },
        ],
      },
      {
        name: "The Silent Pond",
        description:
          "A still pond where no wind ripples the surface. The water is dark and reflective, hiding what lies beneath.",
        exits: {
          northExit: null,
          southExit: "The Sunken Shrine",
          eastExit: null,
          westExit: null,
        },
        entities: [],
      },
    ],
  },
];

async function seedDb() {
  console.log(
    `🎮 Starting to seed ${games.length} ${games.length === 1 ? "game" : "games"}...`
  );

  for (const game of games) {
    console.log(`\n🎯 Processing game: "${game.name}"`);
    console.log(`📝 Description: ${game.description}`);

    const [{ gameId }] = await db
      .insert(schema.games)
      .values({ name: game.name, description: game.description })
      .returning({ gameId: schema.games.id })
      .onConflictDoNothing();
    console.log(`✅ Game "${game.name}" created with ID: ${gameId}`);

    console.log("🚪 Creating rooms and entities...");
    for (const room of game.rooms) {
      console.log(`  🏠 Creating room: ${room.name}`);
      const [{ roomId }] = await db
        .insert(schema.rooms)
        .values({ name: room.name, description: room.description, gameId })
        .returning({ roomId: schema.rooms.id })
        .onConflictDoNothing();

      for (const entity of room.entities) {
        console.log(`    👾 Adding entity: ${entity.name}`);
        await db.insert(schema.entities).values({
          name: entity.name,
          description: entity.description,
          roomId,
          gameId,
        });
      }
      console.log(
        `  ✅ Room "${room.name}" complete with ${room.entities.length} entities`
      );
    }

    console.log("🔗 Connecting room exits...");
    for (const room of game.rooms) {
      const roomInDb = await db.query.rooms.findFirst({
        where: (rooms, { eq }) => eq(rooms.name, room.name),
      });
      if (roomInDb === undefined) continue;

      for (const exit of Object.keys(room.exits) as Array<
        keyof Room["exits"]
      >) {
        const destinationName = room.exits[exit];
        if (destinationName !== null) {
          const destination = await db.query.rooms.findFirst({
            where: (rooms, { eq }) => eq(rooms.name, destinationName),
          });
          if (destination === undefined) {
            console.warn(
              `⚠️  Error encountered when assigning ${exit} for ${room.name}. Could not find a room with the name ${destinationName}`
            );
          } else {
            console.log(
              `    🔀 Connecting ${room.name} ${exit} → ${destinationName}`
            );
            await db
              .update(schema.rooms)
              .set({ [exit]: destination.id })
              .where(eq(schema.rooms.id, roomInDb.id));
          }
        }
      }
    }
    console.log(
      `✅ Game "${game.name}" complete - all room connections established`
    );
  }

  console.log(
    `\n🎉 Successfully seeded ${games.length} ${games.length === 1 ? "game" : "games"}!`
  );
}

async function resetDatabase() {
  console.log("🗑️  Resetting database...");

  // Delete in reverse order of dependencies to avoid foreign key constraints
  await db.delete(schema.entities);
  await db.delete(schema.rooms);
  await db.delete(schema.games);

  console.log("✅ Database reset complete");
}

async function cleanup() {
  console.log("🧹 Cleaning up database connection...");
  try {
    await client.end();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.log("⚠️  Error during cleanup:", error);
  }
}

async function main() {
  const shouldReset = process.argv.includes("--reset");

  if (shouldReset) {
    await resetDatabase();
  }

  console.log("🌱 Seeding database...");
  await seedDb();
  console.log("✅ Database seeding complete");

  await cleanup();
}

main().catch(async (error) => {
  console.error("❌ Error seeding database:", error);
  await cleanup();
  process.exit(1);
});
