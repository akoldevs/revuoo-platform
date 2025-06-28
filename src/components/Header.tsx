// src/components/Header.tsx
'use client'

import Link from 'next/link'
import AuthButton from './AuthButton'
import { useState } from 'react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// Import all necessary shadcn/ui components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

// This is a helper component for displaying items within the mega menu
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
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
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleLinkClick = () => setIsMenuOpen(false)

  const categories: { title: string; href: string; description: string }[] = [
    {
      title: "Cleaning Services",
      href: "/categories/cleaning-services",
      description: "Find top-rated residential and commercial cleaning professionals.",
    },
    {
      title: "Handyman Services",
      href: "/categories/handyman-services",
      description: "For all your small repairs and odd jobs around the house.",
    },
    {
      title: "Moving Services",
      href: "/categories/moving-services",
      description: "Get help from reliable and efficient moving companies.",
    },
     {
      title: "All Categories",
      href: "/categories",
      description: "Browse all available service and product categories.",
    },
  ]

  return (
    <header className="w-full border-b border-b-foreground/10 h-16 sticky top-0 bg-white z-20">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center h-full px-6">
        
        <Link href="/" className="font-bold text-xl hover:underline mr-4">
          Revuoo
        </Link>

        {/* Middle: Desktop Navigation using the correct 'asChild' pattern */}
        <div className="hidden md:flex flex-grow justify-center">
          <NavigationMenu>
            <NavigationMenuList>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/reviews">Reviews</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/blog">Guides & Insights</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* --- THIS IS THE MEGA MENU --- */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {categories.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* --- END OF MEGA MENU --- */}

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/write">Write for Us</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>


        {/* Right Side */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex">
            <AuthButton />
          </div>
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {/* Hamburger Icon SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-10">
          <nav className="flex flex-col items-start space-y-2 p-4">
            <Link href="/reviews" className="p-2 w-full rounded-md hover:bg-gray-100" onClick={handleLinkClick}>Reviews</Link>
            <Link href="/blog" className="p-2 w-full rounded-md hover:bg-gray-100" onClick={handleLinkClick}>Guides & Insights</Link>
            <Link href="/categories" className="p-2 w-full rounded-md hover:bg-gray-100" onClick={handleLinkClick}>Categories</Link>
            <Link href="/write" className="p-2 w-full rounded-md hover:bg-gray-100" onClick={handleLinkClick}>Write for Us</Link>
            <div className="border-t w-full pt-4 mt-2">
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}