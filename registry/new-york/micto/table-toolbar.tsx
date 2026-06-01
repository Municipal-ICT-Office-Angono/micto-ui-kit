"use client";

/**
 * @title Table Toolbar
 * @description A beautiful reactive grid toolbar that smoothly morphs filters into bulk action trays.
 * @categories react, component
 */
import { X, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// --- Types ---

export interface ToolbarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
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

  /** Filters, search input, etc. (fallback/legacy) */
  children?: React.ReactNode;
  /** Standard search input node, displayed on the left */
  search?: React.ReactNode;
  /** Content of filters, displayed inside a popover */
  filters?: React.ReactNode;
  /** Number of active filters */
  activeFiltersCount?: number;

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
export const ToolbarAction = React.forwardRef<
  HTMLButtonElement,
  ToolbarActionProps
>(
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
    ref,
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
              collapseOnMobile && "hidden sm:inline",
            )}
          >
            {children}
          </span>
        )}
      </Button>
    );
  },
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
  search,
  filters,
  activeFiltersCount = 0,
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
          "relative h-auto w-full rounded-md border bg-background shadow-xs",
          className,
        )}
      >
        {/* Layer 1: Standard Search and Filters Row */}
        <div
          className={cn(
            "flex w-full flex-wrap items-center justify-between gap-3 px-2 py-2.5 transition-all duration-300 ease-in-out sm:px-2 sm:py-2",
            isSelected
              ? "pointer-events-none absolute inset-0 -translate-y-full overflow-hidden opacity-0"
              : "relative translate-y-0 opacity-100",
          )}
        >
          <div className="flex w-full min-w-[240px] flex-wrap items-center gap-2 sm:w-auto sm:flex-1">
            {search && search}
            {filters && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-sm px-1 font-normal"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="flex w-[300px] flex-col gap-4 p-4"
                >
                  <div className="space-y-1.5">
                    <h4 className="text-sm leading-none font-medium">
                      Filters
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Filter list by the following attributes.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 [&_button]:w-full! [&_input]:w-full! **:data-[slot=select-trigger]:w-full! [&>div]:w-full! [&>div]:flex-col! [&>div]:items-stretch! [&>div]:gap-3! [&>div>div]:w-full!">
                    {filters}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {!search && !filters && children}
          </div>
          {actions && (
            <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-1.5 sm:ml-auto sm:w-auto sm:gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* Layer 2: Bulk Selection Action Trays */}
        <div
          className={cn(
            "flex w-full flex-wrap items-center justify-between gap-3 border-l-2 border-primary bg-muted/50 px-3 py-2.5 transition-all duration-300 ease-in-out sm:px-4 sm:py-2",
            isSelected
              ? "relative translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 translate-y-full overflow-hidden opacity-0",
          )}
        >
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
            <div className="flex shrink-0 items-center gap-1.5">
              <Badge variant="secondary">{selectedCount}</Badge>
              <span className="text-xs font-medium text-foreground">
                selected
              </span>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-end gap-1.5 sm:ml-auto sm:w-auto sm:gap-2">
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
          "flex w-full flex-col items-stretch justify-between gap-2.5 rounded-md bg-background p-1 sm:flex-row sm:items-center sm:gap-4",
          className,
        )}
      >
        <div className="flex w-full flex-1 scrollbar-none items-center gap-2 overflow-x-auto py-1 sm:w-auto">
          {search && search}
          {filters && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 rounded-sm px-1 font-normal"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex w-[300px] flex-col gap-4 p-4"
              >
                <div className="space-y-1.5">
                  <h4 className="text-sm leading-none font-medium">Filters</h4>
                  <p className="text-xs text-muted-foreground">
                    Filter list by the following attributes.
                  </p>
                </div>
                <div className="flex flex-col gap-3 [&_button]:w-full! [&_input]:w-full! **:data-[slot=select-trigger]:w-full! [&>div]:w-full! [&>div]:flex-col! [&>div]:items-stretch! [&>div]:gap-3! [&>div>div]:w-full!">
                  {filters}
                </div>
              </PopoverContent>
            </Popover>
          )}
          {!search && !filters && children}
        </div>
        {actions && (
          <div className="flex w-full shrink-0 scrollbar-none items-center gap-1.5 overflow-x-auto pb-0.5 sm:w-auto sm:gap-2 sm:pb-0">
            {actions}
          </div>
        )}
      </div>

      {/* Floating Action Console Dock */}
      <Card
        className={cn(
          "fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center gap-2.5 border-none px-4 py-3 shadow-lg transition-all duration-300 ease-in-out",
          isSelected
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-12 scale-95 opacity-0",
        )}
      >
        {/* Statistics Block */}
        <div className="flex shrink-0 items-center gap-2">
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
          <Badge variant="default">{selectedCount}</Badge>
          <span className="text-xs font-medium text-foreground">selected</span>
        </div>
        {/* Action Trays */}
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
          {bulkActions}
        </div>
      </Card>
    </>
  );
}
