// src/components/LiveReviewFeed.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import Link from "next/link";

interface ReviewPayload {
  old: {
    status: string;
  };
  new: {
    id: number;
    title: string;
    status: string;
    business_id: number;
  };
}

interface NotificationState {
  id: number;
  title: string;
  businessName: string;
  businessSlug: string;
}

export default function LiveReviewFeed() {
  const supabase = createClient();
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    const channel = supabase
      .channel("public:reviews")
      .on<ReviewPayload>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reviews",
        },
        async (payload) => {
          const { new: newReview, old: oldReview } = payload;

          if (
            newReview.status === "approved" &&
            oldReview?.status === "pending"
          ) {
            const { data: businessData } = await supabase
              .from("businesses")
              .select("name, slug")
              .eq("id", newReview.business_id)
              .single();

            if (businessData?.slug) {
              setNotification({
                id: newReview.id,
                title: newReview.title || "New review posted",
                businessName: businessData.name,
                businessSlug: businessData.slug,
              });
              setIsVisible(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (!notification || !isVisible) return null;

  return (
    <div
      className="fixed bottom-5 left-5 z-50 animate-in fade-in-5 slide-in-from-bottom-5 transition-all"
      role="status"
      aria-live="polite"
    >
      <div className="bg-white rounded-lg shadow-2xl border flex items-start gap-4 p-4 w-full max-w-sm">
        <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
          <Star className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-grow">
          <p className="text-sm font-semibold text-gray-800">
            New Review for{" "}
            <Link
              href={`/business/${notification.businessSlug}`}
              className="font-bold hover:underline"
            >
              {notification.businessName}
            </Link>
          </p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.title}
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-700"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
