import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { CreditCard, DollarSign, Wallet } from "lucide-react";
import StripeConnectButton from "@/components/contributor/StripeConnectButton";

export const dynamic = "force-dynamic";

// 🧠 Type-safe payout structure
type PayoutsData = {
  is_stripe_connected: boolean;
  pending_amount: number;
  lifetime_paid_amount: number;
  payout_history: {
    id: string;
    amount: number;
    payout_date: string | null;
    created_at: string;
    description: string;
  }[];
};

const formatCentsToDollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default async function PayoutsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data, error } = await supabase.rpc("get_my_payouts_page_data");

  if (error || !data) {
    console.error("Error fetching payouts data:", error);
    return (
      <div className="p-4 text-destructive">
        Could not load your payout information. Please try again later.
      </div>
    );
  }

  const payoutsData = data as PayoutsData;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your payment methods and view your earnings history.
        </p>
      </header>

      <main className="space-y-8">
        {/* 💰 Earnings Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Available for Payout
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCentsToDollars(payoutsData.pending_amount)}
              </div>
              <p className="text-xs text-muted-foreground">
                From approved, unpaid reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Lifetime Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCentsToDollars(payoutsData.lifetime_paid_amount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total amount paid out to you
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 🔗 Stripe Connect */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              We use Stripe to ensure secure payouts directly to your bank
              account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payoutsData.is_stripe_connected ? (
              <div className="flex justify-between items-center border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold">Stripe Account Connected</p>
                    <p className="text-sm text-muted-foreground">
                      Your earnings will be paid out automatically.
                    </p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Manage on Stripe
                </Button>
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="mb-4 text-muted-foreground">
                  To receive payouts, please connect your Stripe account.
                </p>
                <StripeConnectButton />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 📄 Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>
              A record of all payments sent to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutsData.payout_history.length > 0 ? (
                  payoutsData.payout_history.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        {format(
                          new Date(payout.payout_date ?? payout.created_at),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell>{payout.description}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCentsToDollars(payout.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      You have no payout history yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
