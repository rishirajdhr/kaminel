"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Entity } from "@/features/entities/types";

export function EntitySubItem({ entity }: { entity: Entity }) {
  const pathname = usePathname();
  const href = `/game/${entity.gameId}/entity/${entity.id}`;
  const isActive = pathname.startsWith(href);

  return (
    <SidebarMenuSubItem key={entity.name}>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link href={href}>{entity.name}</Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
