import { getEntityById } from "@/features/entities/services";

export default async function Entity({
  params,
}: {
  params: Promise<{ gameId: string; entityId: string }>;
}) {
  const { gameId, entityId } = await params;
  const entity = await getEntityById(
    Number.parseInt(gameId),
    Number.parseInt(entityId)
  );

  if (entity === undefined) {
    return <div>Entity not found</div>;
  }

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative flex w-md flex-col-reverse items-start overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-orange-600">
        <div className="">
          <h1 className="py-1 text-4xl font-bold tracking-tight text-gray-900">
            {entity.name}
          </h1>
          <p className="text-base font-light tracking-tight text-gray-700">
            {entity.description}
          </p>
        </div>
        <div className="order-1 text-sm font-semibold text-orange-600">
          Entity
        </div>
      </div>
    </div>
  );
}
