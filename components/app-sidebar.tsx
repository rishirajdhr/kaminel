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
import { ChevronRight } from "lucide-react";

const rooms = [
  {
    name: "Dungeon",
    description:
      "You are in a dark dungeon. You can see a light in the distance.",
    exits: {
      north: null,
      south: "Hallway",
      east: null,
      west: null,
    },
    entities: [
      {
        name: "Poster",
        description:
          "There is a poster on the wall. It says 'Welcome to Castle Murray! Wish you good luck!'",
      },
    ],
  },
  {
    name: "Hallway",
    description: "You are in a hallway. You can see a door to the north.",
    exits: {
      north: "Dungeon",
      south: null,
      east: null,
      west: null,
    },
    entities: [
      {
        name: "Chandelier",
        description: "There is a chandelier.",
      },
    ],
  },
];

export function AppSidebar(
  props: Pick<ComponentProps<typeof Sidebar>, "variant">
) {
  return (
    <Sidebar variant={props.variant}>
      <SidebarHeader>Adventure Game Engine</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rooms</SidebarGroupLabel>
          <SidebarMenu>
            {rooms.map((room) => (
              <Collapsible className="group/collapsible" key={room.name}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      <span>{room.name}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {room.entities.map((entity) => (
                        <SidebarMenuSubItem key={entity.name}>
                          <SidebarMenuSubButton>
                            {entity.name}
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
