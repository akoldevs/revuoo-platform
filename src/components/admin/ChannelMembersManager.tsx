// src/components/admin/ChannelMembersManager.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Users, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addMemberToChannel } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";

// ... (Type Definitions remain the same)
type Profile = { id: string; full_name: string | null };
type ChannelMember = { profiles: Profile };
type StaffMember = { id: string; full_name: string | null };

function AddMemberButton({
  channelId,
  profileId,
}: {
  channelId: number;
  profileId: string;
}) {
  const { pending } = useFormStatus();
  const router = useRouter(); // Use router here

  const addMemberAction = async (formData: FormData) => {
    const result = await addMemberToChannel(formData);
    if (result.error) {
      toast.error("Failed to add member", { description: result.error });
    } else {
      toast.success(result.message);
      router.refresh(); // ✅ Refresh the page to update member count
    }
  };
  return (
    <form action={addMemberAction}>
      <input type="hidden" name="channel_id" value={channelId} />
      <input type="hidden" name="profile_id" value={profileId} />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add
      </Button>
    </form>
  );
}

export function ChannelMembersManager({
  channelId,
  channelName,
  memberCount,
}: {
  channelId: number;
  channelName: string;
  memberCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      const fetchMembersAndStaff = async () => {
        const { data: memberData } = await supabase
          .from("channel_members")
          .select("profiles(id, full_name)")
          .eq("channel_id", channelId);
        const { data: staffData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .not("role_id", "is", null);
        setMembers((memberData as any) || []);
        setStaff(staffData || []);
      };
      fetchMembersAndStaff();
    }
  }, [isOpen, channelId, supabase]);

  const memberIds = new Set(members.map((m) => m.profiles.id));
  const staffNotInChannel = staff.filter((s) => !memberIds.has(s.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Users className="mr-2 h-4 w-4" />
        {memberCount} members
      </Button>
      <DialogContent className="sm:max-w-lg">
        {/* ... (Modal content remains the same) ... */}
        <DialogHeader>
          <DialogTitle>Members of #{channelName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Current Members
          </h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {members.map((member) => (
              <div
                key={member.profiles.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {member.profiles.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.profiles.full_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Add Team Members
          </h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {staffNotInChannel.map((staffMember) => (
              <div
                key={staffMember.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {staffMember.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{staffMember.full_name}</span>
                </div>
                <AddMemberButton
                  channelId={channelId}
                  profileId={staffMember.id}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
