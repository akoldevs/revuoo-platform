// src/components/Header.tsx
'use client'

import Link from 'next/link'
import AuthButton from './AuthButton'
import { useState } from 'react'
import * as React from 'react'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

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
                <Link href="/reviews" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Reviews
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Guides & Insights
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/categories" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Categories
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/write" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Write for Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>


        {/* Right Side: Auth Button and Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex">
            <AuthButton />
          </div>
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
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