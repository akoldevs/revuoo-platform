// src/app/api/views/[slug]/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// This route is now a bit of a misnomer, as it uses the ID, not the slug,
// but we keep the path for simplicity. The important part is the logic inside.
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // We're actually passing the Sanity Document ID in the URL now.
  const documentId = params.slug;

  if (!documentId) {
    return new NextResponse("Document ID not found", { status: 404 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    await supabaseAdmin
      .from("content_analytics")
      .upsert({ id: documentId }, { onConflict: "id" });
    await supabaseAdmin.rpc("increment_view_count", { page_slug: documentId });

    return new NextResponse(
      JSON.stringify({ message: "View count updated." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating view count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
