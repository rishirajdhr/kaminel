"use server";

import { revalidatePath } from "next/cache";
import { setRoomExit } from "./services";
import type { ExitConfig } from "./types";

export async function updateRoomExit(id: number, options: ExitConfig) {
  const room = await setRoomExit(id, options);
  if (room === undefined) {
    throw new Error("No room found");
  }
  revalidatePath(`/room/${id}`);
  return room;
}
