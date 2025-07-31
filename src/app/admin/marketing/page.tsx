// src/app/admin/marketing/page.tsx
import { Megaphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationAnalytics } from "@/components/admin/InvitationAnalytics";
import { PromotionsManager } from "@/components/admin/PromotionsManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Megaphone className="h-8 w-8" /> Marketing & Growth
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tools to drive user engagement and business acquisition.
        </p>
      </div>

      <Tabs defaultValue="invitations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invitations">Invitation Analytics</TabsTrigger>
          {/* ✅ New "Promotions" tab is now enabled */}
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="audience" disabled>
            Audience Segments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invitations">
          <InvitationAnalytics />
        </TabsContent>

        {/* ✅ New content block for the "Promotions" tab */}
        <TabsContent value="promotions">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Promotions Management</CardTitle>
            </CardHeader>
            <CardContent>
              <PromotionsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
