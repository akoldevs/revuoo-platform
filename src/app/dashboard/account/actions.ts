// src/app/dashboard/account/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Define a type for our form state for better type safety
interface FormState {
  success: boolean;
  message?: string | null;
  error?: string | null;
}

type PortfolioBadge = {
  name: string;
  description: string;
  earned_at: string;
};

// ✅ Define the specific shape of a review in the portfolio
type PortfolioReview = {
  id: string;
  title: string;
  summary: string | null;
  published_at: string;
  rating: number;
};

// This type defines the structure of the exported portfolio data
type PortfolioData = {
  profile: {
    full_name: string | null;
    username: string | null;
    bio: string | null;
    portfolio_url: string | null;
  };
  // ✅ FIX: Replace 'any[]' with our new, specific types
  badges: PortfolioBadge[];
  reviews: PortfolioReview[];
};

export async function exportPortfolio(): Promise<{
  error?: string;
  data?: PortfolioData;
}> {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // Use the function we already created for the public profile page
  const { data: profileData, error: profileError } = await supabase.rpc(
    "get_public_contributor_profile_by_id",
    { p_user_id: user.id }
  );

  if (profileError || !profileData) {
    console.error("Error fetching portfolio data:", profileError);
    return { error: "Could not fetch your portfolio data." };
  }

  // The RPC function returns a single JSON object which is what we want to export
  return { data: profileData as PortfolioData };
}

// === Update User Profile ===
export async function updateUserProfile(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;

  if (!fullName || !username) {
    return { success: false, error: "Full name and username are required." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, username: username })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Failed to update profile. The username might already be taken.",
    };
  }

  revalidatePath("/dashboard/account");
  revalidatePath("/dashboard");

  return { success: true, message: "Profile updated successfully!" };
}

// === Update User Password === (Currently unused, but signature is correct)
export async function updateUserPassword(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) {
    return { success: false, error: "Both password fields are required." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }
  if (newPassword.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long.",
    };
  }

  const { auth } = supabase;
  const { error } = await auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      error: "Failed to update password. Please try again.",
    };
  }

  return { success: true, message: "Password updated successfully!" };
}

// === Update Notification Settings ===
// UPDATED: The function now correctly accepts 'previousState' as the first argument
export async function updateNotificationSettings(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const wantsReviewReplies = formData.get("reviewReplies") === "on";
  const wantsNewFollowers = formData.get("newFollowers") === "on";
  const wantsWeeklyDigest = formData.get("weeklyDigest") === "on";

  const { error } = await supabase
    .from("profiles")
    .update({
      wants_review_replies_notifications: wantsReviewReplies,
      wants_new_follower_notifications: wantsNewFollowers,
      wants_weekly_digest_notifications: wantsWeeklyDigest,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating notification settings:", error);
    return { success: false, error: "Failed to update settings." };
  }

  revalidatePath("/dashboard/account");
  return {
    success: true,
    message: "Notification settings updated successfully!",
  };
}

export async function updatePrivacySettings(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const isProfilePublic = formData.get("isProfilePublic") === "on";
  const prefersAnonymous = formData.get("prefersAnonymous") === "on";

  const { error } = await supabase
    .from("profiles")
    .update({
      is_profile_public: isProfilePublic,
      prefers_anonymous_reviews: prefersAnonymous,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating privacy settings:", error);
    return { success: false, error: "Failed to update settings." };
  }

  revalidatePath("/dashboard/account");
  return { success: true, message: "Privacy settings updated successfully!" };
}

export async function updateContributorProfile(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const bio = formData.get("bio") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;
  const specialties = (formData.get("specialties") as string)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0); // Handle comma-separated specialties

  const [profileResult, contributorResult] = await Promise.all([
    supabase.from("profiles").update({ bio: bio }).eq("id", user.id),
    supabase
      .from("contributors")
      .update({ portfolio_url: portfolioUrl, specialties: specialties })
      .eq("id", user.id),
  ]);

  if (profileResult.error || contributorResult.error) {
    console.error(
      "Error updating contributor profile:",
      profileResult.error || contributorResult.error
    );
    return { success: false, error: "Failed to update contributor profile." };
  }

  revalidatePath("/dashboard/account");
  return {
    success: true,
    message: "Contributor profile updated successfully!",
  };
}
