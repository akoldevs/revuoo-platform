// src/components/admin/IntegrationsManager.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Integration = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  category: string;
  is_active: boolean;
};

export async function IntegrationsManager() {
  const supabase = await createClient();
  const { data: integrations, error } = await supabase
    .from("integrations")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching integrations:", error);
    return <p className="text-red-500">Failed to load integrations.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {integrations?.map((integration: Integration) => (
        <Card key={integration.id}>
          <CardHeader>
            <div className="flex items-center gap-4">
              {integration.logo_url && (
                <Image
                  src={integration.logo_url}
                  alt={`${integration.name} logo`}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              )}
              <CardTitle>{integration.name}</CardTitle>
            </div>
            <CardDescription className="pt-2">
              {integration.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Badge variant="outline" className="capitalize">
              {integration.category}
            </Badge>
            <Badge variant={integration.is_active ? "default" : "secondary"}>
              {integration.is_active ? "Active" : "Inactive"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
