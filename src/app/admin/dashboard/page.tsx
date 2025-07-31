// src/app/admin/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Welcome!</h1>
      <p>You have successfully logged in.</p>
      <p>
        Your email is: <strong>{user.email}</strong>
      </p>
      <p>Please check your browser's Local Storage now.</p>
    </div>
  );
}
