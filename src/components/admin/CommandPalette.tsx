// src/components/admin/CommandPalette.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ShieldCheck,
  Users,
  Briefcase,
  Settings,
  Receipt,
  User,
  HeartHandshake,
  Megaphone,
  BookOpen,
  Puzzle,
  LifeBuoy,
  PlusCircle,
  MessageSquare,
  BarChart3,
  Contact, // For User/Business results
  ChevronsRight, // For Navigation results
  Zap, // For Action results
} from "lucide-react";
import { commandPaletteSearch } from "@/app/admin/actions";
import { useDebounce } from "use-debounce";
import { useModal } from "@/contexts/ModalContext";

type SearchResult = {
  result_id: string;
  result_type: "User" | "Business";
  name: string;
  email: string | null;
  href: string;
};

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { openModal } = useModal();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length > 1) {
        setIsLoading(true);
        const { data, error } = await commandPaletteSearch(debouncedQuery);
        setIsLoading(false);
        if (error) {
          console.error(error);
          return;
        }
        setResults(data || []);
      } else {
        setResults([]);
      }
    };
    performSearch();
  }, [debouncedQuery]);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    setQuery("");
    command();
  };

  const runQuickAction = (modalType: "addRole" | "addDiscount") => {
    setOpen(false);
    setQuery("");
    setTimeout(() => {
      openModal(modalType);
    }, 50);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for users, businesses, or pages..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {isLoading ? "Searching..." : "No results found."}
        </CommandEmpty>

        {results.length > 0 && (
          // ✅ ENHANCEMENT: Clearer visual grouping for search results
          <CommandGroup heading="👥 Records">
            {results.map((result) => (
              <CommandItem
                key={`${result.result_type}-${result.result_id}`}
                onSelect={() => runCommand(() => router.push(result.href))}
              >
                {result.result_type === "User" ? (
                  <User className="mr-2 h-4 w-4" />
                ) : (
                  <Briefcase className="mr-2 h-4 w-4" />
                )}
                <div className="flex flex-col">
                  <span>{result.name}</span>
                  {result.email && (
                    <span className="text-xs text-muted-foreground">
                      {result.email}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* ✅ ENHANCEMENT: Clearer visual grouping for actions */}
        <CommandGroup heading="⚡ Quick Actions">
          <CommandItem
            onSelect={() => runQuickAction("addDiscount")}
            keywords={["discount", "create", "promotion", "code"]}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create New Discount</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runQuickAction("addRole")}
            keywords={["role", "user", "permission", "rbac"]}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create New Role</span>
          </CommandItem>
        </CommandGroup>

        {/* ✅ ENHANCEMENT: Clearer visual grouping for navigation and added keywords for fuzzy search */}
        <CommandGroup heading="📊 Modules">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin"))}
            keywords={["moderation", "reviews", "queue"]}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Moderation Queue</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/users"))}
            keywords={["users", "management"]}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>User Management</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/businesses"))}
            keywords={["business", "companies"]}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Business Management</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/admin/contributors"))
            }
            keywords={["contributors", "signals", "experts"]}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Contributor Signals</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/analytics"))}
            keywords={["analytics", "stats", "platform"]}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Platform Analytics</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/billing"))}
            keywords={["billing", "revenue", "money", "subscriptions"]}
          >
            <Receipt className="mr-2 h-4 w-4" />
            <span>Revenue & Billing</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/marketing"))}
            keywords={["marketing", "promotions", "growth"]}
          >
            <Megaphone className="mr-2 h-4 w-4" />
            <span>Marketing</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/sales"))}
            keywords={["sales", "crm", "leads", "opportunities"]}
          >
            <HeartHandshake className="mr-2 h-4 w-4" />
            <span>Sales CRM</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/content"))}
            keywords={["content", "management", "blog", "guides", "faqs"]}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Content Management</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/admin/integrations"))
            }
            keywords={["integrations", "zapier", "shopify"]}
          >
            <Puzzle className="mr-2 h-4 w-4" />
            <span>Integrations</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/support"))}
            keywords={["support", "tickets", "help"]}
          >
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support Tickets</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/admin/settings"))}
            keywords={["settings", "system", "configuration"]}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>System Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
