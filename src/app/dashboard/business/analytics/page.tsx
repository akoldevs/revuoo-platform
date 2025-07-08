// src/app/dashboard/business/analytics/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays } from 'date-fns';
import ViewsChart from '@/components/charts/ViewsChart'; // <-- Import our new chart component

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (!business) {
    return <div>No business found for your account.</div>;
  }

  // Fetch analytics data
  const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
  
  const { data: recentViews } = await supabase
    .from('business_profile_views')
    .select('view_date, view_count')
    .eq('business_id', business.id)
    .gte('view_date', sevenDaysAgo)
    .order('view_date', { ascending: true });

  const { data: totalViewsData } = await supabase
    .from('business_profile_views')
    .select('view_count')
    .eq('business_id', business.id);

  const totalViews = totalViewsData?.reduce((acc, row) => acc + row.view_count, 0) || 0;
  
  // Format data for the chart
  const chartData = recentViews?.map(row => ({
    name: format(new Date(row.view_date), 'MMM d'),
    views: row.view_count
  })) || [];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="border-b pb-6 mb-8">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Performance for {business.name}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">All time views</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Views (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* We now call our clean, separate chart component */}
          <ViewsChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}