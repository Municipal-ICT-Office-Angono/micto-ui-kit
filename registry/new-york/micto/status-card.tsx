"use client";

/**
 * @title Status Card
 * @description A professional LGU component.
 * @categories react
*/
import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export const StatusCard = React.forwardRef<
  HTMLDivElement,
  StatusCardProps
>(({ className, title, description, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}
    {...props}
  >
    <div className="space-y-1.5">
      {title && (
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
))
StatusCard.displayName = "StatusCard"
