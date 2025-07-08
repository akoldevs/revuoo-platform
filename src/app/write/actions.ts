"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase"; // Optional: your typed DB schema

export async function submitReview(formData: FormData): Promise<void> {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Auth error:", authError.message);
    throw new Error("Authentication failed.");
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const title = formData.get("title")?.toString().trim();
  const summary = formData.get("summary")?.toString().trim();

  if (!title || !summary) {
    throw new Error("Missing required fields.");
  }

  const reviewData = {
    title,
    summary,
    business_id: 1, // TODO: Replace with dynamic business ID
    author_id: user.id,
    status: "pending",
  };

  const { error: insertError } = await supabase
    .from("reviews")
    .insert(reviewData);

  if (insertError) {
    console.error("Error inserting review:", insertError.message);
    throw new Error("Failed to submit review.");
  }

  revalidatePath("/reviews");
  redirect("/dashboard/my-reviews");
}
