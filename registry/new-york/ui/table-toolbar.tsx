"use client";

import * as React from "react";
import { X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        className={cn(
          "h-8 text-xs font-medium rounded-lg gap-1.5 px-3 select-none transition-all duration-200 active:scale-95",
          className
        )}
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
          "relative w-full h-12 overflow-hidden border rounded-xl bg-background shadow-xs",
          className
        )}
      >
        {/* Layer 1: Standard Search and Filters Row */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-between px-4 gap-4 transition-all duration-300 ease-in-out",
            isSelected
              ? "opacity-0 -translate-y-full pointer-events-none"
              : "opacity-100 translate-y-0"
          )}
        >
          <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {children}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>

        {/* Layer 2: Bulk Selection Action Trays */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-between px-4 gap-4 bg-muted/20 transition-all duration-300 ease-in-out border-l-2 border-primary",
            isSelected
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-full pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3 shrink-0">
            {onClearSelection && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-muted/60"
                onClick={onClearSelection}
                type="button"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            <div className="flex items-center gap-2 leading-none">
              <Badge variant="secondary" className="rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                {selectedCount}
              </Badge>
              <span className="text-xs font-semibold text-foreground">selected</span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
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
          "flex w-full items-center justify-between gap-4 p-1 bg-background rounded-lg",
          className
        )}
      >
        <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {children}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>

      {/* Floating Action Console Dock */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-4 py-3 rounded-full border border-primary/20 bg-card/85 backdrop-blur-md shadow-2xl z-50 transition-all duration-500 ease-in-out",
          isSelected
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-12 scale-95 pointer-events-none"
        )}
      >
        {/* Statistics Block */}
        <div className="flex items-center gap-2 leading-none border-r pr-4 border-border/80 shrink-0">
          {onClearSelection && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-muted/60 p-0 mr-1"
              onClick={onClearSelection}
              type="button"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          )}
          <Badge className="bg-primary text-primary-foreground hover:bg-primary rounded-md px-1.5 py-0.5 text-[10px] font-bold">
            {selectedCount}
          </Badge>
          <span className="text-xs font-bold text-foreground">selected</span>
        </div>

        {/* Action Trays */}
        <div className="flex items-center gap-2 shrink-0">
          {bulkActions}
        </div>
      </div>
    </>
  );
}
