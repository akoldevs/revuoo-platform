// src/components/VoteButtons.tsx
'use client'

import { handleVote } from "@/app/reviews/actions";
import { Button } from "./ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Review } from "@/lib/types";
import { usePathname } from "next/navigation";
import { useTransition } from 'react'; // <-- 1. Import useTransition

export default function VoteButtons({ review }: { review: Review }) {
  const pathname = usePathname();
  // 2. Initialize the transition hook
  const [isPending, startTransition] = useTransition();

  // We create a single handler for both buttons
  const handleVoteAction = (voteType: 'up' | 'down') => {
    startTransition(() => {
      // Create FormData programmatically
      const formData = new FormData();
      formData.append('reviewId', review.id.toString());
      formData.append('voteType', voteType);
      formData.append('pathname', pathname);
      
      // Call the server action
      handleVote(formData);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Upvote Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1"
        // Disable the button while the action is pending
        disabled={isPending}
        onClick={() => handleVoteAction('up')}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{review.upvote_count}</span>
      </Button>

      {/* Downvote Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1"
        // Disable the button while the action is pending
        disabled={isPending}
        onClick={() => handleVoteAction('down')}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{review.downvote_count}</span>
      </Button>
    </div>
  );
}