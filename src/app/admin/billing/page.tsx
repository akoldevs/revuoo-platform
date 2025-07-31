// src/app/admin/billing/page.tsx
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
import {
  Receipt,
  DollarSign,
  Users,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

// A small component for displaying key stats
function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Define the types for the data returned by our RPC function
type RecentActivity = {
  id: string;
  business_name: string;
  plan_name: string;
  billing_interval: "month" | "year";
  status: string;
  amount: number;
  created_at: string;
};

type BillingStats = {
  mrr: number;
  active_subscriptions_count: number;
  recent_activity: RecentActivity[];
};

export default async function BillingPage() {
  const supabase = await createClient();

  // ✅ LIVE DATA: Call our new database function to get real-time stats.
  const { data, error } = await supabase
    .rpc("get_admin_billing_dashboard_stats")
    .returns<BillingStats[]>()
    .single();

  if (error || !data) {
    console.error("Error fetching billing stats:", error);
    return (
      <div className="text-red-500 p-4">
        Failed to load billing data. Please check the server logs. This might
        happen if there are no subscriptions in the database yet.
      </div>
    );
  }

  const stats = data;

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Receipt className="h-8 w-8" /> Revenue & Billing
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Monitor your SaaS metrics and subscription revenue.
        </p>
      </div>

      {/* Key Stats Section with Live Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Recurring Revenue"
          value={`$${(stats.mrr || 0).toFixed(2)}`}
          icon={DollarSign}
          description="Based on active monthly & annual plans"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.active_subscriptions_count || 0}
          icon={Users}
          description="Paying customers"
        />
        <StatCard
          title="Average Revenue/User"
          value={
            stats.active_subscriptions_count > 0
              ? `$${(stats.mrr / stats.active_subscriptions_count).toFixed(2)}`
              : "$0.00"
          }
          icon={DollarSign}
          description="MRR / Active Subscriptions"
        />
        <StatCard
          title="Churn Rate"
          value="0.0%"
          icon={Activity}
          description="Calculated monthly (coming soon)"
        />
      </div>

      {/* Recent Activity Section with Live Data */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscription Activity</CardTitle>
          <CardDescription>
            A list of the most recent subscription changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">MRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recent_activity && stats.recent_activity.length > 0 ? (
                stats.recent_activity.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.business_name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sub.plan_name === "Free" ? "secondary" : "default"
                        }
                      >
                        {sub.plan_name}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2 capitalize">
                        ({sub.billing_interval})
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{sub.status}</span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(sub.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${sub.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No recent subscription activity found.
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
