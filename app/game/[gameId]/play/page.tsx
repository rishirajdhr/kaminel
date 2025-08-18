import { getGameById } from "@/features/games/services";
import { getRoomById } from "@/features/rooms/services";
import { PlayView } from "./play-view";
import { BadgeAlert } from "lucide-react";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const game = await getGameById(Number.parseInt(gameId));
  if (game === undefined) {
    return <div>No game found</div>;
  }

  if (game.startRoomId === null) {
    return (
      <div className="grid h-full w-full place-items-center">
        <div className="relative flex w-xl flex-col items-start gap-4 overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-emerald-600">
          <div className="text-4xl font-bold tracking-tight">Play Game</div>
          <div className="relative flex flex-row items-center gap-2 overflow-hidden rounded-sm bg-amber-200 p-2 pl-4 before:absolute before:left-0 before:h-full before:w-2 before:bg-amber-400">
            <BadgeAlert className="size-7 text-amber-500" />
            <span className="font-medium">No start room has been set!</span>
          </div>
        </div>
      </div>
    );
  }

  const startRoom = await getRoomById(game.id, game.startRoomId);
  if (startRoom === undefined) {
    return <div>Invalid start room ID</div>;
  }

  return <PlayView startRoom={startRoom} />;
}
