// src/components/admin/AddLeadModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { searchUsersForLeads, createLead } from "@/app/admin/actions";
import { toast } from "sonner";
import { PlusCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type SearchResultUser = {
  id: string;
  name: string | null;
  email: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding Lead..." : "Add as Lead"}
    </Button>
  );
}

export function AddLeadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResultUser | null>(
    null
  );
  const router = useRouter(); // Initialize router

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedUser(null);

    if (newQuery.length > 2) {
      setIsLoading(true);
      const response = await searchUsersForLeads(newQuery);
      if (response.error) {
        toast.error("Search failed", { description: response.error });
        setResults([]);
      } else {
        setResults(response.data);
      }
      setIsLoading(false);
    } else {
      setResults([]);
    }
  };

  const createLeadAction = async (formData: FormData) => {
    const result = await createLead(formData);
    if (result.error) {
      toast.error("Failed to create lead", { description: result.error });
    } else {
      toast.success(result.message);
      // ✅ FIX: Automatically refresh the page to show the new lead
      router.refresh();
      setIsOpen(false);
      setQuery("");
      setResults([]);
      setSelectedUser(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Lead
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Search for an existing user to add them to the sales pipeline.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search by name or email..."
            value={query}
            onChange={handleSearch}
          />
          {/* ✅ FIX: Container with fixed height to prevent "shaky" UI */}
          <div className="space-y-2 max-h-60 h-60 overflow-y-auto relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            )}
            {!isLoading &&
              results.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer border-2 ${
                    selectedUser?.id === user.id
                      ? "border-primary"
                      : "border-transparent"
                  } hover:bg-muted`}
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
          {selectedUser && (
            <form action={createLeadAction} className="pt-4 border-t">
              <p className="mb-4">
                Add{" "}
                <span className="font-bold">
                  {selectedUser.name || selectedUser.email}
                </span>{" "}
                as a new lead?
              </p>
              <input type="hidden" name="profile_id" value={selectedUser.id} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <SubmitButton />
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
