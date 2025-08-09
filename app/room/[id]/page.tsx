import { db } from "@/db";

export default async function Room({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await db.query.rooms.findFirst({
    where: (rooms, { eq }) => eq(rooms.id, Number.parseInt(id)),
  });

  if (room === undefined) {
    return <div>Room not found</div>;
  }

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative flex w-md flex-col-reverse items-start overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-indigo-600">
        <div className="">
          <h1 className="py-1 text-4xl font-bold tracking-tight text-gray-900">
            {room.name}
          </h1>
          <p className="text-base font-light tracking-tight text-gray-700">
            {room.description}
          </p>
        </div>
        <div className="order-1 text-sm font-semibold text-indigo-600">
          Room
        </div>
      </div>
    </div>
  );
}
