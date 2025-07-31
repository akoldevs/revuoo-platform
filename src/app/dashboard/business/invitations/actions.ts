// src/app/dashboard/business/invitations/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function generateInvitationLink(businessId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // Security check: ensure the user owns the business they're generating a link for
  const { data: business, error: ownerError } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();

  if (ownerError || !business) {
    return { error: "You are not authorized to perform this action." };
  }

  const { data, error } = await supabase
    .from("review_invitations")
    .insert({ business_id: businessId })
    .select("invitation_token")
    .single();

  if (error) {
    console.error("Error generating invitation:", error);
    return { error: "Failed to generate invitation link." };
  }

  revalidatePath("/dashboard/business/invitations");
  return {
    success: "New invitation link generated successfully!",
    token: data.invitation_token,
  };
}
