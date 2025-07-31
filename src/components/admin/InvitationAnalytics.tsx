// src/components/admin/InvitationAnalytics.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Clock, Mail, CheckCircle, Trophy } from "lucide-react";
import Link from "next/link";

type AnalyticsData = {
  total_sent: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
};

type LeaderboardEntry = {
  business_id: number;
  business_name: string;
  converted_reviews_count: number;
};

export async function InvitationAnalytics() {
  const supabase = await createClient();

  const [analyticsRes, leaderboardRes] = await Promise.all([
    supabase.rpc("get_invitation_analytics_for_admin").single<AnalyticsData>(),
    supabase.rpc("get_invitation_leaderboard").returns<LeaderboardEntry[]>(),
  ]);

  const analytics = analyticsRes.data;
  const leaderboard = leaderboardRes.data;

  // ✅ FIX: Add a type guard to ensure 'leaderboard' is an array before using it.
  // This resolves all the TypeScript errors.
  const isLeaderboardArray = Array.isArray(leaderboard);

  const stats = [
    {
      title: "Total Invitations Sent",
      value: analytics?.total_sent?.toLocaleString() || "0",
      icon: Mail,
    },
    {
      title: "Avg. Open Rate",
      value: `${(analytics?.open_rate || 0).toFixed(1)}%`,
      icon: BarChart,
    },
    {
      title: "Avg. Click Rate",
      value: `${(analytics?.click_rate || 0).toFixed(1)}%`,
      icon: Clock,
    },
    {
      title: "Review Conversion Rate",
      value: `${(analytics?.conversion_rate || 0).toFixed(1)}%`,
      icon: CheckCircle,
    },
  ];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Platform-Wide Invitation Performance</CardTitle>
        <CardDescription>
          An overview of invitation engagement and top-performing businesses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-yellow-500" /> Top Performing
            Businesses
          </h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead className="text-right">
                    Converted Reviews
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLeaderboardArray && leaderboard.length > 0 ? (
                  leaderboard.map((entry: LeaderboardEntry, index: number) => (
                    <TableRow key={entry.business_id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/businesses/${entry.business_id}`}
                          className="hover:underline text-primary font-semibold"
                        >
                          {entry.business_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {entry.converted_reviews_count}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No converted reviews yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
