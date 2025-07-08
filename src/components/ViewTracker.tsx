// src/components/ViewTracker.tsx
'use client'

import { incrementViewCount } from "@/app/business/[slug]/actions";
import { useEffect } from "react";

export default function ViewTracker({ businessId }: { businessId: number }) {
  useEffect(() => {
    // This calls our server action in the background when the component loads.
    incrementViewCount(businessId);
  }, [businessId]);

  // This component renders nothing to the page. Its only job is to call the action.
  return null;
}