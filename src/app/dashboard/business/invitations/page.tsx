// src/app/dashboard/business/invitations/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import InvitationClientPage from "./InvitationClientPage"; // Import our new client page

export const dynamic = "force-dynamic";

// This is now our main Server Component
export default async function ReviewInvitationsPageWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  // Fetch the business associated with the user
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!business) {
    return redirect("/for-businesses");
  }

  // Fetch the initial list of invitations
  const { data: invitations } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  // Render the client component, passing the fetched data as props
  return (
    <InvitationClientPage
      business={business}
      initialInvitations={invitations || []}
    />
  );
}
