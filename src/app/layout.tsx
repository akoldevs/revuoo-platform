// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer' // <-- 1. IMPORT
import AuthProvider from '@/components/AuthProvider'

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
      <body className="flex flex-col min-h-screen"> {/* <-- Add flex classes */}
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main> {/* <-- Add flex-grow */}
          <Footer /> {/* <-- 2. ADD THE FOOTER */}
        </AuthProvider>
      </body>
    </html>
  )
}