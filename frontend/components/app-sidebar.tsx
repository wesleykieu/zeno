"use client"

import * as React from "react"
import { LayoutDashboard, Mail, Bell, BookOpen } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: Mail,
    },
    {
      title: "Watchers",
      url: "/dashboard/watchers",
      icon: Bell,
    },
    {
      title: "Digest",
      url: "/dashboard/digest",
      icon: BookOpen,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: { name?: string | null; email?: string | null; image?: string | null }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Mail className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Zeno</span>
                  <span className="truncate text-xs text-muted-foreground">Inbox zero, finally.</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name ?? "",
          email: user?.email ?? "",
          avatar: user?.image ?? "",
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
