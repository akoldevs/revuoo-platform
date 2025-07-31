// src/components/contributor/ExpertReviewList.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import React from "react";
import { MessageSquareQuote, Edit } from "lucide-react"; // ✅ Import new icon
import { Button } from "@/components/ui/button"; // ✅ Import Button
import Link from "next/link"; // ✅ Import Link

type SubmittedContent = {
  id: string;
  review_title: string;
  submitted_at: string;
  status: string;
  assignment_title: string;
  moderator_notes: string | null;
};

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const getStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    case "pending_approval":
    default:
      return "secondary";
  }
};

export default function ExpertReviewList({
  reviews,
}: {
  reviews: SubmittedContent[];
}) {
  if (reviews.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-card text-card-foreground">
        <h3 className="text-lg font-semibold">
          No Expert Reviews Submitted Yet
        </h3>
        <p className="text-muted-foreground mt-2">
          Claim an assignment and submit your work to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <React.Fragment key={review.id}>
              <TableRow>
                <TableCell className="font-medium">
                  <p className="font-bold">{review.review_title}</p>
                  <p className="text-sm text-muted-foreground">
                    For: {review.assignment_title}
                  </p>
                </TableCell>
                <TableCell>
                  {format(new Date(review.submitted_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStatusVariant(review.status)}>
                    {review.status.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
              {review.status === "rejected" && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-r-md space-y-4">
                      <div className="flex items-start gap-3">
                        <MessageSquareQuote className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            Feedback from the Editor
                          </p>
                          <p className="text-sm">{review.moderator_notes}</p>
                        </div>
                      </div>
                      {/* ✅ NEW: "Revise and Resubmit" button */}
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Link
                          href={`/dashboard/contributor/content/revise/${review.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Revise and Resubmit
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
