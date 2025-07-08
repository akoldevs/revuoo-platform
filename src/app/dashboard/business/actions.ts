// src/app/dashboard/business/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBusinessProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const businessId = formData.get("businessId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const phone_number = formData.get("phone_number") as string;
  const website_url = formData.get("website_url") as string;
  const business_email = formData.get("business_email") as string;

  if (!businessId || !name) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      name,
      description,
      address,
      phone_number,
      website_url,
      business_email,
    })
    .eq("id", businessId);

  if (error) {
    console.error("Error updating business:", error);
    throw new Error("Failed to update business profile.");
  }

  revalidatePath("/dashboard/business");
}
