// src/components/dashboard/ShowcaseSettings.tsx
"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { exportPortfolio } from "@/app/dashboard/account/actions";
import { toast } from "sonner";
import { ExternalLink, HardDriveDownload, Loader2 } from "lucide-react";

// Define the component's props using a type alias for clarity and safety.
type ShowcaseSettingsProps = {
  username: string | null;
};

export default function ShowcaseSettings({ username }: ShowcaseSettingsProps) {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const result = await exportPortfolio();

      if (result.error) {
        toast.error("Export Failed", { description: result.error });
      } else if (result.data) {
        // This client-side logic creates a downloadable file from the server data.
        const jsonString = JSON.stringify(result.data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `revuoo_portfolio_${username || "export"}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Portfolio Exported!", {
          description: "Your portfolio JSON file has been downloaded.",
        });
      }
    });
  };

  if (!username) {
    return (
      <p className="text-sm text-muted-foreground">
        Your username must be set in your profile to generate showcase links.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-lg">Public Showcase & Data</h4>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your public-facing contributor profile and export your work.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link
            href={`/contributors/${username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Public Profile
          </Link>
        </Button>
        <Button onClick={handleExport} disabled={isPending}>
          {isPending ? (
            <React.Fragment>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </React.Fragment>
          ) : (
            <React.Fragment>
              <HardDriveDownload className="mr-2 h-4 w-4" />
              Export My Portfolio
            </React.Fragment>
          )}
        </Button>
      </div>
    </div>
  );
}
