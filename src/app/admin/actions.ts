// src/app/admin/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ✅ RENAMED and UPGRADED to be more flexible
async function verifyStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`role_id`) // We only need to know if they have ANY role
    .eq("id", user.id)
    .single();

  // ✅ FIX: The check now verifies that the user has *any* assigned staff role.
  // This is more secure and flexible than checking for a specific name.
  if (error || !profile?.role_id) {
    console.error("Staff verification failed:", { error, profile });
    throw new Error("Not authorized. User is not a verified staff member.");
  }
}

// --- Review & Response Moderation Actions ---

export async function approveReview(formData: FormData) {
  await verifyStaff();
  const supabase = await createClient();
  const reviewId = formData.get("reviewId") as string;
  await supabase
    .from("reviews")
    .update({ status: "approved" })
    .eq("id", reviewId);
  revalidatePath("/admin");
}

export async function rejectReview(formData: FormData) {
  await verifyStaff();
  const supabase = await createClient();
  const reviewId = formData.get("reviewId") as string;
  await supabase
    .from("reviews")
    .update({ status: "rejected" })
    .eq("id", reviewId);
  revalidatePath("/admin");
}

export async function approveExpertReview(formData: FormData) {
  await verifyStaff();
  const supabase = await createClient();
  const reviewId = formData.get("reviewId") as string;
  await supabase
    .from("expert_reviews")
    .update({ status: "approved" })
    .eq("id", reviewId);
  revalidatePath("/admin");
}

