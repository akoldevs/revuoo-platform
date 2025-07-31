// src/app/admin/integrations/page.tsx
import { Puzzle, PlusCircle } from "lucide-react";
import { IntegrationsManager } from "@/components/admin/IntegrationsManager";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // ✅ 1. Import the Link component

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Puzzle className="h-8 w-8" /> Integrations
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage all available integrations for your businesses.
          </p>
        </div>
        {/* ✅ 2. Wrap the Button in a Link and remove the disabled prop */}
        <Button asChild>
          <Link href="/admin/integrations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Integration
          </Link>
        </Button>
      </div>

      <IntegrationsManager />
    </div>
  );
}
