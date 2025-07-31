// src/app/admin/layout.tsx
import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getUserPermissions } from "@/lib/permissions";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { ModalProvider } from "@/contexts/ModalContext"; // ✅ 1. Import the provider

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const permissions = await getUserPermissions();

  return (
    // ✅ 2. Wrap the entire layout with the ModalProvider
    <ModalProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar permissions={permissions} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        <CommandPalette />
      </div>
    </ModalProvider>
  );
}
