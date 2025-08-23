/** Represents the properties present on all behaviors in the game. */
interface Behavior {
  /** The behavior unique ID. */
  id: number;

  /** The ID of the entity the behavior belongs to. */
  entityId: number;

  /** The ID of the game where the behavior exists. */
  gameId: number;
}

/** Provides a game entity with human-readable identifiers (e.g. name). */
interface Describable extends Behavior {
  /** The name of the entity. */
  name: string;

  /** The description of the entity. */
  description: string;
}
