// src/components/admin/ActivityFeed.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Pencil } from "lucide-react";
import { format } from "date-fns";

type Activity = {
  id: number;
  created_at: string;
  activity_type: "status_change" | "note_added" | "created";
  details: {
    old?: string;
    new?: string;
    status?: string;
    note_preview?: string;
  };
  profiles: {
    full_name: string | null;
  } | null;
};

type RawActivity = Omit<Activity, "profiles"> & {
  profiles:
    | { full_name: string | null }[]
    | { full_name: string | null }
    | null;
};

// A helper to render each activity item
function ActivityItem({ activity }: { activity: Activity }) {
  const author = activity.profiles?.full_name || "System";
  // ✅ FIX: Updated the date format to include time (e.g., Jul 19, 2025, 1:27 PM)
  const dateTime = format(new Date(activity.created_at), "MMM d, yyyy, p");

  const renderDetails = () => {
    switch (activity.activity_type) {
      case "created":
        return (
          <p>
            Lead created with status{" "}
            <Badge variant="secondary" className="capitalize">
              {activity.details.status}
            </Badge>
          </p>
        );
      case "status_change":
        return (
          <p className="flex items-center gap-2">
            Status changed from
            <Badge variant="secondary" className="capitalize">
              {activity.details.old}
            </Badge>
            <ArrowRight className="h-4 w-4" />
            <Badge variant="secondary" className="capitalize">
              {activity.details.new}
            </Badge>
          </p>
        );
      case "note_added":
        return (
          <p>
            Note added:{" "}
            <span className="italic text-muted-foreground">
              &quot;{activity.details.note_preview}&quot;
            </span>
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
        <Pencil className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{author}</p>
          <p className="text-xs text-muted-foreground">{dateTime}</p>
        </div>
        <div className="text-sm mt-1">{renderDetails()}</div>
      </div>
    </div>
  );
}

export async function ActivityFeed({ leadId }: { leadId: number }) {
  const supabase = await createClient();

  const { data: activitiesRaw, error } = await supabase
    .from("lead_activities")
    .select(
      `
      id,
      created_at,
      activity_type,
      details,
      profiles ( full_name )
    `
    )
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-500">Could not load activity feed.</p>;
  }

  // Map profiles to the expected type (first profile or null)
  const activities: Activity[] =
    activitiesRaw?.map((activity: RawActivity) => ({
      ...activity,
      profiles: Array.isArray(activity.profiles)
        ? activity.profiles[0] || null
        : activity.profiles || null,
    })) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>
          A log of all actions taken on this lead.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No activity recorded yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
