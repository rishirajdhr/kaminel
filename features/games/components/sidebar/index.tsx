import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import { House, Plus } from "lucide-react";
import Link from "next/link";
import { getAllRoomsWithEntities } from "@/features/rooms/services";
import { Button } from "@/components/ui/button";
import { RoomItem } from "./room-item";

type Props = Pick<ComponentProps<typeof Sidebar>, "variant"> & {
  gameId: number;
};

export async function GameSidebar(props: Props) {
  const rooms = await getAllRoomsWithEntities(props.gameId);

  return (
    <Sidebar variant={props.variant}>
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <span className="inline-block text-xl font-semibold tracking-tight">
              Adventure Game Engine
            </span>
          </Link>
          <div className="flex flex-row gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link className="" href={`/game/${props.gameId}/room/new`}>
                <Plus className="stroke-3" />
                <span className="">Add Room</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link className="" href={`/game/${props.gameId}/entity/new`}>
                <Plus className="stroke-3" />{" "}
                <span className="">Add Entity</span>
              </Link>
            </Button>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rooms</SidebarGroupLabel>
          <SidebarGroupAction title="Game Landing Page" asChild>
            <Link href={`/game/${props.gameId}`}>
              <House className="text-gray-600" />{" "}
              <span className="sr-only">Game Landing Page</span>
            </Link>
          </SidebarGroupAction>
          <SidebarMenu>
            {rooms.map((room) => (
              <RoomItem key={room.id} room={room} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
