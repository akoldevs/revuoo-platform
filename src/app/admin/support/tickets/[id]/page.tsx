// src/app/admin/support/tickets/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TicketReplyForm } from "@/components/admin/TicketReplyForm";
import { TicketDetailsEditor } from "@/components/admin/TicketDetailsEditor"; // ✅ 1. Import new editor

// Define the types for our ticket data
type Reply = {
  id: number;
  content: string;
  created_at: string;
  is_internal_note: boolean;
  author_name: string;
  author_id: string;
};

type TicketDetails = {
  ticket_id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  submitter_profile_id: string;
  submitter_name: string;
  submitter_email: string;
  replies: Reply[] | null;
};

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const ticketId = Number(params.id);

  const { data: ticket, error } = await supabase
    .rpc("get_ticket_details", { p_ticket_id: ticketId })
    .returns<TicketDetails>()
    .single();

  if (error || !ticket) {
    console.error("Error fetching ticket details:", error);
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  return (
    <>
      <Toaster richColors />
      <div className="w-full space-y-6">
        <Link href="/admin/support">
          <Button variant="outline">← Back to All Tickets</Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold">{ticket.subject}</h1>
          <p className="text-muted-foreground mt-1">
            Ticket #{ticket.ticket_id} submitted by {ticket.submitter_name} (
            {ticket.submitter_email})
          </p>
        </div>

        {/* ✅ 2. New two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Conversation Thread */}
            {ticket.replies?.map((reply) => (
              <Card
                key={reply.id}
                className={
                  reply.author_id === currentUserId
                    ? "bg-blue-50 border-blue-200"
                    : ""
                }
              >
                <CardHeader className="flex flex-row justify-between items-center pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {reply.author_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-base">
                      {reply.author_name}
                    </CardTitle>
                    {reply.is_internal_note && (
                      <Badge variant="destructive">Internal Note</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {format(new Date(reply.created_at), "MMM d, yyyy, p")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{reply.content}</p>
                </CardContent>
              </Card>
            ))}
            {/* Reply Form */}
            <TicketReplyForm ticketId={ticket.ticket_id} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <TicketDetailsEditor ticket={ticket} />
          </div>
        </div>
      </div>
    </>
  );
}
