"use client";

import * as React from "react";
import { DollarSign, Users, Activity, ShieldAlert } from "lucide-react";
import { MetricCard } from "@/components/micto/metric-card";
import { ChartConfig } from "@/components/ui/chart";

// Mock data for sparklines
const revenueData = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 3500 },
  { month: "Mar", revenue: 3000 },
  { month: "Apr", revenue: 4800 },
  { month: "May", revenue: 4200 },
  { month: "Jun", revenue: 5500 },
  { month: "Jul", revenue: 6800 },
];

const bounceData = [
  { day: "Mon", rate: 52 },
  { day: "Tue", rate: 49 },
  { day: "Wed", rate: 47 },
  { day: "Thu", rate: 48 },
  { day: "Fri", rate: 45 },
  { day: "Sat", rate: 43 },
  { day: "Sun", rate: 42 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const bounceChartConfig = {
  rate: {
    label: "Bounce Rate",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MetricCardDemo() {
  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Standard Metric with Sparkline */}
        <MetricCard
          title="Total Revenue"
          value="$45,231.89"
          icon={DollarSign}
          trend={20.1}
          trendLabel="from last month"
          chartData={revenueData}
          chartConfig={revenueChartConfig}
          chartDataKey="revenue"
        />

        {/* 2. Simple Metric with Trend only (no chart) */}
        <MetricCard
          title="Active Users"
          value="+12,482"
          icon={Users}
          trend={10.5}
          trendLabel="from last week"
        />

        {/* 3. Inverted Trend Metric with Sparkline (Bounce Rate - lower is better) */}
        <MetricCard
          title="Bounce Rate"
          value="42.3%"
          icon={Activity}
          trend={-8.2}
          trendLabel="vs yesterday"
          invertTrendColors={true} // -8.2% will render in green (good)
          chartData={bounceData}
          chartConfig={bounceChartConfig}
          chartDataKey="rate"
        />

        {/* 4. Negative Trend Metric (Active Server Errors - higher is worse) */}
        <MetricCard
          title="Server Alerts"
          value="14"
          icon={ShieldAlert}
          trend={150}
          trendLabel="over last 24h"
          invertTrendColors={false} // +150% will render in red (bad)
        />
      </div>
    </div>
  );
}
