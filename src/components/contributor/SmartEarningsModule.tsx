// src/components/contributor/SmartEarningsModule.tsx
"use client";

import { DollarSign, Wallet, Hourglass, BadgeCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ✅ Define a specific type for the earnings data for type-safety
type EarningsData = {
  current_balance: number | null;
  pending_balance: number | null;
  lifetime_earnings: number | null;
  next_payout_date: string | null;
};

// A helper to format cents into a dollar string safely
const formatCentsToDollars = (cents: number | null | undefined): string => {
  if (typeof cents !== "number") return "$0.00";
  return `$${(cents / 100).toFixed(2)}`;
};

export default function SmartEarningsModule({
  earnings,
}: {
  earnings: EarningsData;
}) {
  const currentBalance = earnings?.current_balance || 0;
  const pendingBalance = earnings?.pending_balance || 0;
  const lifetimeEarnings = earnings?.lifetime_earnings || 0;
  const nextPayoutDate = earnings?.next_payout_date
    ? new Date(earnings.next_payout_date)
    : null;

  // Gamification logic
  const PAYOUT_THRESHOLD = 5000; // $50 in cents
  const progressToPayout = Math.min(
    (currentBalance / PAYOUT_THRESHOLD) * 100,
    100
  );

  let earningsBadge = null;
  if (lifetimeEarnings >= 100000) earningsBadge = "🚀 $1K Club";
  else if (lifetimeEarnings >= 50000) earningsBadge = "🔥 $500 Club";
  else if (lifetimeEarnings >= 10000) earningsBadge = "💸 $100 Club";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Summary</CardTitle>
        <CardDescription>
          An overview of your current and lifetime earnings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Available for Payout */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
                Available for Payout
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatCentsToDollars(currentBalance)}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approval */}
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Pending Approval
              </CardTitle>
              <Hourglass className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {formatCentsToDollars(pendingBalance)}
              </div>
            </CardContent>
          </Card>

          {/* Lifetime Earnings */}
          <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                Lifetime Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                {formatCentsToDollars(lifetimeEarnings)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestone Badge */}
        {earningsBadge && (
          <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <BadgeCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Milestone Unlocked!
              </p>
              <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                {earningsBadge}
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Progress to Next Payout */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium">
              Progress to Next Payout ({formatCentsToDollars(PAYOUT_THRESHOLD)})
            </h3>
            {nextPayoutDate && (
              <p className="text-sm text-muted-foreground">
                Next Payout: {format(nextPayoutDate, "MMM d, yyyy")}
              </p>
            )}
          </div>
          <Progress value={progressToPayout} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
}
