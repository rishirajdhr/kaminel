import { gameGraphSchema } from "./schema";
import { Graph } from "@/game/types";

/**
 * Fetch the graph for a game by its ID.
 *
 * @param gameId the game ID
 * @returns the game graph
 *
 * @throws If no corresponding game is found or a database operation fails
 * @throws {ZodError} If the response data fails schema validation
 */
export async function getGameGraph(gameId: number): Promise<Graph> {
  const response = await fetch(`/api/game/${gameId}/graph`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error ?? "Unknown error");
  }
  return gameGraphSchema.parse(json.data);
}
