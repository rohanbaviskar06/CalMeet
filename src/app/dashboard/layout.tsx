import { AppSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/20 w-full">
        <AppSidebar user={session.user} />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="container mx-auto">
                {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
