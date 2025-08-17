import { roomSchema } from "./schema";
import type { Room } from "./types";

export async function getRooms(gameId: number): Promise<Room[]> {
  const response = await fetch(`/api/game/${gameId}/room`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error ?? "Unknown error");
  }
  return roomSchema.array().parse(json.data);
}

export async function getRoom(gameId: number, roomId: number): Promise<Room> {
  const response = await fetch(`/api/game/${gameId}/room/${roomId}`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error ?? "Unknown error");
  }
  return roomSchema.parse(json.data);
}
