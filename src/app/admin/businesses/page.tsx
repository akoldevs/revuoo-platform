// src/app/admin/businesses/page.tsx
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
import { Briefcase, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// This ensures the page is always dynamically rendered and fetches fresh data.
export const dynamic = "force-dynamic";

// Define a clear type for the business data we expect from our query.
type BusinessForAdminView = {
  id: number;
  name: string;
  website_url: string | null;
  is_verified: boolean;
  created_at: string;
};

export default async function BusinessManagementPage() {
  const supabase = await createClient();

  // Fetch all businesses from the public schema.
  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("id, name, website_url, is_verified, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching businesses:", error);
    return (
      <div className="text-red-500">
        Failed to load business data. Please check the server logs.
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8" /> Business Management
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View and manage all business profiles on the Revuoo platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Businesses ({businesses?.length || 0})</CardTitle>
          <CardDescription>
            A complete list of all businesses registered on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Verification Status</TableHead>
                <TableHead className="text-right">Registered On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses && businesses.length > 0 ? (
                businesses.map((business: BusinessForAdminView) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">
                      {/* ✅ NEW: The business name is now a link */}
                      <Link
                        href={`/admin/businesses/${business.id}`}
                        className="hover:underline"
                      >
                        {business.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {business.website_url ? (
                        <Link
                          href={business.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {business.website_url}
                        </Link>
                      ) : (
                        <span className="italic text-muted-foreground">
                          No website
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={business.is_verified ? "default" : "secondary"}
                        className={
                          business.is_verified
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {business.is_verified ? (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        {business.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {format(new Date(business.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No businesses found.
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
