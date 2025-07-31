// src/components/contributor/PerformanceCoach.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
// ✅ Import the Server Action from its new location
import { getPerformanceInsight } from "@/app/actions/contributorActions";

// This type now needs to be defined here as well for the component's state
type PerformanceData = {
  review_id: string;
  review_title: string;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes: number;
  impact_score: number;
};

// The main client component
export default function PerformanceCoach() {
  const [isPending, startTransition] = useTransition();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    const fetchData = async () => {
      const { data, error } = await supabase.rpc("get_my_content_performance");
      if (error) {
        console.error("Failed to fetch performance data:", error);
        setError("Could not load performance data.");
      } else {
        setPerformanceData(data || []);
      }
    };
    fetchData();
  }, []);

  const handleGetInsight = () => {
    startTransition(async () => {
      setAiInsight(""); // Clear previous insight
      // ✅ Call the imported Server Action
      const insight = await getPerformanceInsight(performanceData);
      setAiInsight(insight);
    });
  };

  if (error) {
    return <div className="text-destructive p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">AI Performance Coach</h2>
            <p className="text-muted-foreground mt-1">
              Analyze your published content and get personalized tips to
              improve your impact.
            </p>
          </div>
          <Button
            onClick={handleGetInsight}
            disabled={isPending || performanceData.length === 0}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Feedback
          </Button>
        </div>

        {aiInsight && (
          <Alert className="mt-4 bg-blue-500/10 border-blue-500/30">
            <Sparkles className="h-4 w-4" />
            <AlertTitle className="font-bold">Coach&apos;s Notes</AlertTitle>
            <AlertDescription className="prose prose-sm dark:prose-invert max-w-none">
              <p>{aiInsight}</p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Published Review</TableHead>
              <TableHead className="text-right">Impact Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData.length > 0 ? (
              performanceData.map((review) => (
                <TableRow key={review.review_id}>
                  <TableCell className="font-medium">
                    {review.review_title}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold w-10">
                        {review.impact_score.toFixed(1)}
                      </span>
                      <Progress
                        value={review.impact_score}
                        className="w-24 h-2"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center h-24">
                  No approved reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
