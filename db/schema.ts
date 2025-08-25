import { relations } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { pgTable, bigint, timestamp, text } from "drizzle-orm/pg-core";

//#region ===== TABLES =====

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
};

export const games = pgTable("games", {
  ...timestamps,
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  description: text().default("").notNull(),
});

export const entities = pgTable("entities", {
  ...timestamps,
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  gameId: bigint("game_id", { mode: "number" })
    .references(() => games.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

const behaviorIds = {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  entityId: bigint("entity_id", { mode: "number" })
    .references(() => entities.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  gameId: bigint("game_id", { mode: "number" })
    .references(() => games.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
};

export const describables = pgTable("describables", {
  ...timestamps,
  ...behaviorIds,
  name: text().notNull(),
  description: text().default("").notNull(),
});

export const navigables = pgTable("navigables", {
  ...timestamps,
  ...behaviorIds,
  north: bigint({ mode: "number" })
    .unique()
    .references((): AnyPgColumn => navigables.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  south: bigint({ mode: "number" })
    .unique()
    .references((): AnyPgColumn => navigables.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  east: bigint({ mode: "number" })
    .unique()
    .references((): AnyPgColumn => navigables.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  west: bigint({ mode: "number" })
    .unique()
    .references((): AnyPgColumn => navigables.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
});

//#endregion

//#region ===== RELATIONS =====

export const gamesRelations = relations(games, ({ many }) => ({
  entities: many(entities),
  describables: many(describables),
  navigables: many(navigables),
}));

export const entitiesRelations = relations(entities, ({ one, many }) => ({
  game: one(games, { fields: [entities.gameId], references: [games.id] }),
  describables: many(describables),
  navigables: many(navigables),
}));

export const describablesRelations = relations(describables, ({ one }) => ({
  game: one(games, { fields: [describables.gameId], references: [games.id] }),
  entity: one(entities, {
    fields: [describables.entityId],
    references: [entities.id],
  }),
}));

export const navigablesRelations = relations(navigables, ({ one }) => ({
  game: one(games, { fields: [navigables.gameId], references: [games.id] }),
  entity: one(entities, {
    fields: [navigables.entityId],
    references: [entities.id],
  }),
  northExit: one(navigables, {
    fields: [navigables.north],
    references: [navigables.id],
    relationName: "north_exit",
  }),
  southExit: one(navigables, {
    fields: [navigables.south],
    references: [navigables.id],
    relationName: "south_exit",
  }),
  eastExit: one(navigables, {
    fields: [navigables.east],
    references: [navigables.id],
    relationName: "east_exit",
  }),
  westExit: one(navigables, {
    fields: [navigables.west],
    references: [navigables.id],
    relationName: "west_exit",
  }),
}));

//#endregion
