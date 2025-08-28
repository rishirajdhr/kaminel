import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameSidebar } from "@/features/games/components/sidebar";
import { getAllRooms } from "@/features/rooms/services";
import { Play } from "lucide-react";
import Link from "next/link";

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
    <div className="flex h-screen w-screen flex-col">
      <header className="flex h-16 w-full flex-none flex-row items-center border-b border-[#dedede] bg-[#fafafa] p-4">
        <Link href="/" className="flex-none text-2xl font-bold">
          Kaminel
        </Link>
        <span className="flex-1">
          <Input
            className="m-auto w-80 bg-white"
            placeholder="Search (to be implemented...)"
            disabled={true}
          />
        </span>
        <span className="flex-none">
          <Button asChild>
            <Link href={`/game/${gameId}/play`}>
              <span>
                <Play className="size-4" />
              </span>
              <span className="text-sm">Play Game</span>
            </Link>
          </Button>
        </span>
      </header>
      <div className="flex h-full w-full flex-1 flex-row items-stretch">
        <GameSidebar
          secondary={rooms.map((room) => ({
            label: room.describable.name,
            href: `/game/${room.gameId}/edit/room/${room.id}`,
          }))}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
