// src/app/login/page.tsx
"use client";
import { createClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"; // ✅ Import useState

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // ✅ FIX: Use state to safely handle the browser-only 'location' object
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    // This code now runs only in the browser, after the component has mounted
    setRedirectUrl(`${window.location.origin}/auth/callback`);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/admin/chat");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg border">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Log In to Revuoo</h1>
          <p className="text-muted-foreground">Real Reviews. Real Knowledge.</p>
        </div>

        {error && (
          <div className="p-4 text-center text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        {/* Only render the Auth component once we have the redirectUrl */}
        {redirectUrl && (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "facebook", "apple"]}
            view="magic_link"
            showLinks={true}
            // ✅ FIX: Use the state variable which is safely set on the client
            redirectTo={redirectUrl}
          />
        )}
      </div>
    </div>
  );
}
