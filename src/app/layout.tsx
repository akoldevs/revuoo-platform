// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import AuthListener from '@/components/AuthListener' // <-- 1. IMPORT

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Revuoo - Unbiased Reviews & Expert Blogs',
  description: 'Discover. Review. Decide – Smarter. Unbiased reviews & expert blogs on services, products, apps, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthListener /> {/* <-- 2. ADD THE LISTENER */}
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}