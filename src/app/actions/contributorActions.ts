"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- claimAssignment function remains unchanged ---
export async function claimAssignment(
  prevState: { success: string | null; error: string | null },
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: null,
      error: "You must be logged in to claim an assignment.",
    };
  }

  const contributorId = user.id;
  const assignmentId = formData.get("assignmentId") as string;

  if (!assignmentId) {
    return { success: null, error: "Assignment ID is missing." };
  }

  const { error } = await supabase
    .from("assignments")
    .update({
      status: "in_progress",
      contributor_id: contributorId,
    })
    .eq("id", assignmentId)
    .eq("status", "open");

  if (error) {
    console.error("Error claiming assignment:", error);
    return {
      success: null,
      error:
        "This assignment may have already been claimed. Please refresh and try another.",
    };
  }

  revalidatePath(`/dashboard/contributor/assignments/${assignmentId}`);
  revalidatePath("/dashboard/contributor/assignments");
  revalidatePath("/dashboard/contributor/content");

  return {
    success: "Assignment successfully claimed! You can now submit your work.",
    error: null,
  };
}

// --- ✅ UPDATED submitExpertReview function ---
const reviewSchema = z.object({
  reviewId: z.string().optional(), // It's a revision if this exists
  assignmentId: z.coerce.number().min(1),
  title: z.string().min(10, "Title must be at least 10 characters."),
  summary: z.string().min(50, "Summary must be at least 50 characters."),
  bodyContent: z.string().min(100, "The main review content is too short."),
  ratingOverall: z.coerce.number().min(1).max(5),
  ratingPros: z
    .string()
    .min(3)
    .transform((val) => val.split(",").map((s) => s.trim())),
  ratingCons: z
    .string()
    .min(3)
    .transform((val) => val.split(",").map((s) => s.trim())),
});

export async function submitExpertReview(
  prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit a review." };
  }

  const validatedFields = reviewSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten());
    return { error: "Form validation failed. Please check your inputs." };
  }

  const { reviewId, assignmentId, ...reviewData } = validatedFields.data;

  let parsedBodyContent: unknown;
  try {
    parsedBodyContent = JSON.parse(reviewData.bodyContent);
  } catch {
    return {
      error: "The review content appears to be malformed. Please try again.",
    };
  }

  const dataToUpsert = {
    assignment_id: assignmentId,
    contributor_id: user.id,
    title: reviewData.title,
    summary: reviewData.summary,
    body_content: parsedBodyContent,
    rating_overall: reviewData.ratingOverall,
    rating_pros: reviewData.ratingPros,
    rating_cons: reviewData.ratingCons,
    status: "pending_approval", // Always reset status on submission/resubmission
    moderator_notes: null, // Clear previous notes on resubmission
  };

  let dbError;

  if (reviewId) {
    // This is a REVISION of an existing review.
    // We use UPDATE to modify the existing record.
    const { error } = await supabase
      .from("expert_reviews")
      .update(dataToUpsert)
      .eq("id", reviewId)
      .eq("contributor_id", user.id); // Security check
    dbError = error;
  } else {
    // This is a BRAND NEW submission.
    // We use INSERT to create a new record.
    const { error } = await supabase
      .from("expert_reviews")
      .insert(dataToUpsert);
    dbError = error;
  }

  if (dbError) {
    console.error("Database operation failed:", dbError);
    return {
      error: "A database error occurred. Failed to save the submission.",
    };
  }

  // If this was a new submission, update the assignment status.
  if (!reviewId) {
    await supabase
      .from("assignments")
      .update({ status: "submitted" })
      .eq("id", assignmentId);
  }

  revalidatePath("/dashboard/contributor/content");

  return { success: "Your review has been submitted for approval!" };
}

// --- Other functions remain unchanged ---

type PerformanceData = {
  review_id: string;
  review_title: string;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes: number;
  impact_score: number;
};

export async function getPerformanceInsight(
  performanceData: PerformanceData[]
): Promise<string> {
  if (!performanceData || performanceData.length === 0) {
    return "You don't have any approved reviews yet. Once your reviews are published and get some views, I can provide performance insights.";
  }

  const summaryForAI = performanceData.map((p) => ({
    title: p.review_title,
    score: p.impact_score,
    views: p.view_count,
    helpful: p.helpful_votes,
  }));

  const prompt = `
    You are an expert "Performance Coach" for writers on a review platform called Revuoo.
    Your tone should be encouraging, insightful, and actionable.
    A contributor has requested feedback on their performance.
    Here is a summary of their published reviews and their "Impact Score" (0-100):
    ${JSON.stringify(summaryForAI, null, 2)}

    Based on this data, provide a short, personalized coaching message (2-3 paragraphs).
    Identify what they are doing well and suggest a specific, actionable tip for improvement.
    Do not just list the data back to them. Provide genuine insight.
  `;

  try {
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`API call failed with status: ${response.status}`);

    const result = await response.json();

    if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response structure from AI API.");
    }
  } catch (error) {
    console.error("AI insight fetch failed:", error);
    return "Sorry, I couldn't generate feedback at this time. Please try again later.";
  }
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<{ error?: string; success?: boolean }> {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to send a message." };
  }

  const { data: participant, error: participantError } = await supabase
    .from("conversation_participants")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("participant_id", user.id)
    .single();

  if (participantError || !participant) {
    return {
      error: "You are not authorized to send messages in this conversation.",
    };
  }

  const { error: insertError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: content,
  });

  if (insertError) {
    console.error("Error sending message:", insertError);
    return { error: "Failed to send the message. Please try again." };
  }

  revalidatePath("/dashboard/contributor/inbox");

  return { success: true };
}

export async function createStripeConnectLink(): Promise<{
  error?: string;
  url?: string;
}> {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  console.log("Simulating Stripe Connect link creation...");
  revalidatePath("/dashboard/contributor/payouts");
  return { url: "/dashboard/contributor/payouts?stripe-connected=true" };
}

export async function disconnectStripeAccount(): Promise<{
  error?: string;
  success?: string;
}> {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  console.log("Simulating Stripe account disconnection...");
  revalidatePath("/dashboard/contributor/payouts");
  return { success: "Your Stripe account has been disconnected." };
}
