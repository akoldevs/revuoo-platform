// src/components/Header.tsx

import Link from "next/link";
import AuthButton from "./AuthButton";
import { createClient } from "@/lib/supabase/server";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LifeBuoy, PanelTop, Star, User } from "lucide-react";
import LogoutButton from "./LogoutButton";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React from "react";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("users")
        .select("full_name, role")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <header className="w-full border-b h-16 sticky top-0 bg-white/95 backdrop-blur-sm z-20">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center h-full px-6">
        {/* Left: Logo + Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-xl hover:underline"
            aria-label="Revuoo Home"
          >
            Revuoo
          </Link>

          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden md:flex"
          >
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem href="/reviews" title="All Reviews">
                        Browse a feed of the latest reviews from our entire
                        community.
                      </ListItem>
                      <ListItem href="/categories" title="Categories">
                        Find top-rated services and products in specific
                        categories.
                      </ListItem>
                      <ListItem href="/blog" title="Guides & Insights">
                        Read expert-written articles to help you make smarter
                        decisions.
                      </ListItem>
                      <ListItem href="/businesses" title="Top Businesses">
                        Discover the highest-rated businesses on the platform.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        {/* Right: Auth + CTA + Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative"
                    aria-label="User Menu"
                  >
                    {profile?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/my-reviews">
                      <Star className="mr-2 h-4 w-4" />
                      <span>Your Reviews</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/account">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {profile?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <PanelTop className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/support">
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:flex"
                  aria-label="For Businesses"
                >
                  <Link href="/for-businesses">For Businesses</Link>
                </Button>
                <AuthButton />
              </>
            )}
            <div className="hidden sm:block h-6 border-l mx-2"></div>
            <Button asChild aria-label="Write a Review">
              <Link href="/write-a-review">Write a Review</Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <MobileMenu user={user} profile={profile} />
          </div>
        </div>
      </div>
    </header>
  );
}
