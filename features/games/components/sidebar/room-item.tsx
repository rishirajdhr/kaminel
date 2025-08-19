"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Entity } from "@/features/entities/types";
import { Room } from "@/features/rooms/types";
import { EntitySubItem } from "./entity-subitem";

export function RoomItem({ room }: { room: Room & { entities: Entity[] } }) {
  const pathname = usePathname();
  const href = `/game/${room.gameId}/room/${room.id}`;
  const isActive = pathname.startsWith(href);

  return (
    <Collapsible className="group/collapsible" key={room.name}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link href={href}>
              <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
              <span>{room.name}</span>
            </Link>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {room.entities.map((entity) => (
              <EntitySubItem key={entity.id} entity={entity} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
