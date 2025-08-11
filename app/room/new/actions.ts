"use server";

import { db } from "@/db";
import { addRoomFormSchema, type AddRoomFormData } from "./addRoomSchema";
import { rooms } from "@/db/schema";
import { revalidatePath } from "next/cache";

type CreateRoomResponse =
  | { success: true; roomHref: string }
  | { success: false };

export async function createRoom(
  formData: AddRoomFormData
): Promise<CreateRoomResponse> {
  try {
    const roomToInsert = addRoomFormSchema.parse(formData);
    const [room] = await db
      .insert(rooms)
      .values({
        name: roomToInsert.name,
        description: roomToInsert.description,
      })
      .returning();
    revalidatePath("/");
    return { success: true, roomHref: `/room/${room.id}` };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
}
