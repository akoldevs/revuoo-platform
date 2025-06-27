// src/components/AuthButton.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-[88px] h-[40px] bg-gray-200 rounded-md animate-pulse"></div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">Hey, {session.user?.email}</span>
        <button onClick={() => signOut()} className="py-2 px-4 rounded-md no-underline bg-gray-200 hover:bg-gray-300">
          Logout
        </button>
      </div>
    )
  }

  return (
    <Link
      // This is the corrected link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-gray-200 hover:bg-gray-300"
    >
      Login
    </Link>
  )
}