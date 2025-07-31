"use client";

import { useState, ComponentType } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { upsertCategory, deleteCategory } from "@/app/admin/actions";
import { toast } from "sonner";
import {
  PlusCircle,
  Edit,
  Trash2,
  HelpCircle,
  Wrench,
  Truck,
  HeartPulse,
  Car,
  Sparkles,
  Users,
  Trees,
  Nut,
  ClipboardCheck,
  Megaphone,
  Calculator,
} from "lucide-react";

// Define the type for a category object
type Category = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  icon_svg: string | null; // ✅ ADDED: Include the icon field
};

// ✅ NEW: Create a map of available icons for the picker
const iconMap: { [key: string]: ComponentType<{ className: string }> } = {
  Wrench,
  Truck,
  HeartPulse,
  Car,
  Sparkles,
  Users,
  Trees,
  Nut,
  ClipboardCheck,
  Megaphone,
  Calculator,
  HelpCircle,
};
const iconNames = Object.keys(iconMap);

// A submit button that shows a pending state for the upsert form
function UpsertSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Category"}
    </Button>
  );
}

// A submit button that shows a pending state for the delete form
function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" size="icon" disabled={pending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenModal = (category: Category | null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const upsertAction = async (formData: FormData) => {
    const result = await upsertCategory(formData);
    if (result.error) {
      toast.error("Failed to save category", { description: result.error });
    } else {
      toast.success(result.message);
      handleCloseModal();
    }
  };

  const deleteAction = async (formData: FormData) => {
    const result = await deleteCategory(formData);
    if (result.error) {
      toast.error("Failed to delete category", { description: result.error });
    } else {
      toast.success(result.message);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenModal(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => {
              const IconComponent = cat.icon_svg
                ? iconMap[cat.icon_svg] || HelpCircle
                : HelpCircle;
              return (
                <TableRow key={cat.id}>
                  <TableCell>
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenModal(cat)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={cat.id} />
                        <DeleteSubmitButton />
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* The Add/Edit Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the details for this category."
                : "Create a new category for your platform."}
            </DialogDescription>
          </DialogHeader>
          <form action={upsertAction}>
            {editingCategory && (
              <input type="hidden" name="id" value={editingCategory.id} />
            )}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  className="col-span-3"
                  required
                />
              </div>
              {/* ✅ NEW: Icon Picker Dropdown */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon_svg" className="text-right">
                  Icon
                </Label>
                <Select
                  name="icon_svg"
                  defaultValue={editingCategory?.icon_svg || undefined}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconNames.map((iconName) => {
                      const Icon = iconMap[iconName];
                      return (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{iconName}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingCategory?.description || ""}
                  className="col-span-3"
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
