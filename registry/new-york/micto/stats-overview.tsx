"use client";

/**
 * @title Stats Overview
 * @description A beautiful status card for your dashboard
 * @categories react
*/
import * as React from "react"
import { cn } from "@/lib/utils"

export const StatsOverview = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}
    {...props}
  />
))
StatsOverview.displayName = "StatsOverview"


