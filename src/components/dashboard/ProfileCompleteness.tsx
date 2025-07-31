// src/components/dashboard/ProfileCompleteness.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface ProfileCompletenessProps {
  percentage: number;
  missingSteps: {
    label: string;
    href: string;
  }[];
}

export default function ProfileCompleteness({
  percentage,
  missingSteps,
}: ProfileCompletenessProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Completeness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-indigo-600">
            {percentage}%
          </span>
          <Progress value={percentage} className="w-full h-3" />
        </div>
        {percentage < 100 ? (
          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3">
              Complete your profile to build more trust:
            </h4>
            <ul className="space-y-3">
              {missingSteps.map((step) => (
                <li key={step.label}>
                  <Link
                    href={step.href}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    + {step.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-semibold text-sm">
              Your profile is 100% complete. Great job!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
