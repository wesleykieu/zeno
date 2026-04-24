import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AppSidebar } from "@/components/app-sidebar";
import { TokenGuard } from "@/components/token-guard";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { QuickLinks } from "@/components/dashboard/quick-links";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <SidebarProvider defaultOpen={false}>
      <TokenGuard />
      <AppSidebar user={session.user} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="ml-auto">
            <QuickLinks />
          </div>
        </header>
        <div className="p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
