// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

// The 'robots' property is added to the metadata object
export const metadata: Metadata = {
  title: "Revuoo - Unbiased Reviews & Expert Blogs",
  description:
    "Discover. Review. Decide – Smarter. Unbiased reviews & expert blogs on services, products, apps, and more.",
  robots: {
    index: false, // Disallow indexing
    follow: false, // Disallow following links
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* The <Head> component is no longer needed here in the App Router */}
      <body>
        {/* Your excellent Toaster enhancement is kept! */}
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
