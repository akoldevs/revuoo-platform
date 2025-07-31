// src/app/dashboard/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ✅ FETCH PROFILE AND PERSONAS
  const [profileRes, personasRes] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase.rpc("get_user_personas", { p_user_id: user.id }),
  ]);

  const profile = profileRes.data;
  const personas = personasRes.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* ✅ PASS PERSONAS TO SIDEBAR */}
        <SidebarNav profile={profile} personas={personas} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
