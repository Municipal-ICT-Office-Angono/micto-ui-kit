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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PaginationLinkData = {
  active: boolean;
  label: string;
  url: string | null;
};

type Props = {
  links: PaginationLinkData[];
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  position?: "start" | "center" | "end";
  className?: string;
  LinkComponent?: React.ComponentType<{ href: string; [key: string]: unknown }>;
  linkProps?: Record<string, unknown>;
};

const cleanLabel = (label: string) =>
  label.replace(/&laquo;|&raquo;/g, "").trim();

const getRelativeUrl = (urlString: string | null): string => {
  if (!urlString) return "#";
  try {
    // Parse fully qualified URLs (e.g., http://your-laravel-server.test/users?page=2)
    const parsed = new URL(urlString);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    // If it fails, it is already a relative URL or simple path hash
    return urlString;
  }
};

export function InertiaPagination({
  links,
  size = "icon",
  position = "center",
  className,
  LinkComponent,
  linkProps,
}: Props) {
  if (!links || links.length <= 1) return null;

  const positionClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  }[position] || "justify-center";

  return (
    <Pagination className={cn(positionClass, className)}>
      <PaginationContent className={cn("flex-wrap", positionClass)}>
        {links.map((link, index) => {
          const isPrev = link.label.includes("Previous");
          const isNext = link.label.includes("Next");
          const isEllipsis = link.label === "...";
          const isDisabled = !link.url;
          const relativeUrl = getRelativeUrl(link.url);

          return (
            <PaginationItem key={`${link.label}-${index}`}>
              {isEllipsis ? (
                <PaginationEllipsis />
              ) : isPrev ? (
                LinkComponent ? (
                  <PaginationLink
                    aria-label="Go to previous page"
                    size="default"
                    className={cn(
                      "gap-1 px-2.5 sm:pl-2.5",
                      isDisabled && "pointer-events-none opacity-50"
                    )}
                    asChild
                    aria-disabled={isDisabled || undefined}
                    tabIndex={isDisabled ? -1 : undefined}
                  >
                    <LinkComponent
                      href={relativeUrl}
                      preserveState
                      preserveScroll
                      {...linkProps}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      <span>Previous</span>
                    </LinkComponent>
                  </PaginationLink>
                ) : (
                  <PaginationPrevious
                    href={relativeUrl}
                    className={cn(isDisabled && "pointer-events-none opacity-50")}
                    aria-disabled={isDisabled || undefined}
                    tabIndex={isDisabled ? -1 : undefined}
                  />
                )
              ) : isNext ? (
                LinkComponent ? (
                  <PaginationLink
                    aria-label="Go to next page"
                    size="default"
                    className={cn(
                      "gap-1 px-2.5 sm:pr-2.5",
                      isDisabled && "pointer-events-none opacity-50"
                    )}
                    asChild
                    aria-disabled={isDisabled || undefined}
                    tabIndex={isDisabled ? -1 : undefined}
                  >
                    <LinkComponent
                      href={relativeUrl}
                      preserveState
                      preserveScroll
                      {...linkProps}
                    >
                      <span>Next</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </LinkComponent>
                  </PaginationLink>
                ) : (
                  <PaginationNext
                    href={relativeUrl}
                    className={cn(isDisabled && "pointer-events-none opacity-50")}
                    aria-disabled={isDisabled || undefined}
                    tabIndex={isDisabled ? -1 : undefined}
                  />
                )
              ) : (
                <PaginationLink
                  isActive={link.active}
                  size={size}
                  asChild={!!LinkComponent}
                  href={relativeUrl}
                  className={cn(
                    link.active && "pointer-events-none font-semibold",
                    isDisabled && "pointer-events-none opacity-50"
                  )}
                  aria-disabled={isDisabled || undefined}
                  tabIndex={isDisabled ? -1 : undefined}
                >
                  {LinkComponent ? (
                    <LinkComponent
                      href={relativeUrl}
                      preserveState
                      preserveScroll
                      {...linkProps}
                    >
                      {cleanLabel(link.label)}
                    </LinkComponent>
                  ) : (
                    cleanLabel(link.label)
                  )}
                </PaginationLink>
              )}
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}


