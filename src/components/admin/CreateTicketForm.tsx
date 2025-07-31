// src/components/admin/CreateTicketForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { searchUsersForLeads, createSupportTicket } from "@/app/admin/actions";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type SearchResultUser = {
  id: string;
  name: string | null;
  email: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? "Creating Ticket..." : "Create Ticket"}
    </Button>
  );
}

export function CreateTicketForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResultUser | null>(
    null
  );
  const router = useRouter();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedUser(null);

    if (newQuery.length > 2) {
      setIsLoading(true);
      const response = await searchUsersForLeads(newQuery);
      if (!response || response.error) {
        toast.error("Search failed", {
          description: response?.error || "An unknown error occurred.",
        });
        setResults([]);
      } else {
        setResults(response.data);
      }
      setIsLoading(false);
    } else {
      setResults([]);
    }
  };

  const createTicketAction = async (formData: FormData) => {
    const result = await createSupportTicket(formData);
    if (result.error) {
      toast.error("Failed to create ticket", { description: result.error });
    } else {
      toast.success(result.message);
      router.push(`/admin/support/tickets/${result.ticketId}`);
    }
  };

  return (
    <form action={createTicketAction}>
      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>
            Find the user this ticket is for and fill in the details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Find User</Label>
            <Input
              placeholder="Search by name or email..."
              value={query}
              onChange={handleSearch}
              disabled={!!selectedUser}
            />
            <div className="border rounded-md min-h-[40px]">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin" />
                </div>
              )}
              {!isLoading && !selectedUser && results.length > 0 && (
                <div className="space-y-1 p-2 max-h-48 overflow-y-auto">
                  {results.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setQuery(user.name || user.email);
                        setResults([]);
                      }}
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedUser && (
                <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-muted">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedUser.name?.charAt(0) ||
                          selectedUser.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedUser.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(null);
                      setQuery("");
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
          </div>

          <input
            type="hidden"
            name="profile_id"
            value={selectedUser?.id || ""}
          />

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              required
              disabled={!selectedUser}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue="open"
                required
                disabled={!selectedUser}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                name="priority"
                defaultValue="medium"
                required
                disabled={!selectedUser}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Initial Message</Label>
            <Textarea
              id="content"
              name="content"
              rows={8}
              required
              disabled={!selectedUser}
              placeholder="Message must be at least 10 characters."
            />
          </div>

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
