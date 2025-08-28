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
    <div className="flex h-full w-full items-start justify-center overflow-y-auto p-10">
      <div className="flex w-2xl flex-col items-start gap-3.5">
        <span className="bg-black px-3 py-1.5 text-sm tracking-tight text-white">
          Room
        </span>
        <h1 className="text-6xl font-bold tracking-tight text-black">
          {room.describable.name}
        </h1>
        <p className="font-light tracking-tight">
          {room.describable.description}
        </p>
        <StartRoomBadge game={game} room={room} />
        <h2 className="text-2xl font-medium tracking-tight">Exits</h2>
        <div className="grid w-full grid-cols-3 grid-rows-3 items-center justify-items-center gap-2">
          <div className="col-2 row-2 grid h-full w-full place-items-center rounded-md border border-dashed border-[#adadad]">
            <span>{room.describable.name}</span>
          </div>
          <div className="col-2 row-1">
            <RoomExit room={room} direction="north" />
          </div>
          <div className="col-2 row-3">
            <RoomExit room={room} direction="south" />
          </div>
          <div className="col-3 row-2">
            <RoomExit room={room} direction="east" />
          </div>
          <div className="col-1 row-2">
            <RoomExit room={room} direction="west" />
          </div>
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
