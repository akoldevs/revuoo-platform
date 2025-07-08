"use client";

import Link from "next/link";
import { Menu, X, Star, User, PanelTop, LifeBuoy } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MobileMenu({
  user,
  profile,
}: {
  user: any;
  profile: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 sm:w-80 pt-6 pb-8 px-5"
        aria-label="Mobile Navigation Menu"
      >
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-xl font-bold"
            onClick={() => setOpen(false)}
          >
            Revuoo
          </Link>
        </div>

        <nav className="space-y-3">
          <Link
            href="/reviews"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            All Reviews
          </Link>
          <Link
            href="/categories"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Categories
          </Link>
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Guides & Insights
          </Link>
          <Link
            href="/businesses"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Top Businesses
          </Link>
          <Link
            href="/for-businesses"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            For Businesses
          </Link>
          <Link
            href="/write-a-review"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-indigo-600"
          >
            Write a Review
          </Link>
        </nav>

        <div className="mt-8 border-t pt-6 space-y-3">
          {user ? (
            <>
              <Link
                href="/dashboard/my-reviews"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600"
              >
                <Star className="h-4 w-4" /> Your Reviews
              </Link>
              <Link
                href="/dashboard/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600"
              >
                <User className="h-4 w-4" /> My Account
              </Link>
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600"
                >
                  <PanelTop className="h-4 w-4" /> Admin Dashboard
                </Link>
              )}
              <Link
                href="/support"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600"
              >
                <LifeBuoy className="h-4 w-4" /> Support
              </Link>
              <form action="/logout" method="post" className="pt-4">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  Log Out
                </Button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-indigo-600"
            >
              Log In / Sign Up
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
