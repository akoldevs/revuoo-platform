// src/app/api/preview/route.ts
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// This route is called by Sanity Studio to enable live preview mode.
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("Slug not found", { status: 404 });
  }

  draftMode().enable();
  // ✅ FIX: Changed the redirect path from '/guides/' to '/blog/'
  redirect(`/blog/${slug}`);
}
