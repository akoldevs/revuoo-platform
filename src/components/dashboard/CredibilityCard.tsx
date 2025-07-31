// src/components/dashboard/CredibilityCard.tsx
"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CredibilityCard({ score }: { score: number }) {
  // Determine the user's title based on their score
  let title = "New Reviewer";
  if (score >= 100) title = "Trusted Voice";
  if (score >= 500) title = "Expert Critic";

  return (
    <div className="bg-white p-6 rounded-lg border sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        Your Credibility
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Your score increases with verified reviews, helpful votes, and
                community engagement.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100">
          <span className="text-4xl font-bold text-indigo-700">{score}</span>
        </div>
        <p className="mt-3 text-base font-semibold text-gray-700">{title}</p>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-2">How to earn more points:</h4>
        <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside">
          <li>Write a new review (+10 points)</li>
          <li>Get a &apos;Helpful&apos; vote (+1 point)</li>
          <li>Verify a review with a receipt (+25 points)</li>
        </ul>
      </div>
    </div>
  );
}
