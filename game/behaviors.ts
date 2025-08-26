/** Represents the properties present on all behaviors in the game. */
export interface Behavior {
  /** The behavior unique ID. */
  id: number;

  /** The ID of the entity the behavior belongs to. */
  entityId: number;

  /** The ID of the game where the behavior exists. */
  gameId: number;
}

/** Provides a game entity with human-readable identifiers (e.g. name). */
export interface Describable extends Behavior {
  /** The name of the entity. */
  name: string;

  /** The description of the entity. */
  description: string;
}

/** Defines the navigable directions available in the game.  */
export const directions = ["north", "south", "east", "west"] as const;

/** Represents a navigable direction in the game. */
export type Direction = (typeof directions)[number];

/**
 * Makes an entity navigable and connects it to other navigable entities. A
 * direction, if connected, points to the ID of the connected entity.
 */
export interface Navigable extends Behavior, Record<Direction, number | null> {
  /** `true` if the game starts at this navigable, `false` otherwise. */
  isEntryPoint: boolean;
}
