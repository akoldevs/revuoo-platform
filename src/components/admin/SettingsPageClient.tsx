// src/components/admin/SettingsPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RolesManager } from "@/components/admin/RolesManager";
import { Toaster } from "@/components/ui/sonner";
import { Shield, Tag, Crown, Percent } from "lucide-react";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { PlanManager } from "@/components/admin/PlanManager";
import { DiscountManager } from "@/components/admin/DiscountManager";
import { ManagePlanFeaturesModal } from "./ManagePlanFeaturesModal";

// --- Type Definitions ---
type Feature = { id: string; name: string; description: string | null };
type PlanWithFeatures = {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_annually: number;
  is_most_popular: boolean;
  features: { feature_id: string }[];
};
type Permission = { id: string; name: string; description: string | null };
type Role = {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
};
type Category = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  icon_svg: string | null;
};
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

type Props = {
  roles: Role[];
  allPermissions: Permission[];
  categories: Category[];
  plans: PlanWithFeatures[];
  discounts: Discount[];
  allFeatures: Feature[];
};

export function SettingsPageClient({
  roles,
  allPermissions,
  categories,
  plans,
  discounts,
  allFeatures,
}: Props) {
  const { activeModal, closeModal } = useModal();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const [editingPlan, setEditingPlan] = useState<PlanWithFeatures | null>(null);
  const [isPlanFeaturesModalOpen, setIsPlanFeaturesModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("categories");

  useEffect(() => {
    if (activeModal === "addRole") {
      setActiveTab("roles_permissions");
      setEditingRole(null);
      setIsRoleModalOpen(true);
      closeModal();
    }
    if (activeModal === "addDiscount") {
      setActiveTab("discounts");
      setEditingDiscount(null);
      setIsDiscountModalOpen(true);
      closeModal();
    }
  }, [activeModal, closeModal]);

  const handleManageFeatures = (plan: PlanWithFeatures) => {
    setEditingPlan(plan);
    setIsPlanFeaturesModalOpen(true);
  };

  return (
    <>
      <Toaster richColors />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="roles_permissions">
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        {/* ✅ All TabsContent sections are now correctly implemented */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" /> Category Management
              </CardTitle>
              <CardDescription>
                Add, edit, or delete the business categories used across Revuoo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManager categories={categories || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" /> Plan Management
              </CardTitle>
              <CardDescription>
                View and manage your SaaS subscription plans and their features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanManager
                plans={plans || []}
                onEditPlan={() => {}} // Placeholder for now
                onManageFeatures={handleManageFeatures}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" /> Discount Code Management
              </CardTitle>
              <CardDescription>
                Create and manage promotional codes for marketing campaigns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiscountManager
                discounts={discounts || []}
                plans={plans || []}
                isModalOpen={isDiscountModalOpen}
                onModalOpenChange={setIsDiscountModalOpen}
                editingDiscount={editingDiscount}
                setEditingDiscount={setEditingDiscount}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles_permissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Roles & Permissions
              </CardTitle>
              <CardDescription>
                Define user roles and assign specific permissions to control
                access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RolesManager
                roles={roles || []}
                allPermissions={allPermissions || []}
                isRoleModalOpen={isRoleModalOpen}
                onRoleModalOpenChange={setIsRoleModalOpen}
                isPermissionsModalOpen={isPermissionsModalOpen}
                onPermissionsModalOpenChange={setIsPermissionsModalOpen}
                editingRole={editingRole}
                setEditingRole={setEditingRole}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ManagePlanFeaturesModal
        isOpen={isPlanFeaturesModalOpen}
        onOpenChange={setIsPlanFeaturesModalOpen}
        plan={editingPlan}
        allFeatures={allFeatures}
      />
    </>
  );
}
