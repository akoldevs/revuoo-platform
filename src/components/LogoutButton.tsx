// src/components/LogoutButton.tsx
'use client'

import { createClient } from '@/lib/supabase/client' // <-- Use the new client helper
import { DropdownMenuItem } from './ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation' // <-- Import the router

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Manually refresh the page to update the header
    router.refresh() 
  }

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  )
}