// src/components/widgets/WidgetShowcase.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// --- WIDGET PREVIEW COMPONENTS ---
const ScoreCard = ({ color }: { color: string }) => (
  <div
    className="w-full max-w-xs rounded-xl p-6 shadow-lg border text-left"
    style={{ backgroundColor: color }}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">Revuoo Score</p>
      <Badge className="bg-indigo-600 text-white text-lg">9.2</Badge>
    </div>
    <div className="mt-4">
      <h3 className="text-xl font-bold text-gray-900">Berlin Pro Cleaners</h3>
      <div className="mt-1 flex items-center gap-1" title="5 out of 5 stars">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Based on 128 verified reviews.
      </p>
    </div>
    <p className="mt-4 text-xs text-center text-gray-400">
      Powered by <span className="font-bold text-gray-500">Revuoo</span>
    </p>
  </div>
);
const TestimonialBlock = ({ color }: { color: string }) => (
  <div
    className="w-full max-w-md rounded-xl p-8 shadow-lg border text-left"
    style={{ backgroundColor: color }}
  >
    <Quote className="h-8 w-8 text-gray-400 mb-4" />
    <p className="text-xl italic text-gray-800">
      “Revuoo helped us triple our leads in 3 months. The trust factor is real.”
    </p>
    <div className="mt-4 text-base text-gray-600 font-semibold">
      — Fatima A., Founder of Glow Spa
    </div>
  </div>
);
// ... other widget components like CarouselWidget etc. can be defined here ...

// --- WIDGET DATA & CONFIGURATION (Our Single Source of Truth) ---
const widgetOptions = [
  { label: "Score Card", value: "score", plan: "free", component: ScoreCard },
  {
    label: "Testimonial Block",
    value: "testimonial",
    plan: "pro",
    component: TestimonialBlock,
  },
  // Add other widgets here...
  // { label: "Review Carousel", value: "carousel", plan: "advanced", component: CarouselWidget },
];

// --- MAIN COMPONENT ---
export default function WidgetShowcase() {
  const [color, setColor] = useState("#ffffff");
  const [widgetType, setWidgetType] = useState("score");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [previewAll, setPreviewAll] = useState(false);

  // In a real app, this would come from the logged-in user's data
  const userPlan: "free" | "pro" | "advanced" | "enterprise" = "free";
  const planRank = { free: 0, pro: 1, advanced: 2, enterprise: 3 };
  const userRank = planRank[userPlan];

  const selectedWidget = widgetOptions.find((w) => w.value === widgetType)!;

  // A more realistic embed code
  const embedCode = `<div id="revuoo-widget-container" data-revuoo-widget="${widgetType}" data-color="${color}"></div>\n<script async src="https://cdn.revuoo.com/widgets.js"></script>`;

  const handleWidgetChange = (value: string) => {
    const selected = widgetOptions.find((w) => w.value === value)!;
    const requiredRank = planRank[selected.plan as keyof typeof planRank];

    if (requiredRank > userRank) {
      setShowUpgradeModal(true);
    } else {
      setWidgetType(value);
    }
  };

  const handleCopy = () => navigator.clipboard.writeText(embedCode);

  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Bring Your Revuoo Score & Reviews to Life
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Customize our widgets to match your brand and embed them on your
            website in seconds. No coding required.
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Builder Panel */}
          <div className="lg:col-span-1 space-y-8">
            <h3 className="text-2xl font-semibold text-gray-900">
              Live Widget Builder
            </h3>
            {/* Replace the old "Widget Type Selector" block with this one */}
            {/* Widget Type Selector */}
            <div>
              <label className="text-base font-medium text-gray-900">
                Widget Type
              </label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {widgetOptions.map((option) => {
                  const isLocked =
                    planRank[option.plan as keyof typeof planRank] > userRank;
                  const isSelected = widgetType === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleWidgetChange(option.value)}
                      className={`relative rounded-lg border p-4 text-left transition hover:shadow-sm ${
                        isSelected
                          ? "border-indigo-600 ring-2 ring-indigo-500"
                          : "border-gray-300"
                      } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                      disabled={isLocked && !isSelected} // Prevent clicking locked options
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {option.label}
                        </span>
                        {isLocked && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            {option.plan.charAt(0).toUpperCase() +
                              option.plan.slice(1)}{" "}
                            🔒
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {option.value === "score" &&
                          "Compact badge with score and stars"}
                        {option.value === "testimonial" &&
                          "Highlight a glowing customer review"}
                        {option.value === "carousel" &&
                          "Rotating reviews for homepages"}
                        {option.value === "floating" &&
                          "Sticky badge that follows scroll"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Appearance Controls */}
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <input
                id="bg-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 p-1 border border-gray-300 rounded-md"
              />
            </div>
            {/* Embed Code */}
            <div className="space-y-2">
              <Label htmlFor="embed-code">Embed Code</Label>
              <Textarea
                id="embed-code"
                readOnly
                value={embedCode}
                className="mt-2 p-4 bg-gray-800 text-white rounded-lg font-mono text-xs overflow-x-auto h-32"
              />
              <Button className="w-full" onClick={handleCopy}>
                Copy Code
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-2">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => setPreviewAll(!previewAll)}
                className="text-sm"
              >
                {previewAll ? "Show Selected Only" : "Preview All Widgets"}
              </Button>
            </div>

            <div className="rounded-lg bg-gray-200 p-8 min-h-[400px]">
              {previewAll ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {widgetOptions.map((option) => {
                    const WidgetComponent = option.component;
                    const isLocked =
                      planRank[option.plan as keyof typeof planRank] > userRank;

                    return (
                      <div
                        key={option.value}
                        className={`relative rounded-lg p-4 bg-white shadow transition duration-500 ease-in-out transform hover:scale-[1.02] ${
                          isLocked
                            ? "opacity-50 blur-sm pointer-events-none"
                            : ""
                        }`}
                      >
                        <WidgetComponent color={color} />
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-gray-700 font-semibold text-sm rounded-lg">
                            {option.label} (Upgrade to {option.plan})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="transition-opacity duration-500 ease-in-out opacity-100">
                  <selectedWidget.component color={color} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Required to Access This Widget</DialogTitle>
            <DialogDescription className="pt-2">
              This powerful widget is included in our premium plans. Upgrade
              your subscription to unlock this and many other advanced features!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
            >
              Maybe Later
            </Button>
            <Button asChild>
              <Link href="/for-businesses/plans-pricing">
                View Plans & Upgrade
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
