import { relations } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { pgTable, bigint, timestamp, text } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text().notNull(),
  description: text().default("").notNull(),
  northExit: bigint("north_exit", { mode: "number" })
    .unique()
    .references((): AnyPgColumn => rooms.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  southExit: bigint("south_exit", { mode: "number" })
    .unique()
    .references((): AnyPgColumn => rooms.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  eastExit: bigint("east_exit", { mode: "number" })
    .unique()
    .references((): AnyPgColumn => rooms.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  westExit: bigint("west_exit", { mode: "number" })
    .unique()
    .references((): AnyPgColumn => rooms.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
});

export const roomsRelations = relations(rooms, ({ many, one }) => ({
  northExit: one(rooms, {
    fields: [rooms.northExit],
    references: [rooms.id],
  }),
  southExit: one(rooms, {
    fields: [rooms.southExit],
    references: [rooms.id],
  }),
  eastExit: one(rooms, {
    fields: [rooms.eastExit],
    references: [rooms.id],
  }),
  westExit: one(rooms, {
    fields: [rooms.westExit],
    references: [rooms.id],
  }),

  entities: many(entities),
}));

export const entities = pgTable("entities", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text().notNull(),
  description: text().default("").notNull(),
  roomId: bigint("room_id", { mode: "number" }).references(() => rooms.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const entitiesRelations = relations(entities, ({ one }) => ({
  room: one(rooms, { fields: [entities.roomId], references: [rooms.id] }),
}));
