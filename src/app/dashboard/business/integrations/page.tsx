// src/app/dashboard/business/integrations/page.tsx
import { Puzzle } from "lucide-react";
import { BusinessIntegrationsManager } from "@/components/dashboard/BusinessIntegrationsManager";

export const dynamic = "force-dynamic";

export default async function BusinessIntegrationsPage() {
  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Puzzle className="h-8 w-8" /> Integrations
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Connect Revuoo to your favorite tools to automate your workflow.
        </p>
      </div>

      <BusinessIntegrationsManager />
    </div>
  );
}
