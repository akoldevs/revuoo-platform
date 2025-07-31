// src/app/admin/support/page.tsx
import { LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SupportTicketsManager } from "@/components/admin/SupportTicketsManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link"; // ✅ 1. Import the Link component

export const dynamic = "force-dynamic";

export default async function SupportTicketsPage() {
  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LifeBuoy className="h-8 w-8" /> Support Tickets
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Centralized hub for all customer support inquiries.
          </p>
        </div>
        {/* ✅ 2. The button is now wrapped in a Link and enabled */}
        <Button asChild>
          <Link href="/admin/support/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Ticket
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unified Inbox</CardTitle>
          <CardDescription>
            A single view for all incoming support requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupportTicketsManager />
        </CardContent>
      </Card>
    </div>
  );
}
