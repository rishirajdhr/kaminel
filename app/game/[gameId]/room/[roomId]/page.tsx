import { getRoomById, getRoomExitCandidates } from "@/features/rooms/services";
import type { Direction, Exit, Room } from "@/features/rooms/types";
import { SelectExit } from "./select-exit";

export default async function RoomCard({
  params,
}: {
  params: Promise<{ gameId: string; roomId: string }>;
}) {
  const { gameId, roomId } = await params;
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
        <h1 className="py-1 text-4xl font-bold tracking-tight text-gray-900">
          {room.name}
        </h1>
        <p className="text-base font-light tracking-tight text-gray-700">
          {room.description}
        </p>
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
