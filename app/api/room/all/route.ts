import { getAllRooms } from "@/features/rooms/services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rooms = await getAllRooms();
    return NextResponse.json({ data: rooms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
