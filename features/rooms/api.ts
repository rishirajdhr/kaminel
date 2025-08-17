import { roomSchema } from "./schema";
import type { Room } from "./types";

export async function getRooms(): Promise<Room[]> {
  const response = await fetch("/api/room/all");
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error ?? "Unknown error");
  }
  return roomSchema.array().parse(json.data);
}

export async function getRoom(id: number): Promise<Room> {
  const response = await fetch(`/api/room/${id}`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error ?? "Unknown error");
  }
  return roomSchema.parse(json.data);
}
