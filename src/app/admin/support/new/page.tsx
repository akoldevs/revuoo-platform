// src/app/admin/support/new/page.tsx
import { PlusCircle } from "lucide-react";
import { CreateTicketForm } from "@/components/admin/CreateTicketForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
  return (
    <div className="w-full space-y-8">
      <Link href="/admin/support">
        <Button variant="outline">← Back to All Tickets</Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PlusCircle className="h-8 w-8" /> Create New Ticket
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manually create a new support ticket on behalf of a user.
        </p>
      </div>
      <CreateTicketForm />
    </div>
  );
}
