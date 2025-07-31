// src/components/blog/ViewCounter.tsx
"use client";

import { useEffect } from "react";

// The component now accepts the Sanity Document ID
export function ViewCounter({ documentId }: { documentId: string }) {
  useEffect(() => {
    // We pass the ID in the URL, even though the route is named [slug]
    fetch(`/api/views/${documentId}`, {
      method: "POST",
    });
  }, [documentId]);

  return null;
}
