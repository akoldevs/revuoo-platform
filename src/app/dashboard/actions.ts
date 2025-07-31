// src/app/dashboard/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define a reusable type for the return value of our actions.
// This improves type safety and consistency.
type FormActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};

// A helper function to extract the first Zod error message.
function getFirstZodError(error: z.ZodError): string | undefined {
  return Object.values(error.flatten().fieldErrors)[0]?.[0];
}

export async function createMySupportTicket(
  formData: FormData
): Promise<FormActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to submit a ticket.",
    };
  }

  try {
    const schema = z.object({
      subject: z.string().min(5, "Subject must be at least 5 characters."),
      content: z.string().min(10, "Message must be at least 10 characters."),
      persona: z.enum(["user", "contributor", "business"]),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      const errorMessage =
        getFirstZodError(validatedFields.error) || "Invalid input.";
      return { success: false, error: errorMessage };
    }

    const { subject, content, persona } = validatedFields.data;

    // FIX: The 'newTicket' variable was unused. We can omit destructuring 'data'
    // if we don't need to use the returned value from the RPC call.
    const { error } = await supabase.rpc("create_ticket_with_reply", {
      p_profile_id: user.id,
      p_subject: subject,
      p_status: "open",
      p_priority: "medium",
      p_reply_content: content,
      p_author_id: user.id,
      p_persona: persona,
    });

    if (error) throw error;

    revalidatePath("/dashboard/support");
    return { success: true, message: "Ticket submitted successfully." };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

export async function connectBusinessIntegration(
  formData: FormData
): Promise<FormActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  try {
    const schema = z.object({
      integration_id: z.string().uuid(),
      business_id: z.coerce.number(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      const errorMessage =
        getFirstZodError(validatedFields.error) || "Invalid input.";
      return { success: false, error: errorMessage };
    }

    const { integration_id, business_id } = validatedFields.data;

    const { error } = await supabase.from("business_integrations").insert({
      business_id,
      integration_id,
      is_connected: true,
      connected_at: new Date().toISOString(),
    });

    if (error) throw error;

    revalidatePath("/dashboard/business/integrations");
    return { success: true, message: "Integration connected successfully." };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

export async function saveIntegrationSettings(
  formData: FormData
): Promise<FormActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  try {
    const schema = z.object({
      business_integration_id: z.coerce.number(),
      webhook_url: z
        .string()
        .url("Please enter a valid URL.")
        .optional()
        .or(z.literal("")),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      const errorMessage =
        getFirstZodError(validatedFields.error) || "Invalid input.";
      return { success: false, error: errorMessage };
    }

    const { business_integration_id, ...settings } = validatedFields.data;

    const { error } = await supabase
      .from("business_integrations")
      .update({ settings: settings, updated_at: new Date().toISOString() })
      .eq("id", business_integration_id);

    if (error) throw error;

    revalidatePath("/dashboard/business/integrations");
    return { success: true, message: "Integration settings saved." };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

export async function disconnectBusinessIntegration(
  formData: FormData
): Promise<FormActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  try {
    const schema = z.object({
      business_integration_id: z.coerce.number(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      const errorMessage =
        getFirstZodError(validatedFields.error) || "Invalid input.";
      return { success: false, error: errorMessage };
    }

    const { business_integration_id } = validatedFields.data;

    // This is a critical security check.
    // We must verify that the user owns the business associated with this integration.
    const { data: connection, error: connectionError } = await supabase
      .from("business_integrations")
      .select("businesses(owner_id)")
      .eq("id", business_integration_id)
      .single();

    if (connectionError) throw connectionError;

    // FIX: The type error indicated that `businesses` is returned as an array of objects.
    // This happens with certain Supabase relationship queries. To fix this, we safely
    // access the first element of the array to get the owner_id.
    const ownerId = connection?.businesses?.[0]?.owner_id;

    if (ownerId !== user.id) {
      return {
        success: false,
        error: "You do not have permission to perform this action.",
      };
    }

    // If the check passes, delete the connection record.
    const { error: deleteError } = await supabase
      .from("business_integrations")
      .delete()
      .eq("id", business_integration_id);

    if (deleteError) throw deleteError;

    revalidatePath("/dashboard/business/integrations");
    return { success: true, message: "Integration disconnected successfully." };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}
