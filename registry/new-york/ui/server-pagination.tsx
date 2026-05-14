"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  LinkComponent?: React.ComponentType<any>;
}

export function ServerPagination({
  currentPage,
  totalPages,
  position = "center",
  size = "icon",
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

  // Helper algorithm to generate pagination ranges with ellipsis
  const getPaginationRange = React.useMemo(() => {
    const siblingCount = 1;
    const totalPageNumbers = siblingCount * 2 + 5; // siblingCount + firstPage + lastPage + currentPage + 2*ellipses

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
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [1, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "dots", ...middleRange, "dots", totalPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const handlePageClick = (page: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      e.preventDefault();
      return;
    }
    if (onPageChange) {
      e.preventDefault();
      onPageChange(page);
    }
  };

  const getHref = (page: number) => {
    return createPageHref ? createPageHref(page) : "#";
  };

  const renderPageLink = (page: number, active: boolean) => {
    const href = getHref(page);
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => handlePageClick(page, e);

    if (LinkComponent) {
      return (
        <PaginationLink
          isActive={active}
          size={size}
          asChild
          className={cn(active && "pointer-events-none")}
        >
          <LinkComponent href={href} onClick={onClick}>
            {page}
          </LinkComponent>
        </PaginationLink>
      );
    }

    return (
      <PaginationLink
        isActive={active}
        size={size}
        href={href}
        onClick={onClick}
        className={cn(active && "pointer-events-none")}
      >
        {page}
      </PaginationLink>
    );
  };

  const renderPrevious = (page: number, disabled: boolean) => {
    const href = getHref(page);
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => handlePageClick(page, e);

    if (LinkComponent) {
      return (
        <PaginationPrevious
          asChild
          className={cn(disabled && "pointer-events-none opacity-50")}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
        >
          <LinkComponent href={href} onClick={onClick} />
        </PaginationPrevious>
      );
    }

    return (
      <PaginationPrevious
        href={href}
        onClick={onClick}
        className={cn(disabled && "pointer-events-none opacity-50")}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
      />
    );
  };

  const renderNext = (page: number, disabled: boolean) => {
    const href = getHref(page);
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => handlePageClick(page, e);

    if (LinkComponent) {
      return (
        <PaginationNext
          asChild
          className={cn(disabled && "pointer-events-none opacity-50")}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
        >
          <LinkComponent href={href} onClick={onClick} />
        </PaginationNext>
      );
    }

    return (
      <PaginationNext
        href={href}
        onClick={onClick}
        className={cn(disabled && "pointer-events-none opacity-50")}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
      />
    );
  };

  return (
    <Pagination className={cn(positionClass, className)}>
      <PaginationContent className={cn("flex-wrap", positionClass)}>
        {/* Previous Button */}
        <PaginationItem>
          {renderPrevious(currentPage - 1, currentPage === 1)}
        </PaginationItem>

        {/* Page Range Items */}
        {getPaginationRange.map((item, index) => {
          if (item === "dots") {
            return (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const pageNum = item as number;
          return (
            <PaginationItem key={`page-${pageNum}`}>
              {renderPageLink(pageNum, pageNum === currentPage)}
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          {renderNext(currentPage + 1, currentPage === totalPages)}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
