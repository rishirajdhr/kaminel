import { getRoomById, getRoomExitCandidates } from "@/features/rooms/services";
import type { Direction, Exit, Room } from "@/features/rooms/types";
import { SelectExit } from "./select-exit";
import { Button } from "@/components/ui/button";
import { getGameById } from "@/features/games/services";

export default async function RoomCard({
  params,
}: {
  params: Promise<{ gameId: string; roomId: string }>;
}) {
  const { gameId, roomId } = await params;
  const game = await getGameById(Number.parseInt(gameId));

  if (game === undefined) {
    return <div>Invalid Game</div>;
  }

  const room = await getRoomById(
    Number.parseInt(gameId),
    Number.parseInt(roomId)
  );

  if (room === undefined) {
    return <div>Room not found</div>;
  }

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative flex w-md flex-col items-start overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-indigo-600">
        <div className="text-sm font-semibold text-indigo-600">Room</div>
        <div className="flex w-full flex-row items-center justify-between pt-1 pb-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {room.name}
          </h1>
          {game.startRoomId === room.id ? (
            <div className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-2 text-sm font-medium whitespace-nowrap text-green-900 shadow-xs outline-none">
              Starting Room
            </div>
          ) : (
            <Button className="rounded-full" variant="outline">
              Mark as Start Room
            </Button>
          )}
        </div>
        <div>
          <p className="text-base font-light tracking-tight text-gray-700">
            {room.description}
          </p>
        </div>
        <div className="mt-2 w-full">
          <RoomExit room={room} direction="north" />
          <RoomExit room={room} direction="south" />
          <RoomExit room={room} direction="east" />
          <RoomExit room={room} direction="west" />
        </div>
      </div>
    </div>
  );
}

async function RoomExit(props: { room: Room; direction: Direction }) {
  const exit: Exit = `${props.direction}Exit`;
  const candidates = await getRoomExitCandidates(
    props.room.gameId,
    props.room.id,
    {
      direction: props.direction,
      destinationId: props.room[exit],
    }
  );

  return (
    <SelectExit
      roomId={props.room.id}
      direction={props.direction}
      originalDestinationId={props.room[exit]}
      optionsForDestination={candidates}
    />
  );
}
