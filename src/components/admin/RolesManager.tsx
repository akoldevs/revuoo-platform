// src/components/admin/RolesManager.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormStatus } from "react-dom";
import { upsertRole, updateRolePermissions } from "@/app/admin/actions";
import { toast } from "sonner";
import { PlusCircle, Edit, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

type Permission = {
  id: string;
  name: string;
  description: string | null;
};

type Role = {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
};

function UpsertSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Role"}
    </Button>
  );
}

function PermissionsSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Updating Permissions..." : "Update Permissions"}
    </Button>
  );
}

type RolesManagerProps = {
  roles: Role[];
  allPermissions: Permission[];
  isRoleModalOpen: boolean;
  onRoleModalOpenChange: (open: boolean) => void;
  isPermissionsModalOpen: boolean;
  onPermissionsModalOpenChange: (open: boolean) => void;
  editingRole: Role | null;
  setEditingRole: (role: Role | null) => void;
};

export function RolesManager({
  roles,
  allPermissions,
  isRoleModalOpen,
  onRoleModalOpenChange,
  isPermissionsModalOpen,
  onPermissionsModalOpenChange,
  editingRole,
  setEditingRole,
}: RolesManagerProps) {
  const groupedPermissions = useMemo(() => {
    return allPermissions.reduce(
      (acc, permission) => {
        const groupName = permission.name.split(".")[0] || "general";
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [allPermissions]);

  const handleOpenPermissionsModal = (role: Role) => {
    setEditingRole(role);
    onPermissionsModalOpenChange(true);
  };

  const handleOpenRoleModal = (role: Role | null) => {
    setEditingRole(role);
    onRoleModalOpenChange(true);
  };

  const upsertRoleAction = async (formData: FormData) => {
    const result = await upsertRole(formData);
    if (result.error) {
      toast.error("Failed to save role", { description: result.error });
    } else {
      toast.success(result.message);
      onRoleModalOpenChange(false);
    }
  };

  const updatePermissionsAction = async (formData: FormData) => {
    const result = await updateRolePermissions(formData);
    if (result.error) {
      toast.error("Failed to update permissions", {
        description: result.error,
      });
    } else {
      toast.success(result.message);
      onPermissionsModalOpenChange(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenRoleModal(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Role
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-semibold">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <span className="font-medium">
                    {role.permissions.length} permissions
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPermissionsModal(role)}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Manage Permissions
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenRoleModal(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Role Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={onRoleModalOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Edit Role" : "Add New Role"}
            </DialogTitle>
            <DialogDescription>
              Define a role for your team members.
            </DialogDescription>
          </DialogHeader>
          <form action={upsertRoleAction}>
            {editingRole && (
              <input type="hidden" name="id" value={editingRole.id} />
            )}
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Content Moderator"
                  defaultValue={editingRole?.name || ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Briefly describe what this role does."
                  defaultValue={editingRole?.description || ""}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <UpsertSubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Modal */}
      <Dialog
        open={isPermissionsModalOpen}
        onOpenChange={onPermissionsModalOpenChange}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              Assign permissions to the{" "}
              <span className="font-bold text-primary">
                {editingRole?.name}
              </span>{" "}
              role.
            </DialogDescription>
          </DialogHeader>
          <form action={updatePermissionsAction}>
            <input type="hidden" name="role_id" value={editingRole?.id || ""} />
            <div className="py-4 max-h-[60vh] overflow-y-auto space-y-6 pr-4">
              {Object.entries(groupedPermissions).map(
                ([groupName, permissions]) => (
                  <div key={groupName}>
                    <h4 className="font-semibold text-lg capitalize mb-3 pb-2 border-b">
                      {groupName.replace("_", " ")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`perm-${permission.id}`}
                            name="permission_ids"
                            value={permission.id}
                            defaultChecked={editingRole?.permissions.some(
                              (p) => p.id === permission.id
                            )}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={`perm-${permission.id}`}
                              className="font-medium"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <PermissionsSubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
