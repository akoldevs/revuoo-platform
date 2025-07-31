// src/components/dashboard/AccessibilitySettings.tsx
"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AccessibilitySettings() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showFocusRing, setShowFocusRing] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("motion-reduce", reduceMotion);
    document.body.classList.toggle("focus-visible", showFocusRing);
  }, [reduceMotion, showFocusRing]);

  function handleToggle(type: "motion" | "focus", value: boolean) {
    if (type === "motion") setReduceMotion(value);
    if (type === "focus") setShowFocusRing(value);
    toast.success("Accessibility preferences updated.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm">Reduce animations & transitions</span>
        <Switch
          checked={reduceMotion}
          onCheckedChange={(val) => handleToggle("motion", val)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">Show focus ring on keyboard nav</span>
        <Switch
          checked={showFocusRing}
          onCheckedChange={(val) => handleToggle("focus", val)}
        />
      </div>
    </div>
  );
}
