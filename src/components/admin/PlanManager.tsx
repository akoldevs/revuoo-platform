// src/components/admin/PlanManager.tsx
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
import { Badge } from "@/components/ui/badge";
import { Edit, Settings } from "lucide-react";

// The Plan type now needs to know about its linked features
type PlanWithFeatures = {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_annually: number;
  is_most_popular: boolean;
  features: { feature_id: string }[];
};

type Props = {
  plans: PlanWithFeatures[];
  onEditPlan: (plan: PlanWithFeatures) => void;
  onManageFeatures: (plan: PlanWithFeatures) => void;
};

export function PlanManager({ plans, onEditPlan, onManageFeatures }: Props) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan Name</TableHead>
            <TableHead>Pricing</TableHead>
            <TableHead>Features</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-semibold">
                {plan.name}
                {plan.is_most_popular && (
                  <Badge className="ml-2">Most Popular</Badge>
                )}
              </TableCell>
              <TableCell>
                ${plan.price_monthly}/mo or ${plan.price_annually}/yr
              </TableCell>
              <TableCell>{plan.features.length} features enabled</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageFeatures(plan)}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Manage Features
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEditPlan(plan)}
                    disabled // Editing plan details will be re-enabled later
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
  );
}
