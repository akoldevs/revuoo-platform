// src/components/admin/OpportunityActivityFeed.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Pencil, Star } from "lucide-react";
import { format } from "date-fns";

type Activity = {
  id: number;
  created_at: string;
  activity_type: "stage_change" | "note_added" | "created";
  details: {
    old?: string;
    new?: string;
    stage?: string;
    value?: number;
    note_preview?: string;
  };
  profiles: {
    full_name: string | null;
  } | null;
};

// A helper to render each activity item
function ActivityItem({ activity }: { activity: Activity }) {
  const author = activity.profiles?.full_name || "System";
  const dateTime = format(new Date(activity.created_at), "MMM d, yyyy, p");

  const renderDetails = () => {
    switch (activity.activity_type) {
      case "created":
        return (
          <p className="flex items-center gap-2">
            Opportunity created with stage{" "}
            <Badge variant="secondary" className="capitalize">
              {activity.details.stage?.replace("_", " ")}
            </Badge>
          </p>
        );
      case "stage_change":
        return (
          <p className="flex items-center gap-2">
            Stage changed from
            <Badge variant="secondary" className="capitalize">
              {activity.details.old?.replace("_", " ")}
            </Badge>
            <ArrowRight className="h-4 w-4" />
            <Badge variant="secondary" className="capitalize">
              {activity.details.new?.replace("_", " ")}
            </Badge>
          </p>
        );
      case "note_added":
        return (
          <p>
            Note added:{" "}
            <span className="italic text-muted-foreground">
              "{activity.details.note_preview}"
            </span>
          </p>
        );
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (activity.activity_type) {
      case "created":
        return <Star className="h-4 w-4 text-primary" />;
      case "note_added":
        return <FileText className="h-4 w-4 text-primary" />;
      default:
        return <Pencil className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
        {getIcon()}
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

export async function OpportunityActivityFeed({
  opportunityId,
}: {
  opportunityId: number;
}) {
  const supabase = await createClient();

  const { data: activities, error } = await supabase
    .from("opportunity_activities")
    .select(
      `
      id,
      created_at,
      activity_type,
      details,
      profiles ( full_name )
    `
    )
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-500">Could not load activity feed.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>
          A log of all actions taken on this opportunity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity as Activity} />
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
