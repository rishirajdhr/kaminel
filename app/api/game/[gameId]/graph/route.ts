import { getGameGraphById } from "@/features/games/services";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  try {
    const graph = await getGameGraphById(Number.parseInt(gameId));
    if (graph === undefined) {
      return NextResponse.json(
        { error: `No game found with ID: ${gameId}` },
        { status: 404 }
      );
    } else {
      return NextResponse.json({ data: graph }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
