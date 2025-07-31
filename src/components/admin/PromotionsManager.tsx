// src/components/admin/PromotionsManager.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type DiscountWithCount = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  value: number;
  is_active: boolean;
  expires_at: string | null;
  redemption_count: number;
  max_redemptions: number | null;
};

export async function PromotionsManager() {
  const supabase = await createClient();
  const { data: discounts, error } = await supabase
    .rpc("get_all_discounts_with_redemption_counts")
    .returns<DiscountWithCount[]>();

  if (error) {
    console.error("Error fetching promotions:", error);
    return <p className="text-red-500">Failed to load promotions data.</p>;
  }

  return (
    <div className="border rounded-lg mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Redemptions</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(discounts) && discounts.length > 0 ? (
            discounts.map((discount: DiscountWithCount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-mono font-semibold">
                  {discount.code}
                </TableCell>
                <TableCell>
                  {discount.discount_type === "percent"
                    ? `${discount.value}% off`
                    : `$${discount.value} off`}
                </TableCell>
                <TableCell>
                  <Badge variant={discount.is_active ? "default" : "secondary"}>
                    {discount.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {discount.redemption_count}
                  </span>
                  {discount.max_redemptions && (
                    <span className="text-muted-foreground">
                      {" "}
                      / {discount.max_redemptions}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {discount.expires_at
                    ? format(new Date(discount.expires_at), "MMM d, yyyy")
                    : "No expiry"}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/settings">
                      <Edit className="mr-2 h-4 w-4" /> Edit in Settings
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No discount codes have been created yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
