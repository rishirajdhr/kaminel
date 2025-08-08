export default async function Entity({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>Entity ID: {id}</div>;
}
