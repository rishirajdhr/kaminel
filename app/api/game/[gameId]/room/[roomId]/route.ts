import { getRoomById } from "@/features/rooms/services";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameId: string; roomId: string }> }
) {
  const { gameId, roomId } = await params;
  const room = await getRoomById(
    Number.parseInt(gameId),
    Number.parseInt(roomId)
  );
  if (room === undefined) {
    return NextResponse.json({ error: "No room found" }, { status: 404 });
  } else {
    return NextResponse.json({ data: room }, { status: 200 });
  }
}
