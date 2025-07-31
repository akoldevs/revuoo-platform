// src/app/dashboard/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createMySupportTicket(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to submit a ticket." };

  try {
    const schema = z.object({
      subject: z.string().min(5, "Subject must be at least 5 characters."),
      content: z.string().min(10, "Message must be at least 10 characters."),
      persona: z.enum(["user", "contributor", "business"]), // ✅ Validate the persona
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
    const { subject, content, persona } = validatedFields.data;

    const { data: newTicket, error } = await supabase.rpc(
      "create_ticket_with_reply",
      {
        p_profile_id: user.id,
        p_subject: subject,
        p_status: "open",
        p_priority: "medium",
        p_reply_content: content,
        p_author_id: user.id,
        p_persona: persona, // ✅ Pass the persona to the database function
      }
    );

    if (error) throw error;

    revalidatePath("/dashboard/support");
    return { success: true, message: "Ticket submitted successfully." };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function connectBusinessIntegration(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  try {
    const schema = z.object({
      integration_id: z.string().uuid(),
      business_id: z.coerce.number(), // Business ID will be needed
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { integration_id, business_id } = validatedFields.data;

    // For now, we'll just create the connection record.
    // In a real scenario, this is where you'd handle OAuth or API key validation.
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
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function saveIntegrationSettings(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  try {
    const schema = z.object({
      business_integration_id: z.coerce.number(),
      // We'll keep settings generic for now, specific validation can be added later
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
      throw new Error("Invalid input.");
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
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function disconnectBusinessIntegration(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  try {
    const schema = z.object({
      business_integration_id: z.coerce.number(),
    });

    const validatedFields = schema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      throw new Error("Invalid input.");
    }

    const { business_integration_id } = validatedFields.data;

    // We must also verify that the user owns the business associated with this integration connection.
    // This is a critical security check.
    const { data: connection } = await supabase
      .from("business_integrations")
      .select("businesses(owner_id)")
      .eq("id", business_integration_id)
      .single();

    if (connection?.businesses?.owner_id !== user.id) {
      return { error: "You do not have permission to perform this action." };
    }

    // If the check passes, delete the connection record.
    const { error } = await supabase
      .from("business_integrations")
      .delete()
      .eq("id", business_integration_id);

    if (error) throw error;

    revalidatePath("/dashboard/business/integrations");
    return { success: true, message: "Integration disconnected successfully." };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}
