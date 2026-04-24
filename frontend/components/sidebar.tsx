"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Mail, Bell, LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/subscriptions", label: "Subscriptions", icon: Mail },
  { href: "/dashboard/watchers", label: "Watchers", icon: Bell },
  { href: "/dashboard/digest", label: "Digest", icon: BookOpen },
];

interface SidebarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full">
      <div className="px-5 py-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white rounded-lg p-1.5">
            <Mail className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white">Zeno AI</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start gap-3 font-medium",
              pathname === item.href
                ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/25 hover:text-blue-400"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <Link href={item.href}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          {user?.image && (
            <img src={user.image} alt="" className="w-7 h-7 rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">{user?.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
