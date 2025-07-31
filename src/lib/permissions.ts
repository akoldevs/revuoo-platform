// src/lib/permissions.ts
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

/**
 * An A+++, cached, server-side utility to get the set of permissions
 * for the currently logged-in user.
 *
 * Using React's `cache` ensures that if we call this function multiple
 * times in a single request, it only hits the database once.
 */
export const getUserPermissions = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Set<string>();
  }

  // Fetch the user's role and all their associated permission names in one go.
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      roles (
        permissions ( name )
      )
    `
    )
    .eq("id", user.id)
    .single();

  if (error || !profile || !profile.roles) {
    // This can happen if a user has no role assigned.
    // We will log the error for debugging but return an empty set.
    console.error("Error fetching user permissions:", error);
    return new Set<string>();
  }

  // The data is nested, so we need to extract just the permission names.
  // The result from Supabase looks like: { roles: { permissions: [{ name: '...'}, { name: '...' }] } }
  const permissions =
    profile.roles.permissions.map((p: { name: string }) => p.name) || [];

  // Return a Set for highly efficient 'has()' lookups in our components.
  return new Set(permissions);
});
