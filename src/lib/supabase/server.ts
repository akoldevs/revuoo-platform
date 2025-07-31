// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// The function is async to allow for 'await' with the cookies() function.
export const createClient = async () => {
  // Added 'await' to resolve the Promise and get the cookie store.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // FIX: Changed 'catch (error)' to an empty 'catch {}'.
          // This is valid syntax that catches the expected error without
          // creating an unused variable, resolving all linting conflicts.
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // The 'set' method is expected to throw an error when called from a
            // Server Component. This error is caught and safely ignored.
          }
        },
        remove(name: string, options: CookieOptions) {
          // FIX: Applied the same empty 'catch {}' here.
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // The 'set' method is expected to throw an error when called from a
            // Server Component. This error is caught and safely ignored.
          }
        },
      },
    }
  );
};
