import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
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
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { getAllRoomsWithEntities } from "@/features/rooms/services";

type Props = Pick<ComponentProps<typeof Sidebar>, "variant"> & {
  gameId: number;
};

export async function AppSidebar(props: Props) {
  const rooms = await getAllRoomsWithEntities(props.gameId);

  return (
    <Sidebar variant={props.variant}>
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="inline-block text-xl font-semibold tracking-tight">
            Adventure Game Engine
          </span>
          <div className="flex flex-row gap-2">
            <Link
              className="flex w-28 flex-row items-center gap-1 rounded-sm bg-violet-700 px-4 py-2 hover:bg-violet-600 active:bg-violet-800"
              href={`/game/${props.gameId}/room/new`}
            >
              <Plus className="size-3.5 stroke-3 text-white" />
              <span className="text-xs font-semibold tracking-tight text-white">
                Add Room
              </span>
            </Link>
            <Link
              className="flex w-28 flex-row items-center gap-1 rounded-sm border border-violet-700 px-4 py-2 transition-colors hover:bg-violet-100 active:bg-violet-300"
              href={`/game/${props.gameId}/entity/new`}
            >
              <Plus className="size-3.5 stroke-3 text-violet-700" />{" "}
              <span className="text-xs font-semibold tracking-tight text-violet-700">
                Add Entity
              </span>
            </Link>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rooms</SidebarGroupLabel>
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
