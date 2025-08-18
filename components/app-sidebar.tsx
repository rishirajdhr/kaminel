import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, House, Plus } from "lucide-react";
import Link from "next/link";
import { getAllRoomsWithEntities } from "@/features/rooms/services";
import { Button } from "./ui/button";

type Props = Pick<ComponentProps<typeof Sidebar>, "variant"> & {
  gameId: number;
};

export async function AppSidebar(props: Props) {
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
              <Collapsible className="group/collapsible" key={room.name}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link href={`/game/${room.gameId}/room/${room.id}`}>
                        <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        <span>{room.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {room.entities.map((entity) => (
                        <SidebarMenuSubItem key={entity.name}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={`/game/${entity.gameId}/entity/${entity.id}`}
                            >
                              {entity.name}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
