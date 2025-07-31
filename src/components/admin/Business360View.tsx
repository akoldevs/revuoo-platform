// src/components/admin/Business360View.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  ArrowLeft,
  Crown,
  FileText,
  Settings,
  Puzzle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateSubscriptionModal } from "@/components/admin/CreateSubscriptionModal";
import { Toaster } from "@/components/ui/sonner";

// --- Type Definitions ---
type Review = {
  id: string | number;
  title: string;
  summary: string | null;
  overall_rating: number;
  created_at: string;
  author_name: string | null;
};

type ConnectedIntegration = {
  name: string;
  category: string;
  is_connected: boolean;
  connected_at: string;
};

type Business360Data = {
  id: number;
  name: string;
  website_url: string | null;
  is_verified: boolean;
  created_at: string;
  total_reviews: number;
  average_rating: number;
  recent_user_reviews: Review[] | null;
  subscription_plan: string | null;
  subscription_status: string | null;
  expert_reviews: Review[] | null;
  connected_integrations: ConnectedIntegration[] | null;
};

// --- Child Components ---
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

function ReviewListCard({
  title,
  description,
  reviews,
  icon: Icon,
  emptyMessage,
}: {
  title: string;
  description: string;
  reviews: Review[] | null;
  icon: React.ElementType;
  emptyMessage: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-semibold">{review.title}</p>
                  <p className="text-sm text-muted-foreground">
                    by {review.author_name || "Anonymous"} on{" "}
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </p>
                  <p className="mt-2 text-sm italic">
                    &quot;{review.summary || "No summary provided."}&quot;
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    <Star className="mr-1 h-3 w-3" />
                    {(review.overall_rating || 0).toFixed(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ✅ NEW: Reusable component for the Integrations card based on your professional suggestion
function IntegrationsCard({
  integrations,
}: {
  integrations: ConnectedIntegration[] | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle className="h-5 w-5" />
          Connected Integrations
        </CardTitle>
        <CardDescription>
          A list of third-party services connected to this business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {integrations && integrations.length > 0 ? (
          <div className="divide-y">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold">{integration.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    Category: {integration.category}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Connected</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    on{" "}
                    {format(new Date(integration.connected_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No connected integrations found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Main Component ---
export function Business360View({
  initialBusiness,
}: {
  initialBusiness: Business360Data;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <Toaster richColors />
      <CreateSubscriptionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        businessId={initialBusiness.id}
        businessName={initialBusiness.name}
      />

      <div className="w-full space-y-8">
        {/* Header Section (Unchanged) */}
        <div className="flex justify-between items-start">
          <div>
            <Button asChild variant="ghost" className="mb-4 -ml-4">
              <Link href="/admin/businesses">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Businesses
              </Link>
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Briefcase className="h-8 w-8" />
              {initialBusiness.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              A complete 360° intelligence view of this business.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Manage Subscription
          </Button>
        </div>

        {/* Key Stats Grid (Unchanged) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total User Reviews"
            value={initialBusiness.total_reviews}
            icon={MessageSquare}
          />
          <StatCard
            title="Average Rating"
            value={initialBusiness.average_rating.toFixed(1)}
            icon={Star}
          />
          <StatCard
            title="Subscription"
            value={initialBusiness.subscription_plan || "Free"}
            icon={Crown}
            description={`Status: ${
              initialBusiness.subscription_status || "N/A"
            }`}
          />
          <StatCard
            title="Verification"
            value={initialBusiness.is_verified ? "Verified" : "Unverified"}
            icon={initialBusiness.is_verified ? CheckCircle : XCircle}
          />
        </div>

        {/* ✅ IMPROVED: Main content section using your balanced layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ReviewListCard
            title="Expert Reviews"
            description="High-quality reviews by approved contributors."
            reviews={initialBusiness.expert_reviews}
            icon={Crown}
            emptyMessage="No approved expert reviews for this business yet."
          />

          <ReviewListCard
            title="User Reviews"
            description="The 5 most recent reviews from standard users."
            reviews={initialBusiness.recent_user_reviews}
            icon={FileText}
            emptyMessage="No approved user reviews for this business yet."
          />

          {/* The Integrations card now spans the full width of the grid */}
          <div className="lg:col-span-2">
            <IntegrationsCard
              integrations={initialBusiness.connected_integrations}
            />
          </div>
        </div>
      </div>
    </>
  );
}
