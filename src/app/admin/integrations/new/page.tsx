// src/app/admin/integrations/new/page.tsx
import { PlusCircle } from "lucide-react";
import { CreateIntegrationForm } from "@/components/admin/CreateIntegrationForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function NewIntegrationPage() {
  return (
    <div className="w-full space-y-8">
      <Link href="/admin/integrations">
        <Button variant="outline">← Back to All Integrations</Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PlusCircle className="h-8 w-8" /> Add New Integration
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Add a new integration to the Revuoo marketplace directory.
        </p>
      </div>
      <CreateIntegrationForm />
    </div>
  );
}
