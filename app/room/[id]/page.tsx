export default async function Room({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>Room ID: {id}</div>;
}
