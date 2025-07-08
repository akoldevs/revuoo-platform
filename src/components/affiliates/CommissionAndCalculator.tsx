"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EarningsChart from "./EarningsChart"; // 👈 Import the chart component

const plans = {
  Starter: 19,
  Pro: 49,
  Enterprise: 99,
};

const COMMISSION_RATE = 0.3;

export default function CommissionAndCalculator() {
  const [referrals, setReferrals] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof plans>("Pro");

  const planPrice = plans[selectedPlan];
  const monthlyEarnings = (referrals * planPrice * COMMISSION_RATE).toFixed(2);

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
          {/* Column 1: Commission Details */}
          <div>
            <p className="text-base font-semibold text-indigo-600">
              Commission & Calculator
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Fair, Transparent & Recurring
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our partnership model is simple. We succeed when you succeed.
              There are no complex terms—just a straightforward, competitive
              commission on every paying customer you send our way.
            </p>
            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 text-base leading-7 text-gray-600">
              <div className="flex flex-col gap-y-1">
                <dt className="font-semibold text-gray-900">
                  30% Recurring Commission
                </dt>
                <dd>Earn for the lifetime of the customer.</dd>
              </div>
              <div className="flex flex-col gap-y-1">
                <dt className="font-semibold text-gray-900">
                  90-Day Cookie Window
                </dt>
                <dd>Get credit for referrals up to 3 months later.</dd>
              </div>
              <div className="flex flex-col gap-y-1">
                <dt className="font-semibold text-gray-900">
                  $50 Payout Threshold
                </dt>
                <dd>Get paid as soon as you earn.</dd>
              </div>
              <div className="flex flex-col gap-y-1">
                <dt className="font-semibold text-gray-900">Monthly Payouts</dt>
                <dd>Reliable payments via PayPal or bank transfer.</dd>
              </div>
            </dl>
          </div>

          {/* Column 2: Earnings Calculator */}
          <div className="rounded-lg bg-white p-8 shadow-xl transition duration-500 ease-in-out transform hover:scale-[1.01] animate-fade-in">
            <h3 className="text-2xl font-semibold text-gray-900">
              Estimate Your Earnings
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Choose a plan and slide to see your potential monthly recurring
              revenue.
            </p>

            {/* Plan Toggle */}
            <div className="mt-6 flex gap-2">
              {Object.keys(plans).map((plan) => (
                <Button
                  key={plan}
                  variant={selectedPlan === plan ? "default" : "outline"}
                  onClick={() => setSelectedPlan(plan as keyof typeof plans)}
                >
                  {plan}
                </Button>
              ))}
            </div>

            {/* Referral Slider */}
            <div className="mt-8">
              <Label htmlFor="referrals" className="text-lg font-medium">
                Monthly Referrals:{" "}
                <span className="text-indigo-600 font-bold">{referrals}</span>
              </Label>
              <Input
                id="referrals"
                type="range"
                min="1"
                max="100"
                value={referrals}
                onChange={(e) => setReferrals(Number(e.target.value))}
                aria-valuemin={1}
                aria-valuemax={100}
                aria-valuenow={referrals}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
            </div>

            {/* Earnings Display */}
            <div className="mt-8 text-center bg-indigo-50 p-6 rounded-lg">
              <p className="text-gray-600">Your Potential Monthly Earnings:</p>
              <p className="text-5xl font-extrabold text-indigo-600 mt-2">
                ${monthlyEarnings}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Based on the {selectedPlan} Plan (${planPrice}/mo)
              </p>
            </div>

            {/* 📈 Earnings Chart */}
            <EarningsChart referrals={referrals} planPrice={planPrice} />
          </div>
        </div>
      </div>
    </div>
  );
}
