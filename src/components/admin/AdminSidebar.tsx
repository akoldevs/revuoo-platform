// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  BarChart3,
  Receipt,
  BookOpen,
  Puzzle,
  HeartHandshake,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ 1. Each nav item now has a 'permission' key that matches our database.
const navGroups = [
  {
    title: "Operations",
    items: [
      {
        href: "/admin",
        label: "Moderation Queue",
        icon: ShieldCheck,
        permission: "nav.view_moderation_queue",
      },
      {
        href: "/admin/users",
        label: "User Management",
        icon: Users,
        permission: "nav.view_user_management",
      },
      {
        href: "/admin/businesses",
        label: "Business Management",
        icon: Briefcase,
        permission: "nav.view_business_management",
      },
      {
        href: "/admin/contributors",
        label: "Contributor Signals",
        icon: MessageSquare,
        permission: "nav.view_contributor_signals",
      },

      {
        href: "/admin/chat",
        label: "Team Chat",
        icon: MessageSquare,
        permission: "nav.view_team_chat",
      },
    ],
  },
  {
    title: "Growth",
    items: [
      {
        href: "/admin/analytics",
        label: "Platform Analytics",
        icon: BarChart3,
        permission: "nav.view_platform_analytics",
      },
      {
        href: "/admin/billing",
        label: "Revenue & Billing",
        icon: Receipt,
        permission: "nav.view_revenue_billing",
      },
      {
        href: "/admin/marketing",
        label: "Marketing",
        icon: Megaphone,
        permission: "nav.view_marketing",
        disabled: false,
      },
      {
        href: "/admin/sales",
        label: "Sales CRM",
        icon: HeartHandshake,
        permission: "nav.view_sales_crm",
        disabled: false,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        href: "/admin/content",
        label: "Content Mgmt",
        icon: BookOpen,
        permission: "nav.view_content_management",
      },
      {
        href: "/admin/integrations",
        label: "Integrations",
        icon: Puzzle,
        permission: "nav.view_integrations",
        disabled: false,
      },
      {
        href: "/admin/support",
        label: "Support Tickets",
        icon: Users,
        permission: "nav.view_support",
        disabled: false,
      },
      {
        href: "/admin/settings",
        label: "System Settings",
        icon: Settings,
        permission: "nav.view_system_settings",
      },
    ],
  },
];

// ✅ 2. The component now accepts the 'permissions' prop.
export default function AdminSidebar({
  permissions,
}: {
  permissions: Set<string>;
}) {
  const pathname = usePathname();

  // ✅ 3. We filter the navigation groups based on the user's permissions.
  const filteredNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => permissions.has(item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="w-64 h-screen bg-card text-card-foreground border-r flex flex-col sticky top-0">
      <div className="p-4 border-b">
        <Link href="/admin" className="font-bold text-2xl">
          Revuoo <span className="text-primary">Admin OS</span>
        </Link>
      </div>
      <nav className="flex-grow p-2 space-y-1">
        {/* ✅ 4. We now map over the newly filtered groups and items. */}
        {filteredNavGroups.map((group) => (
          <div key={group.title}>
            <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </h4>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                  item.disabled
                    ? "cursor-not-allowed text-muted-foreground/50 hover:bg-transparent"
                    : ""
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
