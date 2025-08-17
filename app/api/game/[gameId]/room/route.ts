import { getAllRooms } from "@/features/rooms/services";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const rooms = await getAllRooms(Number.parseInt(gameId));
    return NextResponse.json({ data: rooms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
