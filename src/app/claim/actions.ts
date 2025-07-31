// src/app/claim/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function claimBusiness(formData: FormData) {
  const supabase = await createClient();
  const businessId = formData.get("businessId") as string;
  const businessSlug = formData.get("businessSlug") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }
  if (!businessId) {
    throw new Error("Business ID is missing.");
  }

  // The Server Action now just makes one simple, secure call to our new database function.
  const { error } = await supabase.rpc("claim_business_for_user", {
    p_business_id: Number(businessId),
  });

  if (error) {
    console.error("--- Error claiming business profile ---", error);
    // We can redirect with an error message in the future if we want.
    // For now, redirecting to the page might be enough.
    return redirect(`/business/${businessSlug}?error=claim_failed`);
  }

  // If successful, revalidate the paths and redirect to the new dashboard.
  revalidatePath(`/business/${businessSlug}`);
  revalidatePath("/dashboard/business");

  redirect("/dashboard/business");
}
