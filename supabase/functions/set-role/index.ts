// supabase/functions/set-role/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    // Only an admin can set roles for other users.
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("roles(name)")
      .eq("id", user.id)
      .single();
    // @ts-ignore: Supabase type helper limitation
    if (adminProfile?.roles?.name !== "Administrator") {
      throw new Error("You must be an administrator to set roles.");
    }

    const { target_user_id, new_role } = await req.json();
    if (!target_user_id || !new_role)
      throw new Error("target_user_id and new_role are required.");

    const { data, error } = await supabase.auth.admin.updateUserById(
      target_user_id,
      { app_metadata: { user_role: new_role } }
    );

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
