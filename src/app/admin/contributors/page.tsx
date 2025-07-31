// src/app/admin/contributors/page.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// This type matches the structure returned by our new database function.
type ContributorForAdminView = {
  id: string;
  full_name: string | null;
  specialties: string[] | null;
  portfolio_url: string | null;
  created_at: string;
  approved_reviews_count: number;
};

export default async function ContributorSignalsPage() {
  const supabase = await createClient();

  // Fetch all contributor data using our efficient RPC function.
  const { data: contributors, error } = await supabase.rpc(
    "get_admin_contributor_list"
  );

  if (error) {
    console.error("Error fetching contributors:", error);
    return (
      <div className="text-red-500">
        Failed to load contributor data. Please check the server logs.
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" /> Contributor Signals
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage and monitor the performance of your expert contributors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contributors ({contributors?.length || 0})</CardTitle>
          <CardDescription>
            A list of all approved expert contributors on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contributor</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Approved Reviews</TableHead>
                <TableHead>Portfolio</TableHead>
                <TableHead className="text-right">Joined On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributors && contributors.length > 0 ? (
                contributors.map((contributor: ContributorForAdminView) => (
                  <TableRow key={contributor.id}>
                    <TableCell className="font-medium">
                      {contributor.full_name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {contributor.specialties &&
                        contributor.specialties.length > 0 ? (
                          contributor.specialties.map((spec) => (
                            <Badge key={spec} variant="secondary">
                              {spec}
                            </Badge>
                          ))
                        ) : (
                          <span className="italic text-muted-foreground">
                            None specified
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-lg">
                      {contributor.approved_reviews_count}
                    </TableCell>
                    <TableCell>
                      {contributor.portfolio_url ? (
                        <Link
                          href={contributor.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View <ExternalLink className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="italic text-muted-foreground">
                          Not provided
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {format(new Date(contributor.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No contributors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
