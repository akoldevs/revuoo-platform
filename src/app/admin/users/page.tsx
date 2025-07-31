// src/app/admin/users/page.tsx
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js"; // ✅ Import the standard client
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
import { Users } from "lucide-react";
import { UserRoleManager } from "@/components/admin/UserRoleManager";
import { Toaster } from "@/components/ui/sonner";
import { User } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type UserForAdminView = {
  id: string;
  full_name: string | null;
  email: string | undefined;
  created_at: string;
  role: {
    id: string;
    name: string;
  } | null;
};

export default async function UserManagementPage() {
  // ✅ Create a special admin client JUST for this page to list users
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    data: { users: authUsers },
    error: authUsersError,
  } = await supabaseAdmin.auth.admin.listUsers();

  // Create the standard server client for user-level data fetching
  const supabase = createServerClient();

  if (authUsersError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md border border-destructive/20">
        <h3 className="font-bold">Error Fetching Users</h3>
        <p>Could not fetch user list: {authUsersError.message}</p>
      </div>
    );
  }

  const userIds = authUsers.map((u: User) => u.id);

  const [profilesRes, rolesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role_id")
      .in("id", userIds),
    supabase.from("roles").select("id, name"),
  ]);

  const profiles = profilesRes.data || [];
  const allRoles = rolesRes.data || [];

  const profilesMap = new Map(profiles.map((p) => [p.id, p]));
  const rolesMap = new Map(allRoles.map((r) => [r.id, r]));

  const formattedUsers: UserForAdminView[] = authUsers
    .map((user): UserForAdminView | null => {
      const profile = profilesMap.get(user.id);
      if (!profile) return null;

      const role = profile.role_id ? rolesMap.get(profile.role_id) : null;

      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        full_name: profile.full_name || null,
        role: role ? { id: role.id, name: role.name } : null,
      };
    })
    .filter((user): user is UserForAdminView => user !== null)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return (
    <>
      <Toaster richColors />
      <div className="w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" /> User Management
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            View, search, and manage all users on the Revuoo platform.
          </p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || (
                      <span className="italic text-muted-foreground">
                        No name provided
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role?.name === "Administrator" ? (
                      <Badge variant="destructive">{user.role.name}</Badge>
                    ) : (
                      <UserRoleManager
                        userId={user.id}
                        currentRoleId={user.role?.id || null}
                        allRoles={allRoles.filter(
                          (r) => r.name !== "Administrator"
                        )}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
