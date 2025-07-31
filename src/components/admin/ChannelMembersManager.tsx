// src/components/admin/ChannelMembersManager.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Users, PlusCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addMemberToChannel } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";

// --- Type Definitions ---
type Profile = { id: string; full_name: string | null };
// ✅ FIX: Corrected the type to expect an array for the 'profiles' relationship,
// which matches the data structure returned by Supabase.
type ChannelMemberWithProfiles = { profiles: Profile[] | null };
type StaffMember = { id: string; full_name: string | null };

function AddMemberButton({
  channelId,
  profileId,
}: {
  channelId: number;
  profileId: string;
}) {
  const { pending } = useFormStatus();

  const addMemberAction = async (formData: FormData) => {
    const result = await addMemberToChannel(formData);
    if (result.error) {
      toast.error("Failed to add member", { description: result.error });
    } else {
      toast.success(result.message);
      // The real-time subscription in ChatClient will handle the UI update.
    }
  };

  return (
    <form action={addMemberAction}>
      <input type="hidden" name="channel_id" value={channelId} />
      <input type="hidden" name="profile_id" value={profileId} />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="mr-2 h-4 w-4" />
        )}
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
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Profile[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      const fetchMembersAndStaff = async () => {
        setIsLoading(true);
        const { data: memberData, error: memberError } = await supabase
          .from("channel_members")
          .select("profiles(id, full_name)")
          .eq("channel_id", channelId);

        const { data: staffData, error: staffError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .not("role_id", "is", null);

        if (memberError || staffError) {
          toast.error("Failed to fetch data.");
          console.error({ memberError, staffError });
        }

        // ✅ FIX: Use flatMap to correctly process the array of profiles and resolve all TypeScript errors.
        const extractedMembers = (
          (memberData as ChannelMemberWithProfiles[]) || []
        )
          .flatMap((m) => m.profiles || []) // Safely flatten the array of profiles
          .filter((p): p is Profile => p !== null);

        setMembers(extractedMembers);
        setStaff(staffData || []);
        setIsLoading(false);
      };
      fetchMembersAndStaff();
    }
  }, [isOpen, channelId, supabase]);

  const memberIds = new Set(members.map((m) => m.id));
  const staffNotInChannel = staff.filter((s) => !memberIds.has(s.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Users className="mr-2 h-4 w-4" />
        {memberCount} members
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Members of #{channelName}</DialogTitle>
          <DialogDescription>
            View current members or add other staff to this channel.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Current Members ({members.length})
              </h3>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {member.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.full_name}</span>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No members yet.
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Add Team Members
              </h3>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {staffNotInChannel.map((staffMember) => (
                  <div
                    key={staffMember.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {staffMember.full_name?.charAt(0)?.toUpperCase() ||
                            "U"}
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
                {staffNotInChannel.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All staff members are already in this channel.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
