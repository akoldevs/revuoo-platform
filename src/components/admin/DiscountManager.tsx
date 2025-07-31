// src/components/admin/DiscountManager.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormStatus } from "react-dom";
import { upsertDiscount, deleteDiscount } from "@/app/admin/actions";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, Clock, Ticket, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

// --- Type Definitions ---
type Discount = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  value: number;
  is_active: boolean;
  expires_at: string | null;
  max_redemptions: number | null;
  plan_ids: string[] | null;
  redemption_count?: number;
};
type Plan = {
  id: string;
  name: string;
};

// --- Child Components ---
function UpsertSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Discount"}
    </Button>
  );
}
function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" size="icon" disabled={pending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

type Props = {
  discounts: Discount[];
  plans: Plan[];
  isModalOpen: boolean;
  onModalOpenChange: (open: boolean) => void;
  editingDiscount: Discount | null;
  setEditingDiscount: (discount: Discount | null) => void;
};

export function DiscountManager({
  discounts,
  plans,
  isModalOpen,
  onModalOpenChange,
  editingDiscount,
  setEditingDiscount,
}: Props) {
  const handleOpenModal = (discount: Discount | null) => {
    setEditingDiscount(discount);
    onModalOpenChange(true);
  };

  const upsertAction = async (formData: FormData) => {
    const result = await upsertDiscount(formData);
    if (result.error) {
      toast.error("Failed to save discount", { description: result.error });
    } else {
      toast.success(result.message);
      onModalOpenChange(false);
    }
  };

  const deleteAction = async (formData: FormData) => {
    const result = await deleteDiscount(formData);
    if (result.error) {
      toast.error("Failed to delete discount", { description: result.error });
    } else {
      toast.success(result.message);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenModal(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Discount
        </Button>
      </div>
      <div className="border rounded-lg">
        {/* ✅ FIX: Corrected the table body to properly display discount data */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Rules & Limits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-mono text-primary">
                      {discount.code}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {discount.discount_type}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-lg font-bold">
                  {discount.discount_type === "percent"
                    ? `${discount.value}%`
                    : `$${Number(discount.value).toFixed(2)}`}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    {discount.expires_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Expires on{" "}
                          {format(parseISO(discount.expires_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                    {discount.max_redemptions !== null && (
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {discount.redemption_count || 0} /{" "}
                          {discount.max_redemptions} uses
                        </span>
                      </div>
                    )}
                    {discount.plan_ids && discount.plan_ids.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Applies to {discount.plan_ids.length} plan(s)
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={discount.is_active ? "default" : "secondary"}
                    className={
                      discount.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : ""
                    }
                  >
                    {discount.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenModal(discount)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={discount.id} />
                      <DeleteSubmitButton />
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={onModalOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDiscount ? "Edit Discount Code" : "Add New Discount Code"}
            </DialogTitle>
            <DialogDescription>
              Create and manage promotional codes with advanced rules.
            </DialogDescription>
          </DialogHeader>
          <form action={upsertAction}>
            {editingDiscount && (
              <input type="hidden" name="id" value={editingDiscount.id} />
            )}
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Discount Code</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g., SUMMER20"
                    defaultValue={editingDiscount?.code || ""}
                    className="uppercase"
                    required
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <Label htmlFor="discount_type">Type</Label>
                    <Select
                      name="discount_type"
                      defaultValue={editingDiscount?.discount_type || "percent"}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      step="0.01"
                      placeholder="20"
                      defaultValue={editingDiscount?.value || ""}
                      required
                    />
                  </div>
                </div>
              </div>
              <hr />
              <h3 className="font-semibold text-lg">
                Advanced Rules (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="expires_at">Expiry Date</Label>
                  <Input
                    id="expires_at"
                    name="expires_at"
                    type="date"
                    defaultValue={
                      editingDiscount?.expires_at
                        ? format(
                            parseISO(editingDiscount.expires_at),
                            "yyyy-MM-dd"
                          )
                        : ""
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank for no expiry.
                  </p>
                </div>
                <div>
                  <Label htmlFor="max_redemptions">Maximum Redemptions</Label>
                  <Input
                    id="max_redemptions"
                    name="max_redemptions"
                    type="number"
                    placeholder="e.g., 100"
                    defaultValue={editingDiscount?.max_redemptions || ""}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank for unlimited uses.
                  </p>
                </div>
              </div>
              <div>
                <Label>Applicable Plans</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  If no plans are selected, the code will apply to all plans.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`plan-${plan.id}`}
                        name="plan_ids"
                        value={plan.id}
                        defaultChecked={editingDiscount?.plan_ids?.includes(
                          plan.id
                        )}
                      />
                      <Label htmlFor={`plan-${plan.id}`}>{plan.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <hr />
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active" className="text-base">
                    Status
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Inactive codes cannot be redeemed by customers.
                  </p>
                </div>
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={editingDiscount?.is_active ?? true}
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
    </div>
  );
}
