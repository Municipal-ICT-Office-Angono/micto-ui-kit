"use client";

/**
 * @title Server Pagination
 * @description A universal pagination component tailored for standard React and Next.js.
 * @categories react, component
 */
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ServerPaginationProps {
  /** The current active page number (1-indexed) */
  currentPage: number;
  /** The total number of pages */
  totalPages: number;
  /** Horizontal alignment: start | center | end */
  position?: "start" | "center" | "end";
  /** Button sizing profiles */
  size?: "default" | "sm" | "lg" | "icon";
  /** Custom CSS classes for the container */
  className?: string;

  // --- MODE A: Interactive State-Based (TanStack Query, State Updates) ---
  /** Callback triggered when a page is selected. Prevents default link action. */
  onPageChange?: (page: number) => void;

  // --- MODE B: Route/URL-Based (SEO Nav, Next.js or TanStack Router) ---
  /** Helper function that maps a page number to a relative URL string */
  createPageHref?: (page: number) => string;
  /** Custom routing link component (Next.js Link, TanStack Router Link, etc.) */
  LinkComponent?: React.ComponentType<{
    href: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    children?: React.ReactNode;
    [key: string]: unknown;
  }>;
}

export function ServerPagination({
  currentPage,
  totalPages,
  position = "center",
  className,
  onPageChange,
  createPageHref,
  LinkComponent,
}: ServerPaginationProps) {
  const positionClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  }[position];

  // Generate pagination range with ellipsis
  const paginationRange = React.useMemo(() => {
    const siblingCount = 1;
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftRange, "dots", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );

      return [1, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );

      return [1, "dots", ...middleRange, "dots", totalPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  const navigate = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange?.(page);
  };

  const getHref = (page: number) =>
    createPageHref ? createPageHref(page) : "#";

  // Plain render helpers — not React components, so no static-components lint issue
  const renderNavButton = ({
    page,
    disabled,
    label,
    icon: Icon,
  }: {
    page: number;
    disabled: boolean;
    label: string;
    icon: React.ElementType;
  }) => {
    if (LinkComponent && !disabled) {
      return (
        <a
          href={getHref(page)}
          aria-label={label}
          onClick={(e) => {
            e.preventDefault();
            navigate(page);
          }}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors",
            "hover:border-border hover:bg-muted hover:text-foreground",
            disabled && "pointer-events-none opacity-35",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </a>
      );
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 text-muted-foreground",
          "hover:border hover:border-border hover:bg-muted hover:text-foreground",
          disabled && "pointer-events-none opacity-35",
        )}
        aria-label={label}
        disabled={disabled}
        onClick={() => navigate(page)}
      >
        <Icon className="h-3.5 w-3.5" />
      </Button>
    );
  };

  const renderPageButton = (page: number) => {
    const isActive = page === currentPage;

    const baseClass = cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium tabular-nums transition-colors",
      isActive
        ? "border border-border bg-muted text-foreground"
        : "text-muted-foreground hover:border hover:border-border hover:bg-muted hover:text-foreground",
    );

    if (LinkComponent && !isActive) {
      return (
        <a
          href={getHref(page)}
          aria-current={isActive ? "page" : undefined}
          onClick={(e) => {
            e.preventDefault();
            navigate(page);
          }}
          className={baseClass}
        >
          {page}
        </a>
      );
    }

    return (
      <button
        type="button"
        aria-current={isActive ? "page" : undefined}
        disabled={isActive}
        onClick={() => navigate(page)}
        className={baseClass}
      >
        {page}
      </button>
    );
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center gap-1", positionClass, className)}
    >
      {/* First Page */}
      {renderNavButton({
        page: 1,
        disabled: currentPage === 1,
        label: "Go to first page",
        icon: ChevronFirst,
      })}

      {/* Previous Page */}
      {renderNavButton({
        page: currentPage - 1,
        disabled: currentPage === 1,
        label: "Go to previous page",
        icon: ChevronLeft,
      })}

      {/* Separator */}
      <div className="mx-0.5 h-4 w-px bg-border" />

      {/* Page range */}
      {paginationRange.map((item, index) => {
        if (item === "dots") {
          return (
            <span
              key={`dots-${index}`}
              className="flex h-8 w-8 items-center justify-center text-muted-foreground/50"
              aria-hidden
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </span>
          );
        }

        const pageNum = item as number;

        return (
          <React.Fragment key={`page-${pageNum}`}>
            {renderPageButton(pageNum)}
          </React.Fragment>
        );
      })}

      {/* Separator */}
      <div className="mx-0.5 h-4 w-px bg-border" />

      {/* Next Page */}
      {renderNavButton({
        page: currentPage + 1,
        disabled: currentPage === totalPages,
        label: "Go to next page",
        icon: ChevronRight,
      })}

      {/* Last Page */}
      {renderNavButton({
        page: totalPages,
        disabled: currentPage === totalPages,
        label: "Go to last page",
        icon: ChevronLast,
      })}
    </nav>
  );
}
