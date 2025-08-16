import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRoomById, getRoomExitCandidates } from "@/db/queries/rooms";
import { Direction, Exit, Room } from "@/features/rooms/types";

export default async function RoomCard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoomById(Number.parseInt(id));

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
        <div className="mt-2">
          <ExitDropdown room={room} direction="north" />
          <ExitDropdown room={room} direction="south" />
          <ExitDropdown room={room} direction="east" />
          <ExitDropdown room={room} direction="west" />
        </div>
      </div>
    </div>
  );
}

async function ExitDropdown(props: { room: Room; direction: Direction }) {
  const candidates = await getRoomExitCandidates(
    props.room.id,
    props.direction
  );

  const exit: Exit = `${props.direction}Exit`;
  const destination = candidates.find((c) => c.id === props.room[exit]);

  return (
    <div className="space-y-2 py-2">
      <Label htmlFor={`${props.direction}-exit-${props.room.id}`}>
        {props.direction.toUpperCase()} EXIT
      </Label>
      <Select value={destination?.name} disabled={true}>
        <SelectTrigger
          id={`${props.direction}-exit-${props.room.id}`}
          className="w-64"
        >
          <SelectValue placeholder="Select a Room" />
        </SelectTrigger>
        <SelectContent>
          {candidates.map((candidate) => (
            <SelectItem key={candidate.id} value={candidate.name}>
              {candidate.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
