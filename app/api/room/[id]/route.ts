import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const room = await db.query.rooms.findFirst({
    where: (rooms, { eq }) => eq(rooms.id, Number.parseInt(id)),
  });
  if (room === undefined) {
    return NextResponse.json({ error: "No room found" }, { status: 404 });
  } else {
    return NextResponse.json({ data: room }, { status: 200 });
  }
}
