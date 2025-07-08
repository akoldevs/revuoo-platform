"use client";

import { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface EarningsChartProps {
  referrals: number;
  planPrice: number;
  months?: number;
  commissionRate?: number;
}

export default function EarningsChart({
  referrals,
  planPrice,
  months = 12,
  commissionRate = 0.3,
}: EarningsChartProps) {
  const chartRef = useRef<any>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "cumulative">(
    "cumulative"
  );
  const [churnRate, setChurnRate] = useState(10); // % per month

  const monthlyEarning = referrals * planPrice * commissionRate;

  const labels = Array.from({ length: months }, (_, i) => `Month ${i + 1}`);

  // Earnings without churn
  const baseData = labels.map((_, i) =>
    viewMode === "monthly" ? monthlyEarning : monthlyEarning * (i + 1)
  );

  // Earnings with churn
  let activeUsers = referrals;
  const churnedData: number[] = [];

  for (let i = 0; i < months; i++) {
    const earnings = activeUsers * planPrice * commissionRate;

    if (viewMode === "monthly") {
      churnedData.push(earnings);
    } else {
      const previous = i > 0 ? churnedData[i - 1] : 0;
      churnedData.push(earnings + previous);
    }

    activeUsers *= 1 - churnRate / 100;
  }

  const handleDownload = () => {
    const chart = chartRef.current;
    if (chart) {
      const url = chart.toBase64Image();
      const link = document.createElement("a");
      link.href = url;
      link.download = "revuoo-earnings-chart.png";
      link.click();
    }
  };

  const handleShare = () => {
    const message = `Check out my Revuoo earnings projection! 💸\n\n$${monthlyEarning}/mo from ${referrals} referrals on the $${planPrice}/mo plan.\n\nTry it yourself: https://revuoo.com/affiliates`;
    navigator.clipboard.writeText(message);
    alert("Projection copied to clipboard! 📋");
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Projected Earnings Over Time
        </h4>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "cumulative" ? "default" : "outline"}
            onClick={() => setViewMode("cumulative")}
          >
            Cumulative
          </Button>
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            onClick={() => setViewMode("monthly")}
          >
            Monthly
          </Button>
        </div>
      </div>

      {/* Churn Slider */}
      <div className="mb-6">
        <Label htmlFor="churn" className="text-sm font-medium text-gray-700">
          Monthly Churn Rate:{" "}
          <span className="text-indigo-600 font-bold">{churnRate}%</span>
        </Label>
        <Input
          id="churn"
          type="range"
          min="0"
          max="50"
          step="1"
          value={churnRate}
          onChange={(e) => setChurnRate(Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      <Line
        ref={chartRef}
        data={{
          labels,
          datasets: [
            {
              label: "With Churn",
              data: churnedData,
              borderColor: "#4f46e5",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              tension: 0.3,
              fill: true,
            },
            {
              label: "Without Churn",
              data: baseData,
              borderColor: "#a5b4fc",
              borderDash: [5, 5],
              tension: 0.3,
              fill: false,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `$${value}`,
              },
            },
          },
        }}
      />

      <div className="mt-6 flex gap-4">
        <Button onClick={handleDownload}>📥 Download Chart</Button>
        <Button variant="outline" onClick={handleShare}>
          📤 Share My Projection
        </Button>
      </div>
    </div>
  );
}
