// src/components/dashboard/SidebarNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Star,
  MessageSquare,
  Bookmark,
  Settings,
  PenSquare,
  Building,
  Puzzle,
  ChevronsUpDown,
  GalleryHorizontal,
  BarChart2,
  Link as LinkIcon,
  Inbox,
  LifeBuoy, // ✅ 1. Ensure LifeBuoy is imported
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Role = "user" | "contributor" | "business";

interface SidebarNavProps {
  profile: {
    full_name?: string | null;
  } | null;
  personas: string[] | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItemsConfig: Record<Role, NavItem[]> = {
  user: [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/my-reviews", label: "My Reviews", icon: Star },
    {
      href: "/dashboard/my-contributions",
      label: "My Contributions",
      icon: MessageSquare,
    },
    { href: "/dashboard/saved", label: "Saved Items", icon: Bookmark },
    {
      href: "/dashboard/support?from=user",
      label: "Support Tickets",
      icon: LifeBuoy,
    },
  ],
  contributor: [
    { href: "/dashboard/contributor", label: "Contributor Hub", icon: Home },
    {
      href: "/dashboard/contributor/content",
      label: "My Content",
      icon: PenSquare,
    },
    {
      href: "/dashboard/contributor/inbox",
      label: "Inbox",
      icon: Inbox,
    },
    {
      href: "/dashboard/support?from=contributor",
      label: "Support Tickets",
      icon: LifeBuoy,
    },
  ],
  business: [
    { href: "/dashboard/business", label: "Business Overview", icon: Home },
    {
      href: "/dashboard/business/reviews",
      label: "Manage Reviews",
      icon: Star,
    },
    {
      href: "/dashboard/business/invitations",
      label: "Invitation Tools",
      icon: LinkIcon,
    },

    {
      href: "/dashboard/business/integrations",
      label: "Integrations",
      icon: Puzzle,
    },

    { href: "/dashboard/business/edit", label: "Edit Profile", icon: Building },

    {
      href: "/dashboard/business/gallery",
      label: "Manage Gallery",
      icon: GalleryHorizontal,
    },
    {
      href: "/dashboard/business/analytics",
      label: "View Analytics",
      icon: BarChart2,
    },
    {
      href: "/dashboard/support?from=business",
      label: "Support Tickets",
      icon: LifeBuoy,
    },
  ],
};

const settingsNavItem: NavItem = {
  href: "/dashboard/account",
  label: "Account Settings",
  icon: Settings,
};

const roleLabels: Record<Role, string> = {
  user: "User Dashboard",
  contributor: "Contributor Hub",
  business: "Business Dashboard",
};

export default function SidebarNav({ profile, personas }: SidebarNavProps) {
  const pathname = usePathname();
  const userRoles = (personas as Role[]) || ["user"];

  const getInitialView = (): Role => {
    if (pathname.startsWith("/dashboard/contributor")) return "contributor";
    if (pathname.startsWith("/dashboard/business")) return "business";
    return "user";
  };

  const [currentView, setCurrentView] = useState<Role>(getInitialView());
  const navItems = navItemsConfig[currentView];

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col sticky top-0">
      <div className="p-4 border-b">
        <Link href="/" className="font-bold text-2xl">
          Revuoo
        </Link>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={undefined}
              alt={profile?.full_name || "User avatar"}
            />
            <AvatarFallback>
              {profile?.full_name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">
              {profile?.full_name || "Unnamed"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {roleLabels[currentView]}
            </p>
          </div>
        </div>
      </div>
      {userRoles.length > 1 && (
        <div className="p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Switch Workspace</span>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {userRoles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onSelect={() => setCurrentView(role)}
                  asChild
                >
                  <Link
                    href={role === "user" ? "/dashboard" : `/dashboard/${role}`}
                    className="w-full"
                  >
                    {roleLabels[role] || "Workspace"}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <nav className="flex-grow p-4 space-y-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-2 pt-4 border-t">
          <li>
            <Link
              href={`${settingsNavItem.href}?view=${currentView}`}
              className={cn(
                "flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith(settingsNavItem.href)
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <settingsNavItem.icon className="h-5 w-5" />
              <span>{settingsNavItem.label}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
