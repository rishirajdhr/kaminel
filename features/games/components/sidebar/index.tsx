import Link, { LinkProps } from "next/link";

type Props = {
  primary: Array<{
    label: string;
    icon: React.ReactNode;
    href: LinkProps["href"];
  }>;
  secondary: Array<{ label: string; href: LinkProps["href"] }>;
};

export async function GameSidebar(props: Props) {
  return (
    <aside className="flex flex-row items-stretch">
      <nav className="h-full w-16">
        {props.primary.map((category) => (
          <Link
            className="flex size-16 flex-col gap-1 p-2"
            href={category.href}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </Link>
        ))}
      </nav>
      <nav className="h-full w-48">
        {props.secondary.map((entry) => (
          <Link className="h-12 w-48" href={entry.href}>
            {entry.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

// return (
//   <Sidebar variant={props.variant}>
//     <SidebarHeader>
//       <div className="flex flex-col items-center gap-2">
//         <Link href="/">
//           <span className="inline-block text-xl font-semibold tracking-tight">
//             Adventure Game Engine
//           </span>
//         </Link>
//         <div className="flex flex-row gap-2">
//           <Button variant="outline" size="sm" asChild>
//             <Link className="" href={`/game/${props.gameId}/room/new`}>
//               <Plus className="stroke-3" />
//               <span className="">Add Room</span>
//             </Link>
//           </Button>
//           <Button variant="outline" size="sm" asChild>
//             <Link className="" href={`/game/${props.gameId}/entity/new`}>
//               <Plus className="stroke-3" />{" "}
//               <span className="">Add Entity</span>
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </SidebarHeader>
//     <SidebarContent>
//       <SidebarGroup>
//         <SidebarGroupLabel>Rooms</SidebarGroupLabel>
//         <SidebarGroupAction title="Game Landing Page" asChild>
//           <Link href={`/game/${props.gameId}`}>
//             <House className="text-gray-600" />{" "}
//             <span className="sr-only">Game Landing Page</span>
//           </Link>
//         </SidebarGroupAction>
//         <SidebarMenu>
//           {rooms.map((room) => (
//             <RoomItem key={room.id} room={room} />
//           ))}
//         </SidebarMenu>
//       </SidebarGroup>
//     </SidebarContent>
//   </Sidebar>
// );
