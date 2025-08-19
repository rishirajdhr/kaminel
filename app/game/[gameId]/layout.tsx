import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GameSidebar } from "@/features/games/components/sidebar";

export default async function GameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  return (
    <SidebarProvider disableKeyboardShortcut={true}>
      <GameSidebar gameId={Number.parseInt(gameId)} variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
