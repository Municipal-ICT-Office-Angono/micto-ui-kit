/**
 * @title Metric Card
 * @description A KPI card that displays a primary value, a trend indicator, and an optional sparkline chart.
 * @categories react, component, micto
 */
"use client";

import * as React from "react";
import { Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: number;
  trendLabel?: string;
  invertTrendColors?: boolean;
  chartData?: unknown[];
  chartConfig?: ChartConfig;
  chartDataKey?: string;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      value,
      icon: Icon,
      trend,
      trendLabel,
      invertTrendColors = false,
      chartData,
      chartConfig,
      chartDataKey = "value",
      className,
      ...props
    },
    ref,
  ) => {
    // Determine trend colors
    let trendColor = "text-muted-foreground";
    let TrendIcon = null;

    if (trend !== undefined && trend !== 0) {
      const isPositive = trend > 0;
      const isGood = invertTrendColors ? !isPositive : isPositive;

      trendColor = isGood
        ? "text-emerald-500 dark:text-emerald-400"
        : "text-red-500 dark:text-red-400";
      TrendIcon = isPositive ? TrendingUp : TrendingDown;
    }

    return (
      <Card
        ref={ref}
        className={cn("overflow-hidden flex flex-col", className)}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent
          className={cn(
            "flex flex-col flex-1 justify-between gap-4",
            chartData ? "pb-0" : "",
          )}
        >
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {(trend !== undefined || trendLabel) && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                {trend !== undefined && TrendIcon && (
                  <span
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      trendColor,
                    )}
                  >
                    <TrendIcon className="h-3.5 w-3.5" />
                    {trend > 0 ? "+" : ""}
                    {trend}%
                  </span>
                )}
                {trendLabel && <span>{trendLabel}</span>}
              </div>
            )}
          </div>

          {/* Optional Sparkline Chart */}
          {chartData && chartData.length > 0 && chartConfig && (
            <div className="h-[60px] w-[calc(100%+3rem)] mt-4 -ml-6 border-t">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, left: 0, right: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`fill${title.replace(/\s+/g, "")}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={`var(--color-${chartDataKey})`}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={`var(--color-${chartDataKey})`}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel indicator="line" />}
                  />
                  <Area
                    dataKey={chartDataKey}
                    type="monotone"
                    stroke={`var(--color-${chartDataKey})`}
                    fill={`url(#fill${title.replace(/\s+/g, "")})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

MetricCard.displayName = "MetricCard";
