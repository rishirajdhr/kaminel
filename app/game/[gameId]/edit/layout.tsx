import { GameSidebar } from "@/features/games/components/sidebar";
import { getAllRooms } from "@/features/rooms/services";
import { Gamepad2, Map, MapPin } from "lucide-react";

const categories = [
  { label: "Game", icon: <Gamepad2 />, href: "#" },
  { label: "Map", icon: <Map />, href: "#" },
  { label: "Rooms", icon: <MapPin />, href: "#" },
];

export default async function GameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const rooms = await getAllRooms(Number.parseInt(gameId));

  return (
    <>
      <GameSidebar
        primary={categories}
        secondary={rooms.map(({ describable }) => ({
          label: describable.name,
          href: "#",
        }))}
      />
      <main>{children}</main>
    </>
  );
}
