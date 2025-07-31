// src/app/dashboard/contributor/assignments/[id]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { DollarSign, Calendar, Info } from "lucide-react";
import { ClaimButton } from "../ClaimButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type AssignmentDetails = {
  id: number;
  title: string;
  description: string;
  payout_amount: number;
  status: string;
  due_date: string | null;
  contributor_id: string | null;
  categories: { id: string; name: string; slug: string }[] | null;
};

export default async function AssignmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const assignmentId = parseInt(params.id, 10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: assignment, error } = await supabase
    .rpc("get_assignment_details", { p_assignment_id: assignmentId })
    .returns<AssignmentDetails[]>()
    .single();

  if (error || !assignment) {
    notFound();
  }

  const renderActionFooter = () => {
    switch (assignment.status) {
      case "open":
        return <ClaimButton assignmentId={assignment.id} />;

      case "in_progress":
        if (assignment.contributor_id === user?.id) {
          return (
            <Button className="w-full" asChild>
              {/* ✅ FIXED: The link now correctly points to the dynamic route */}
              <Link
                href={`/dashboard/contributor/content/submit/${assignment.id}`}
              >
                Submit Your Work
              </Link>
            </Button>
          );
        }
        return (
          <Button className="w-full" disabled>
            Assignment Has Been Claimed
          </Button>
        );

      default:
        return (
          <Button className="w-full" disabled>
            Assignment Closed
          </Button>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-2/3 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {assignment.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {assignment.categories?.map((cat) => (
              <Badge key={cat.id} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p>{assignment.description}</p>
        </div>
      </div>

      <div className="lg:w-1/3">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Review and claim this assignment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-3 text-muted-foreground" />
              <span className="font-semibold text-lg">
                ${assignment.payout_amount}
              </span>
              <span className="ml-1 text-muted-foreground">Payout</span>
            </div>
            {assignment.due_date && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="font-semibold">
                  {format(new Date(assignment.due_date), "MMMM d, yyyy")}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-3 text-muted-foreground" />
              <Badge
                variant={assignment.status === "open" ? "default" : "secondary"}
              >
                {assignment.status.charAt(0).toUpperCase() +
                  assignment.status.slice(1).replace("_", " ")}
              </Badge>
            </div>
          </CardContent>
          <CardFooter>{renderActionFooter()}</CardFooter>
        </Card>
      </div>
    </div>
  );
}
