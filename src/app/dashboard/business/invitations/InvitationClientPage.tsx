// src/app/dashboard/business/invitations/InvitationClientPage.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateInvitationLink } from "./actions";
import { toast } from "sonner"; // <-- THE FIX: Import toast from sonner
import { Copy, PlusCircle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Define the types for the props this component will receive
interface Business {
  id: number;
}
interface Invitation {
  id: number;
  invitation_token: string;
  status: string;
  created_at: string;
}

export default function InvitationClientPage({
  business,
  initialInvitations,
}: {
  business: Business;
  initialInvitations: Invitation[];
}) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    const result = await generateInvitationLink(business.id);
    if (result.error) {
      // Use sonner for errors
      toast.error("Error", { description: result.error });
    } else if (result.success && result.token) {
      // Use sonner for success
      toast.success("Success!", { description: result.success });
      const newInvitation = {
        id: Math.random(),
        invitation_token: result.token,
        status: "generated",
        created_at: new Date().toISOString(),
      };
      setInvitations([newInvitation, ...invitations]);
    }
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Link copied to clipboard!"); // Use sonner for info
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Review Invitation Tools</h1>
          <p className="mt-2 text-lg text-gray-600">
            Generate unique links to invite your customers.
          </p>
        </div>
        <Button onClick={handleGenerateLink} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {isGenerating ? "Generating..." : "Generate New Link"}
        </Button>
      </div>

      <div className="bg-white p-8 rounded-lg border">
        <h2 className="text-2xl font-semibold">Generated Links</h2>
        <div className="mt-6 border-t pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length > 0 ? (
                invitations.map((invite) => {
                  const fullLink =
                    typeof window !== "undefined"
                      ? `${window.location.origin}/leave-a-review/${invite.invitation_token}`
                      : "";
                  return (
                    <TableRow key={invite.id}>
                      <TableCell className="font-mono text-xs break-all">
                        {fullLink}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {invite.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(invite.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(fullLink)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No invitation links have been generated yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
