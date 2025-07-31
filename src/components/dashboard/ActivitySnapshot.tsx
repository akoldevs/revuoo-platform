// src/components/dashboard/ActivitySnapshot.tsx
"use client";

import { Star, ThumbsUp, MessageSquare, Bookmark } from "lucide-react";
import { ReactNode } from "react";

// Define a specific type for the stats object to replace 'any'.
// This ensures type safety and provides better autocompletion.
interface ActivityStats {
  reviews_written: number;
  helpful_votes_received: number;
  comments_made: number;
  guides_bookmarked: number;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <div className="bg-gray-50 p-6 rounded-lg border">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  </div>
);

// FIX: Replaced 'any' with the specific 'ActivityStats' interface.
export default function ActivitySnapshot({ stats }: { stats: ActivityStats }) {
  const statItems = [
    {
      label: "Reviews Written",
      value: stats.reviews_written,
      icon: <Star className="h-8 w-8 text-indigo-500" />,
    },
    {
      label: "Helpful Votes Received",
      value: stats.helpful_votes_received,
      icon: <ThumbsUp className="h-8 w-8 text-indigo-500" />,
    },
    {
      label: "Comments Made",
      value: stats.comments_made,
      icon: <MessageSquare className="h-8 w-8 text-indigo-500" />,
    },
    {
      label: "Guides Bookmarked",
      value: stats.guides_bookmarked,
      icon: <Bookmark className="h-8 w-8 text-indigo-500" />,
    },
  ];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
