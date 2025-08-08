import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SidebarProvider disableKeyboardShortcut={true}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <main className="grid w-full place-items-center text-center">
            <h1 className="mb-4 text-4xl font-bold">Adventure Game Engine</h1>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
