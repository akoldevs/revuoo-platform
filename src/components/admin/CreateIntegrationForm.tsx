// src/components/admin/CreateIntegrationForm.tsx
"use client";

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
import { createIntegration } from "@/app/admin/actions"; // We will create this action
import { Switch } from "@/components/ui/switch";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? "Creating..." : "Create Integration"}
    </Button>
  );
}

export function CreateIntegrationForm() {
  const router = useRouter();

  const createIntegrationAction = async (formData: FormData) => {
    const result = await createIntegration(formData);
    if (result.error) {
      toast.error("Failed to create integration", {
        description: result.error,
      });
    } else {
      toast.success(result.message);
      router.push(`/admin/integrations`);
    }
  };

  return (
    <form action={createIntegrationAction}>
      <Card>
        <CardHeader>
          <CardTitle>Integration Details</CardTitle>
          <CardDescription>
            This information will be displayed in the integrations directory.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Integration Name</Label>
            <Input id="name" name="name" required placeholder="e.g., Shopify" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              required
              placeholder="A brief description of what this integration does."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              name="logo_url"
              placeholder="https://.../logo.png"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e-commerce">E-commerce</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="is_active" name="is_active" defaultChecked={true} />
                <Label htmlFor="is_active">
                  Active (available for businesses)
                </Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
