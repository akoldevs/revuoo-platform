// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import Head from "next/head"; // ✅ Import Head to inject meta tags

export const metadata: Metadata = {
  title: "Revuoo - Unbiased Reviews & Expert Blogs",
  description:
    "Discover. Review. Decide – Smarter. Unbiased reviews & expert blogs on services, products, apps, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        {/* ✅ Temporarily block search engine indexing */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <body>
        <Toaster richColors position="top-center" />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
