// src/app/dashboard/support/page.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { LifeBuoy } from "lucide-react";
import { CreateTicketModal } from "@/components/dashboard/CreateTicketModal";

export const dynamic = "force-dynamic";

type MyTicket = {
  ticket_id: number;
  subject: string;
  status: string;
  last_updated: string;
};

export default async function MySupportTicketsPage({
  searchParams,
}: {
  searchParams: { from?: "user" | "contributor" | "business" };
}) {
  const supabase = await createClient();
  const currentPersona = searchParams.from || "user";

  const { data: tickets, error } = await supabase
    .rpc("get_my_support_tickets", { p_persona: currentPersona })
    .returns<MyTicket[]>();

  if (error) {
    console.error("Error fetching support tickets:", error);
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LifeBuoy className="h-8 w-8" /> My Support Tickets
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Track the status of your support requests and view past
            conversations.
          </p>
        </div>
        <CreateTicketModal persona={currentPersona} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Ticket History (<span className="capitalize">{currentPersona}</span>
            )
          </CardTitle>
          <CardDescription>
            A list of all your submitted support tickets from this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* FIX: Check if 'tickets' is an array and has items before mapping. */}
                {Array.isArray(tickets) && tickets.length > 0 ? (
                  tickets.map(
                    (
                      ticket: MyTicket // FIX: Explicitly typed 'ticket'.
                    ) => (
                      <TableRow key={ticket.ticket_id}>
                        <TableCell className="font-semibold">
                          #{ticket.ticket_id}
                        </TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(ticket.last_updated), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {/* FIX: Escaped the apostrophe to resolve the JSX linting error. */}
                      You haven&apos;t submitted any support tickets from this
                      workspace yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
