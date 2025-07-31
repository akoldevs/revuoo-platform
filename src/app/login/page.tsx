// src/app/login/page.tsx
import { Suspense } from "react";
import LoginPageClient from "@/components/auth/LoginPageClient";

// This is the main page component. It's a Server Component.
// It wraps the client-side logic in a Suspense boundary, which is required by Next.js.
export default function LoginPage() {
  return (
    <div className="flex justify-center items-center py-16">
      <Suspense
        fallback={<div className="w-full max-w-md text-center">Loading...</div>}
      >
        <LoginPageClient />
      </Suspense>
    </div>
  );
}
