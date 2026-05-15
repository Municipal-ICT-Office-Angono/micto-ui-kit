"use client";

/**
 * @title Table Toolbar
 * @description A beautiful reactive grid toolbar that smoothly morphs filters into bulk action trays.
 * @categories react, component
 */
import * as React from "react";
import { X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// --- Types ---

export interface ToolbarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: LucideIcon;
  children?: React.ReactNode;
  /** Automatically collapses children text labels to icon-only on mobile screens */
  collapseOnMobile?: boolean;
}

export interface TableToolbarProps {
  /** Total count of checked rows */
  selectedCount?: number;
  /** Clears all row selection checkboxes */
  onClearSelection?: () => void;
  
  /** Filters, search input, status selects, etc. */
  children?: React.ReactNode;
  /** Standard action elements shown on the right (e.g. Create Button) */
  actions?: React.ReactNode;
  
  /** Bulk operations displayed when selectedCount > 0 */
  bulkActions?: React.ReactNode;
  
  /** Visual presentation theme */
  variant?: "inline" | "floating";
  className?: string;
}

// --- Components ---

/**
 * A consistent, unified action button tailored specifically for toolbars.
 * Features automated mobile responsive text collapsing out-of-the-box.
 */
export const ToolbarAction = React.forwardRef<HTMLButtonElement, ToolbarActionProps>(
  (
    {
      className,
      variant = "outline",
      size = "sm",
      icon: Icon,
      children,
      collapseOnMobile = true,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("gap-1.5", className)}
        {...props}
      >
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
        {children && (
          <span
            className={cn(
              "leading-none",
              collapseOnMobile && "hidden sm:inline"
            )}
          >
            {children}
          </span>
        )}
      </Button>
    );
  }
);
ToolbarAction.displayName = "ToolbarAction";

/**
 * TableToolbar manages standard query states and transitions seamlessly
 * to multi-item bulk operations on checking row records.
 */
export function TableToolbar({
  selectedCount = 0,
  onClearSelection,
  children,
  actions,
  bulkActions,
  variant = "inline",
  className,
}: TableToolbarProps) {
  const isSelected = selectedCount > 0;

  // Variant A: Smooth Inline Morphing row
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "relative w-full min-h-12 h-auto overflow-hidden border rounded-md bg-background shadow-xs",
          className
        )}
      >
        {/* Layer 1: Standard Search and Filters Row */}
        <div
          className={cn(
            "relative sm:absolute inset-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-0 gap-2 sm:gap-4 transition-all duration-300 ease-in-out w-full",
            isSelected
              ? "opacity-0 sm:-translate-y-full pointer-events-none hidden sm:flex"
              : "opacity-100 sm:translate-y-0 flex"
          )}
        >
          <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-none py-0.5 w-full">
            {children}
          </div>
          {actions && (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto scrollbar-none w-full sm:w-auto pb-0.5 sm:pb-0">{actions}</div>
          )}
        </div>

        {/* Layer 2: Bulk Selection Action Trays */}
        <div
          className={cn(
            "relative sm:absolute inset-0 flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-0 gap-2 sm:gap-4 bg-muted/50 transition-all duration-300 ease-in-out border-l-2 border-primary w-full",
            isSelected
              ? "opacity-100 sm:translate-y-0 flex"
              : "opacity-0 sm:translate-y-full pointer-events-none hidden sm:flex"
          )}
        >
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onClearSelection && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={onClearSelection}
                type="button"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="secondary">
                {selectedCount}
              </Badge>
              <span className="text-xs font-medium text-foreground">selected</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto scrollbar-none w-full sm:w-auto py-0.5 min-w-0">
            {bulkActions}
          </div>
        </div>
      </div>
    );
  }

  // Variant B: Standard row with Floating Center Dock
  return (
    <>
      {/* Standard base row */}
      <div
        className={cn(
          "flex flex-col sm:flex-row w-full items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 p-1 bg-background rounded-md",
          className
        )}
      >
        <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-none py-1 w-full sm:w-auto">
          {children}
        </div>
        {actions && (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto scrollbar-none w-full sm:w-auto pb-0.5 sm:pb-0">{actions}</div>
        )}
      </div>

      {/* Floating Action Console Dock */}
      <Card
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-4 py-3 shadow-lg z-50 transition-all duration-300 ease-in-out border-none",
          isSelected
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-12 scale-95 pointer-events-none"
        )}
      >
        {/* Statistics Block */}
        <div className="flex items-center gap-2 border-r pr-4 border-border shrink-0">
          {onClearSelection && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClearSelection}
              type="button"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          )}
          <Badge variant="default">
            {selectedCount}
          </Badge>
          <span className="text-xs font-medium text-foreground">selected</span>
        </div>
        {/* Action Trays */}
        <div className="flex items-center gap-2 shrink-0">
          {bulkActions}
        </div>
      </Card>
    </>
  );
}
