import { getRoomById, getRoomExitCandidates } from "@/features/rooms/services";
import type { Room } from "@/features/rooms/types";
import { Direction } from "@/game/behaviors";
import { SelectExit } from "./select-exit";
import { getGameById } from "@/features/games/services";
import { StartRoomBadge } from "./start-room-badge";

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
      <div className="relative flex w-lg flex-col items-start overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-indigo-600">
        <div className="text-sm font-semibold text-indigo-600">Room</div>
        <div className="flex w-full flex-row items-center justify-between pt-1 pb-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {room.describable.name}
          </h1>
          <StartRoomBadge game={game} room={room} />
        </div>
        <div>
          <p className="text-base font-light tracking-tight text-gray-700">
            {room.describable.description}
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
  const candidates = await getRoomExitCandidates(
    props.room.gameId,
    props.room.id,
    {
      direction: props.direction,
      destinationId: props.room.navigable[props.direction],
    }
  );

  return (
    <SelectExit
      roomId={props.room.id}
      direction={props.direction}
      originalDestinationId={props.room.navigable[props.direction]}
      optionsForDestination={candidates}
    />
  );
}
