"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function searchBusinesses(query: string) {
  if (!query) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, slug")
    .ilike("name", `%${query}%`)
    .limit(5);

  if (error) {
    console.error("Error searching businesses:", error);
    return [];
  }

  return data;
}

export async function submitReview(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in to write a review.");

  const businessId = formData.get("businessId");
  const title = formData.get("title");
  const summary = formData.get("summary");
  const serviceDate = formData.get("service_date");

  const quality = Number(formData.get("quality"));
  const professionalism = Number(formData.get("professionalism"));
  const punctuality = Number(formData.get("punctuality"));
  const communication = Number(formData.get("communication"));
  const value = Number(formData.get("value"));

  if (
    !businessId ||
    !title ||
    !summary ||
    !quality ||
    !professionalism ||
    !punctuality ||
    !communication ||
    !value
  ) {
    throw new Error("Please fill out all required fields.");
  }

  const overall_rating =
    (quality + professionalism + punctuality + communication + value) / 5;

  const reviewData = {
    author_id: user.id,
    business_id: Number(businessId),
    title: String(title),
    summary: String(summary),
    service_date: serviceDate ? String(serviceDate) : null,
    status: "pending",
    quality,
    professionalism,
    punctuality,
    communication,
    value,
    overall_rating,
  };

  // ✅ FIX: Perform the INSERT operation first, without a chained .select()
  const { error: insertError } = await supabase
    .from("reviews")
    .insert(reviewData);

  if (insertError) {
    console.error("Error inserting review:", insertError);
    throw new Error(
      "There was a database error submitting your review. Please try again."
    );
  }

  // ✅ FIX: If the insert was successful, perform a separate, simple SELECT to get the slug.
  // This is more robust against RLS issues.
  const { data: businessData, error: selectError } = await supabase
    .from("businesses")
    .select("slug")
    .eq("id", Number(businessId))
    .single();

  if (selectError || !businessData) {
    console.error(
      "Error fetching business slug after review insert:",
      selectError
    );
    // Even if this fails, the review was submitted. We can redirect to a generic success page.
    redirect("/?review-submitted=true");
  }

  const businessSlug = businessData.slug;

  revalidatePath(`/business/${businessSlug}`);
  revalidatePath("/admin");
  redirect(`/business/${businessSlug}?review-submitted=true`);
}
