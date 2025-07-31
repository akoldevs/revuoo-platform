// src/app/dashboard/contributor/assignments/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function claimAssignment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to claim an assignment." };
  }

  const assignmentId = formData.get("assignmentId");

  if (!assignmentId) {
    return { error: "Missing assignment ID." };
  }

  // Update the assignment row in the database
  // Set the status to 'claimed' and assign it to the current user
  // The WHERE clause also ensures that two people can't claim the same assignment at once.
  const { data, error } = await supabase
    .from("assignments")
    .update({
      status: "claimed",
      contributor_id: user.id,
    })
    .eq("id", assignmentId)
    .eq("status", "open") // Important: Only claim it if it's still 'open'
    .select();

  if (error) {
    console.error("Error claiming assignment:", error);
    return { error: "Database error: Could not claim assignment." };
  }

  if (data && data.length === 0) {
    // This means the assignment was likely already claimed by someone else.
    return { error: "This assignment is no longer available." };
  }

  // Refresh the page to show the updated list of open assignments
  revalidatePath("/dashboard/contributor/assignments");

  return { success: "Assignment claimed successfully!" };
}
