import { getAllRooms } from "@/features/rooms/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
