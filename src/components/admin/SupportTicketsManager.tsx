// src/components/admin/SupportTicketsManager.tsx
import { createClient } from "@/lib/supabase/server";
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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Briefcase, PenSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AssigneeManager } from "./AssigneeManager"; // ✅ 1. Import the new component

type Ticket = {
  id: number;
  subject: string;
  status: string;
  priority: string;
  updated_at: string;
  persona: string;
  profile_id: string | null;
  assigned_to_profile_id: string | null;
  submitter_name?: string;
  assignee_name?: string;
};

type StaffMember = {
  id: string;
  full_name: string | null;
};

// This function now also fetches a list of staff members with admin roles
async function getTicketsAndStaff() {
  const supabase = await createClient();

  const [ticketsRes, staffRes] = await Promise.all([
    supabase
      .from("support_tickets")
      .select(
        "id, subject, status, priority, updated_at, persona, profile_id, assigned_to_profile_id"
      )
      .order("updated_at", { ascending: false }),
    // Fetch all users who have an assigned role (i.e., they are staff)
    supabase
      .from("profiles")
      .select("id, full_name")
      .not("role_id", "is", null),
  ]);

  const { data: ticketsData, error: ticketsError } = ticketsRes;
  const { data: staffData, error: staffError } = staffRes;

  if (ticketsError || staffError) {
    console.error("Error fetching data:", ticketsError || staffError);
    throw new Error(ticketsError?.message || staffError?.message);
  }
  if (!ticketsData) return { tickets: [], staff: [] };

  const userIds = new Set<string>();
  ticketsData.forEach((ticket) => {
    if (ticket.profile_id) userIds.add(ticket.profile_id);
    if (ticket.assigned_to_profile_id)
      userIds.add(ticket.assigned_to_profile_id);
  });

  if (userIds.size === 0) {
    return {
      tickets: ticketsData.map((t) => ({
        ...t,
        submitter_name: "N/A",
        assignee_name: "Unassigned",
      })),
      staff: staffData || [],
    };
  }

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", Array.from(userIds));

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    throw new Error(profilesError.message);
  }

  const profilesMap = new Map(
    (profilesData || []).map((p) => [p.id, p.full_name])
  );

  const tickets = ticketsData.map((ticket) => ({
    ...ticket,
    submitter_name: ticket.profile_id
      ? profilesMap.get(ticket.profile_id) || "N/A"
      : "N/A",
    assignee_name: ticket.assigned_to_profile_id
      ? profilesMap.get(ticket.assigned_to_profile_id) || "Unassigned"
      : "Unassigned",
  }));

  return { tickets, staff: staffData || [] };
}

export async function SupportTicketsManager() {
  try {
    // ✅ 2. Fetch both tickets and staff
    const { tickets, staff } = await getTicketsAndStaff();

    return (
      <TooltipProvider>
        <div className="border rounded-lg mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets && tickets.length > 0 ? (
                tickets.map((ticket: Ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-semibold">
                      {ticket.subject}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {ticket.persona === "business" && (
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                              )}
                              {ticket.persona === "contributor" && (
                                <PenSquare className="h-4 w-4 text-muted-foreground" />
                              )}
                              {ticket.persona === "user" && (
                                <User className="h-4 w-4 text-muted-foreground" />
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">
                              {ticket.persona} Ticket
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        <span>{ticket.submitter_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* ✅ 3. Replace the static text with the interactive component */}
                      <AssigneeManager
                        ticketId={ticket.id}
                        currentAssigneeId={ticket.assigned_to_profile_id}
                        staff={staff as StaffMember[]}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(ticket.updated_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/support/tickets/${ticket.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No support tickets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return <p className="text-red-500 p-4">Error: {errorMessage}</p>;
  }
}
