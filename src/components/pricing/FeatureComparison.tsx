// src/components/pricing/FeatureComparison.tsx

import { Check, Minus, HelpCircle } from "lucide-react";
import { plans, features } from "@/lib/pricing-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

export default function FeatureComparison() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Compare All Features
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find the perfect set of features to match your business goals.
          </p>
        </div>

        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-max text-left text-sm border-t border-gray-200">
            <thead className="text-gray-900 sticky top-0 bg-white z-10">
              <tr>
                <th scope="col" className="px-8 py-4 font-semibold">
                  Features
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className="w-1/5 px-6 py-4 font-semibold text-center"
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((category) => (
                <React.Fragment key={category.category}>
                  <tr>
                    <th
                      colSpan={plans.length + 1}
                      scope="colgroup"
                      className="bg-gray-50 px-8 py-3 text-sm font-semibold text-gray-900"
                    >
                      {category.category}
                    </th>
                  </tr>
                  {category.items.map((item) => (
                    <tr key={item.name} className="border-b border-gray-200">
                      <th
                        scope="row"
                        className="px-8 py-5 font-normal text-gray-900"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 text-left hover:text-indigo-600 transition-colors">
                              {item.name}
                              {item.tooltip && (
                                <HelpCircle
                                  className="h-4 w-4 text-gray-400"
                                  aria-label="More info"
                                />
                              )}
                            </TooltipTrigger>
                            {item.tooltip && (
                              <TooltipContent>
                                <p className="max-w-xs break-words">
                                  {item.tooltip}
                                </p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </th>
                      {plans.map((plan) => {
                        const tierValue =
                          item.tiers[plan.name as keyof typeof item.tiers];
                        return (
                          <td
                            key={plan.name}
                            className="px-6 py-5 text-center"
                            aria-label={`${item.name} for ${plan.name}`}
                          >
                            {typeof tierValue === "boolean" ? (
                              tierValue ? (
                                <Check
                                  className="mx-auto h-5 w-5 text-indigo-600"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Minus
                                  className="mx-auto h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              )
                            ) : (
                              <span className="text-gray-900">{tierValue}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