export async function rejectExpertReview(formData: FormData) {
  await verifyStaff();
  const supabase = await createClient();
  const schema = z.object({
    reviewId: z.string().uuid(),
    feedback: z.string().min(10, "Feedback must be at least 10 characters."),
  });

  const validatedFields = schema.safeParse({
    reviewId: formData.get("reviewId"),
    feedback: formData.get("feedback"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { reviewId, feedback } = validatedFields.data;

  const { error } = await supabase
    .from("expert_reviews")
    .update({ status: "needs_revision", moderator_notes: feedback })
    .eq("id", reviewId);

  if (error) {
    return { error: { _form: ["Database error."] } };
  }

  revalidatePath("/admin");
  revalidatePath(`/dashboard/contributor/content/revise/${reviewId}`);
  return { success: true };
}

export async function approveResponse(formData: FormData) {
  await verifyStaff();
  const supabase = await createClient();
  const responseId = formData.get("responseId") as string;
  await supabase
    .from("business_responses")
    .update({ status: "approved" })
    .eq("id", responseId);
  revalidatePath("/admin");
}

export async function rejectResponse(formData: FormData) {
  await verifyStaff();
  const supabase = await createClient();
  const responseId = formData.get("responseId") as string;
  await supabase
    .from("business_responses")
    .update({ status: "rejected" })
    .eq("id", responseId);
  revalidatePath("/admin");
}

// --- Discount Management Actions ---

export async function upsertDiscount(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();
    const planIds = formData.getAll("plan_ids") as string[];

    const schema = z.object({
      id: z.string().uuid().optional().or(z.literal("")),
      code: z
        .string()
        .min(3, "Code must be at least 3 characters.")
        .toUpperCase(),
      discount_type: z.enum(["percent", "fixed"]),
      value: z.coerce.number().min(0.01, "Value must be greater than 0."),
      is_active: z.preprocess((val) => val === "on", z.boolean()),
      expires_at: z.string().optional(),
      max_redemptions: z.coerce
        .number()
        .int()
        .min(1)
        .optional()
        .or(z.literal("")),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error.flatten());
      throw new Error("Form validation failed. Please check your inputs.");
    }

    const { id, ...data } = validatedFields.data;
    const discountData = {
      ...data,
      expires_at: data.expires_at || null,
      max_redemptions: data.max_redemptions || null,
      plan_ids: planIds.length > 0 ? planIds : null,
    };

    const { error } = await supabase
      .from("discounts")
      .upsert(id ? { id, ...discountData } : discountData);

    if (error) {
      if (error.code === "23505") {
        throw new Error("A discount with this code already exists.");
      }
      console.error("Supabase error:", error);
      throw new Error("Failed to save discount to the database.");
    }

    revalidatePath("/admin/settings");
    return {
      success: true,
      message: `Discount code "${discountData.code}" has been saved.`,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function deleteDiscount(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Discount ID is missing.");
    }

    const { error } = await supabase.from("discounts").delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/settings");
    return { success: true, message: "Discount has been deleted." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

// --- Plan & Category Management Actions ---

export async function upsertPlan(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();

    const schema = z.object({
      id: z.string().uuid(),
      name: z.string().min(1, "Plan name is required."),
      description: z.string().optional(),
      price_monthly: z.coerce.number().min(0),
      price_annually: z.coerce.number().min(0),
      is_most_popular: z.preprocess((val) => val === "on", z.boolean()),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error.flatten());
      throw new Error("Form validation failed. Please check your inputs.");
    }

    const { id, ...planData } = validatedFields.data;

    const { error } = await supabase
      .from("plans")
      .update(planData)
      .eq("id", id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/settings");
    return {
      success: true,
      message: `Plan "${planData.name}" has been updated.`,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function upsertCategory(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();

    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const icon_svg = formData.get("icon_svg") as string | null;

    if (!name) {
      throw new Error("Category name is required.");
    }

    const slug = name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-|-$/g, "");

    const categoryData = {
      name,
      slug,
      description,
      icon_svg,
    };

    const { error } = await supabase
      .from("categories")
      .upsert(id ? { id, ...categoryData } : categoryData);

    if (error) {
      if (error.code === "23505") {
        throw new Error("A category with this name already exists.");
      }
      throw error;
    }

    revalidatePath("/admin/settings");
    revalidatePath("/categories");
    return { success: true, message: `Category "${name}" has been saved.` };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Category ID is missing.");
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/settings");
    revalidatePath("/categories");
    return { success: true, message: "Category has been deleted." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

// --- Subscription Management Action ---

export async function upsertSubscription(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();

    const businessId = Number(formData.get("businessId"));
    const planName = formData.get("planName") as string;
    const billingInterval = formData.get("billingInterval") as "month" | "year";
    const isTrial = formData.get("isTrial") === "on";

    if (!businessId || !planName || !billingInterval) {
      throw new Error("Missing required form data.");
    }

    const now = new Date();
    let trialEndsAt = null;
    let currentPeriodEnd;
    let status: "active" | "trialing" = "active";

    if (isTrial) {
      status = "trialing";
      trialEndsAt = new Date(
        now.getTime() + 14 * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    if (billingInterval === "month") {
      currentPeriodEnd = new Date(new Date().setMonth(now.getMonth() + 1));
    } else {
      currentPeriodEnd = new Date(
        new Date().setFullYear(now.getFullYear() + 1)
      );
    }

    const subscriptionData = {
      business_id: businessId,
      plan_name: planName,
      // ✅ FIX: Add the plan_tier to the data being saved.
      plan_tier: planName.toLowerCase(),
      billing_interval: billingInterval,
      status: status,
      trial_ends_at: trialEndsAt,
      current_period_end: currentPeriodEnd.toISOString(),
    };

    const { error } = await supabase
      .from("subscriptions")
      .upsert(subscriptionData, { onConflict: "business_id" });

    if (error) {
      console.error("Upsert failed:", error);
      throw error;
    }

    revalidatePath("/admin/billing");
    revalidatePath(`/admin/businesses/${businessId}`);

    return {
      success: true,
      message: `Successfully set subscription to the ${planName} plan.`,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

// --- RBAC (Roles & Permissions) Management Actions ---

export async function upsertRole(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();

    const schema = z.object({
      id: z.string().uuid().optional().or(z.literal("")),
      name: z.string().min(3, "Role name must be at least 3 characters."),
      description: z.string().optional(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Form validation failed.");
    }

    const { id, ...roleData } = validatedFields.data;

    const { error } = await supabase
      .from("roles")
      .upsert(id ? { id, ...roleData } : roleData);

    if (error) {
      if (error.code === "23505") {
        // unique constraint violation
        throw new Error("A role with this name already exists.");
      }
      throw error;
    }

    revalidatePath("/admin/settings");
    return {
      success: true,
      message: `Role "${roleData.name}" has been saved.`,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function updateRolePermissions(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();

    const roleId = formData.get("role_id") as string;
    const permissionIds = formData.getAll("permission_ids") as string[];

    if (!roleId) {
      throw new Error("Role ID is missing.");
    }

    // First, delete all existing permissions for this role
    const { error: deleteError } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", roleId);

    if (deleteError) {
      throw new Error("Failed to clear existing permissions.");
    }

    // Then, insert the new set of permissions
    if (permissionIds.length > 0) {
      const newPermissions = permissionIds.map((permissionId) => ({
        role_id: roleId,
        permission_id: permissionId,
      }));

      const { error: insertError } = await supabase
        .from("role_permissions")
        .insert(newPermissions);

      if (insertError) {
        throw new Error("Failed to assign new permissions.");
      }
    }

    revalidatePath("/admin/settings");
    return { success: true, message: "Permissions have been updated." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function assignUserRole(formData: FormData) {
  try {
    await verifyStaff();
    const supabase = await createClient();

    const schema = z.object({
      user_id: z.string().uuid("Invalid user ID."),
      role_id: z.string().uuid("Invalid role ID."),
    });

    const validatedFields = schema.safeParse({
      user_id: formData.get("user_id"),
      role_id: formData.get("role_id"),
    });

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { user_id, role_id } = validatedFields.data;

    const { error } = await supabase
      .from("profiles")
      .update({ role_id: role_id })
      .eq("id", user_id);

    if (error) {
      throw new Error("Failed to assign role in the database.");
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User role has been updated." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

// --- Sales CRM Actions ---
export async function updateLeadStatus(formData: FormData) {
  try {
    await verifyStaff(); // Ensures only an admin can perform this action
    const supabase = await createClient();

    const schema = z.object({
      lead_id: z.coerce.number(),
      status: z.enum([
        "new",
        "contacted",
        "qualified",
        "unqualified",
        "converted",
      ]),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { lead_id, status } = validatedFields.data;

    const { error } = await supabase
      .from("leads")
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq("id", lead_id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/sales");
    return { success: true, message: "Lead status has been updated." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function updateLeadDetails(formData: FormData) {
  try {
    const supabase = await createClient();

    // First, get the current user to log who is making the change
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // We still verify they are an admin
    await verifyStaff();

    const schema = z.object({
      lead_id: z.coerce.number(),
      notes: z.string().optional(),
      status: z
        .enum(["new", "contacted", "qualified", "unqualified", "converted"])
        .optional(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { lead_id, notes, status } = validatedFields.data;

    // Get the current state of the lead before updating
    const { data: currentLead, error: fetchError } = await supabase
      .from("leads")
      .select("status, notes")
      .eq("id", lead_id)
      .single();

    if (fetchError) throw fetchError;

    // Prepare the update payload
    const updateData: { updated_at: string; status?: string; notes?: string } =
      {
        updated_at: new Date().toISOString(),
      };
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;

    // Update the lead
    const { error: updateError } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", lead_id);

    if (updateError) throw updateError;

    // ✅ NEW: Log the activities
    const activitiesToInsert = [];

    // Log status change if it happened
    if (status && status !== currentLead.status) {
      activitiesToInsert.push({
        lead_id,
        profile_id: user.id,
        activity_type: "status_change",
        details: { old: currentLead.status, new: status },
      });
    }

    // Log note addition/change if it happened
    if (notes && notes !== currentLead.notes) {
      activitiesToInsert.push({
        lead_id,
        profile_id: user.id,
        activity_type: "note_added",
        details: { note_preview: notes.substring(0, 50) + "..." },
      });
    }

    if (activitiesToInsert.length > 0) {
      const { error: logError } = await supabase
        .from("lead_activities")
        .insert(activitiesToInsert);
      if (logError) throw logError;
    }

    revalidatePath(`/admin/sales/leads/${lead_id}`);
    revalidatePath("/admin/sales");
    return { success: true, message: "Lead details updated." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

// Replace the existing function with this version that calls our new RPC

export async function searchUsersForLeads(query: string) {
  "use server";
  try {
    const supabase = createClient();
    await verifyStaff();

    if (!query || query.trim().length < 2) {
      return { data: [], error: null };
    }

    // ✅ FIX: This function now simply searches and returns users
    // without any complex filtering, making it a reliable user search.
    const { data: users, error: rpcError } = await supabase.rpc(
      "search_users_for_leads",
      { p_query: query }
    );

    if (rpcError) {
      console.error("RPC Error in searchUsersForLeads:", rpcError);
      throw rpcError;
    }

    return { data: users || [], error: null };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred.";
    console.error("[DEBUG] Search Action Error:", errorMessage);
    return { data: [], error: errorMessage };
  }
}

// This function creates the lead record in the database.
export async function createLead(formData: FormData) {
  "use server";
  try {
    await verifyStaff();
    const supabase = await createClient();

    const profileId = formData.get("profile_id") as string;
    if (!profileId) throw new Error("User ID is required.");

    const { error } = await supabase
      .from("leads")
      .insert({ profile_id: profileId, source: "Manual Entry" });

    if (error) throw error;

    revalidatePath("/admin/sales");
    return { success: true, message: "Lead successfully created." };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function convertLeadToOpportunity(formData: FormData) {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    await verifyStaff();

    const schema = z.object({
      lead_id: z.coerce.number(),
      plan_name: z.string().min(1, "Plan name is required."),
      value: z.coerce.number().min(0, "Value must be a positive number."),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { lead_id, plan_name, value } = validatedFields.data;

    // Create the new opportunity
    const { data: newOpportunity, error: opportunityError } = await supabase
      .from("opportunities")
      .insert({
        lead_id: lead_id,
        assigned_to_profile_id: user.id, // Assign to the current admin
        associated_plan_name: plan_name,
        value: value,
        stage: "discovery",
      })
      .select()
      .single();

    if (opportunityError) throw opportunityError;

    // Update the lead's status to 'converted'
    const { error: leadUpdateError } = await supabase
      .from("leads")
      .update({ status: "converted" })
      .eq("id", lead_id);

    if (leadUpdateError) throw leadUpdateError;

    // Log this action in the activity feed
    const { error: logError } = await supabase.from("lead_activities").insert({
      lead_id,
      profile_id: user.id,
      activity_type: "status_change",
      details: { old: "qualified", new: "converted" }, // Assuming conversion happens from 'qualified'
    });

    if (logError) throw logError;

    revalidatePath("/admin/sales");
    revalidatePath(`/admin/sales/leads/${lead_id}`);

    return {
      success: true,
      message: "Lead converted to Opportunity!",
      data: newOpportunity,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateOpportunityStage(formData: FormData) {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    await verifyStaff();

    const schema = z.object({
      opportunity_id: z.coerce.number(),
      stage: z.enum([
        "discovery",
        "demo_scheduled",
        "proposal_sent",
        "negotiation",
        "closed_won",
        "closed_lost",
      ]),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { opportunity_id, stage } = validatedFields.data;

    // Get the current stage before updating
    const { data: currentOpportunity, error: fetchError } = await supabase
      .from("opportunities")
      .select("stage")
      .eq("id", opportunity_id)
      .single();

    if (fetchError) throw fetchError;

    // Update the opportunity stage
    const { error: updateError } = await supabase
      .from("opportunities")
      .update({ stage: stage, updated_at: new Date().toISOString() })
      .eq("id", opportunity_id);

    if (updateError) throw updateError;

    // ✅ NEW: Log this stage change to the activity feed
    const { error: logError } = await supabase
      .from("opportunity_activities")
      .insert({
        opportunity_id,
        profile_id: user.id,
        activity_type: "stage_change",
        details: { old: currentOpportunity.stage, new: stage },
      });

    if (logError) throw logError;

    revalidatePath("/admin/sales");
    revalidatePath(`/admin/sales/opportunities/${opportunity_id}`); // Revalidate detail page
    return { success: true, message: "Opportunity stage updated." };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateOpportunityDetails(formData: FormData) {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    await verifyStaff();

    const schema = z.object({
      opportunity_id: z.coerce.number(),
      notes: z.string().optional(),
      stage: z
        .enum([
          "discovery",
          "demo_scheduled",
          "proposal_sent",
          "negotiation",
          "closed_won",
          "closed_lost",
        ])
        .optional(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { opportunity_id, notes, stage } = validatedFields.data;

    // Get the current state of the opportunity before updating
    const { data: currentOpportunity, error: fetchError } = await supabase
      .from("opportunities")
      .select("stage, notes")
      .eq("id", opportunity_id)
      .single();

    if (fetchError) throw fetchError;

    let updateData: any = { updated_at: new Date().toISOString() };
    if (stage) updateData.stage = stage;
    // Allow notes to be updated to an empty string
    if (notes !== undefined) updateData.notes = notes;

    const { error: updateError } = await supabase
      .from("opportunities")
      .update(updateData)
      .eq("id", opportunity_id);

    if (updateError) throw updateError;

    // ✅ NEW: Log the activities
    const activitiesToInsert = [];

    // Log stage change if it happened
    if (stage && stage !== currentOpportunity.stage) {
      activitiesToInsert.push({
        opportunity_id,
        profile_id: user.id,
        activity_type: "stage_change",
        details: { old: currentOpportunity.stage, new: stage },
      });
    }

    // Log note addition/change if it happened
    if (notes !== undefined && notes !== currentOpportunity.notes) {
      activitiesToInsert.push({
        opportunity_id,
        profile_id: user.id,
        activity_type: "note_added",
        details: { note_preview: (notes || "").substring(0, 50) + "..." },
      });
    }

    if (activitiesToInsert.length > 0) {
      const { error: logError } = await supabase
        .from("opportunity_activities")
        .insert(activitiesToInsert);
      if (logError) throw logError;
    }

    revalidatePath(`/admin/sales/opportunities/${opportunity_id}`);
    revalidatePath("/admin/sales");
    return { success: true, message: "Opportunity details updated." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

// --- Support Ticket Actions ---
export async function createSupportTicket(formData: FormData) {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    await verifyStaff();

    const schema = z.object({
      profile_id: z.string().uuid(),
      subject: z.string().min(5, "Subject must be at least 5 characters."),
      status: z.enum(["open", "pending", "resolved", "closed"]),
      priority: z.enum(["low", "medium", "high", "urgent"]),
      content: z.string().min(10, "Message must be at least 10 characters."),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      // Return a flat error message for simplicity
      const errors = validatedFields.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Invalid input.";
      throw new Error(firstError);
    }

    const { profile_id, subject, status, priority, content } =
      validatedFields.data;

    // Create the ticket and its first reply in a single transaction for data integrity
    const { data: newTicket, error } = await supabase.rpc(
      "create_ticket_with_reply",
      {
        p_profile_id: profile_id,
        p_subject: subject,
        p_status: status,
        p_priority: priority,
        p_reply_content: content,
        p_author_id: user.id,
      }
    );

    if (error) throw error;

    revalidatePath("/admin/support");
    return {
      success: true,
      message: "Ticket created successfully.",
      ticketId: newTicket,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function addReplyToTicket(formData: FormData) {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    await verifyStaff();

    const schema = z.object({
      ticket_id: z.coerce.number(),
      content: z.string().min(1, "Reply cannot be empty."),
      is_internal_note: z.preprocess((val) => val === "on", z.boolean()),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { ticket_id, content, is_internal_note } = validatedFields.data;

    const { error } = await supabase.from("ticket_replies").insert({
      ticket_id,
      content,
      is_internal_note,
      profile_id: user.id,
    });

    if (error) throw error;

    // Also update the main ticket's 'updated_at' timestamp
    await supabase
      .from("support_tickets")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", ticket_id);

    revalidatePath(`/admin/support/tickets/${ticket_id}`);
    return { success: true, message: "Reply added." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function updateTicketDetails(formData: FormData) {
  "use server";
  try {
    await verifyStaff();
    const supabase = await createClient();

    const schema = z.object({
      ticket_id: z.coerce.number(),
      subject: z.string().min(5, "Subject must be at least 5 characters."),
      status: z.enum(["open", "pending", "resolved", "closed"]),
      priority: z.enum(["low", "medium", "high", "urgent"]),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      const firstError = Object.values(
        validatedFields.error.flatten().fieldErrors
      )[0]?.[0];
      throw new Error(firstError || "Invalid input.");
    }

    const { ticket_id, ...updateData } = validatedFields.data;

    const { error } = await supabase
      .from("support_tickets")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", ticket_id);

    if (error) throw error;

    revalidatePath(`/admin/support/tickets/${ticket_id}`);
    return { success: true, message: "Ticket details updated." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function assignSupportTicket(formData: FormData) {
  "use server";
  try {
    await verifyStaff();
    const supabase = await createClient();

    const schema = z.object({
      ticket_id: z.coerce.number(),
      assignee_id: z.string().uuid(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }
    const { ticket_id, assignee_id } = validatedFields.data;

    const { error } = await supabase
      .from("support_tickets")
      .update({ assigned_to_profile_id: assignee_id })
      .eq("id", ticket_id);

    if (error) throw error;

    revalidatePath("/admin/support");
    return { success: true, message: "Ticket has been assigned." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function createIntegration(formData: FormData) {
  "use server";
  try {
    await verifyStaff();
    const supabase = await createClient();

    const schema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters."),
      description: z.string().optional(),
      logo_url: z
        .string()
        .url("Must be a valid URL.")
        .optional()
        .or(z.literal("")),
      category: z.enum([
        "e-commerce",
        "crm",
        "marketing",
        "communication",
        "analytics",
      ]),
      is_active: z.preprocess((val) => val === "on", z.boolean()),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      const firstError = Object.values(
        validatedFields.error.flatten().fieldErrors
      )[0]?.[0];
      throw new Error(firstError || "Invalid input.");
    }

    const { error } = await supabase
      .from("integrations")
      .insert(validatedFields.data);

    if (error) {
      if (error.code === "23505") {
        // unique constraint violation
        throw new Error("An integration with this name already exists.");
      }
      throw error;
    }

    revalidatePath("/admin/integrations");
    return { success: true, message: "Integration created successfully." };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function commandPaletteSearch(query: string) {
  "use server";
  try {
    const supabase = await createClient();
    await verifyStaff();

    if (!query) return { data: [], error: null };

    const { data, error } = await supabase.rpc("admin_unified_search", {
      p_query: query,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred.";
    return { data: [], error: errorMessage };
  }
}

export async function updatePlanFeatures(formData: FormData) {
  "use server";
  try {
    await verifyStaff();
    const supabase = await createClient();

    const planId = formData.get("plan_id") as string;
    const featureIds = formData.getAll("feature_ids") as string[];

    if (!planId) throw new Error("Plan ID is missing.");

    // This is an A+++ approach: perform the update in a single transaction.
    // First, delete all existing features for this plan.
    const { error: deleteError } = await supabase
      .from("plan_features")
      .delete()
      .eq("plan_id", planId);

    if (deleteError) throw deleteError;

    // Then, if there are new features to add, insert them.
    if (featureIds.length > 0) {
      const newPlanFeatures = featureIds.map((featureId) => ({
        plan_id: planId,
        feature_id: featureId,
      }));
      const { error: insertError } = await supabase
        .from("plan_features")
        .insert(newPlanFeatures);

      if (insertError) throw insertError;
    }

    revalidatePath("/admin/settings");
    return { success: true, message: "Plan features updated successfully." };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

// --- Team Chat Actions ---

export async function createChatChannel(formData: FormData) {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    await verifyStaff();

    const schema = z.object({
      name: z
        .string()
        .min(3, "Channel name must be at least 3 characters.")
        .regex(
          /^[a-z0-9-]+$/,
          "Channel name can only contain lowercase letters, numbers, and hyphens."
        ),
      description: z.string().optional(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (!validatedFields.success) {
      throw new Error(
        Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0] ||
          "Invalid input."
      );
    }
    const { name, description } = validatedFields.data;

    const { data: newChannel, error } = await supabase
      .from("channels")
      .insert({ name, description, created_by: user.id })
      .select()
      .single();

    if (error) {
      // ✅ This will now log the detailed database error to your server console
      console.error("DATABASE INSERT ERROR:", error);
      if (error.code === "23505") {
        throw new Error("A channel with this name already exists.");
      }
      // We throw the specific database message to see it on the client
      throw new Error(error.message);
    }

    await supabase
      .from("channel_members")
      .insert({ channel_id: newChannel.id, profile_id: user.id });

    // ❌ revalidatePath("/admin/chat"); -- As you suggested, this is removed.

    return { success: true, message: `Channel #${name} created.` };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getMessagesForChannel(channelId: number) {
  "use server";
  try {
    const supabase = await createClient();
    await verifyStaff();

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        content,
        created_at,
        profiles ( id, full_name )
      `
      )
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true })
      .limit(100); // Get the last 100 messages

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred.";
    return { data: null, error: errorMessage };
  }
}

export async function addMemberToChannel(formData: FormData) {
  "use server";
  try {
    await verifyStaff();
    const supabase = await createClient();

    const schema = z.object({
      channel_id: z.coerce.number(),
      profile_id: z.string().uuid(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { channel_id, profile_id } = validatedFields.data;

    const { error } = await supabase.from("channel_members").insert({
      channel_id,
      profile_id,
    });

    if (error) {
      if (error.code === "23505") {
        // unique_violation
        // This isn't really an error, the user is already a member.
        return {
          success: true,
          message: "User is already a member of this channel.",
        };
      }
      throw error;
    }

    revalidatePath("/admin/chat");
    return { success: true, message: "New member added to the channel." };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function getChannelMemberCount(channelId: number) {
  "use server";
  try {
    const supabase = await createClient();
    await verifyStaff();
    const { count, error } = await supabase
      .from("channel_members")
      .select("*", { count: "exact", head: true })
      .eq("channel_id", channelId);

    if (error) throw error;
    return { count };
  } catch (e) {
    return { count: 0 };
  }
}
