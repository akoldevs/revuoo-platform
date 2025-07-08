// src/components/business/BusinessCard.tsx

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  revuoo_score: number | null;
}

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={`/business/${business.slug}`}
        className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-indigo-600 hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={`View profile for ${business.name}`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">
                {business.name}
              </h3>
              {business.revuoo_score !== null && (
                <div className="flex items-center gap-1">
                  <Badge
                    variant="default"
                    className="bg-indigo-600 text-white font-medium"
                    aria-label={`Revuoo Score: ${business.revuoo_score.toFixed(1)}`}
                  >
                    {business.revuoo_score.toFixed(1)}
                  </Badge>
                  <ShieldCheck
                    className="h-4 w-4 text-indigo-600"
                    aria-label="Verified business"
                  />
                </div>
              )}
            </div>
            {business.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {business.description}
              </p>
            )}
          </div>
          <ArrowRight
            className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </Link>
    </motion.div>
  );
}
