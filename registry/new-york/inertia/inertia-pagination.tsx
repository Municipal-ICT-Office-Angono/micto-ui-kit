"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PaginationLinkData = {
  active: boolean;
  label: string;
  url: string | null;
};

type InertiaLikeLinkProps = {
  href: string;
  children: React.ReactNode;
  preserveState?: boolean;
  preserveScroll?: boolean;
};

type Props = {
  links: PaginationLinkData[];
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  position?: "start" | "center" | "end";
  className?: string;
  LinkComponent?: React.ComponentType<InertiaLikeLinkProps>;
};

export function InertiaPagination({
  links,
  size = "icon",
  position = "center",
  className,
  LinkComponent,
}: Props) {
  const cleanLabel = (label: string) =>
    label.replace(/&laquo;|&raquo;/g, "").trim();
  const positionClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  }[position];

  if (!links || links.length <= 1) return null;

  return (
    <Pagination className={cn(positionClass, className)}>
      <PaginationContent className={cn("flex-wrap", positionClass)}>
        {links.map((link, index) => {
          const isPrev = link.label.includes("Previous");
          const isNext = link.label.includes("Next");
          const isEllipsis = link.label === "...";
          const isDisabled = !link.url;
          const content = (
            <>
              {isPrev && <ChevronLeftIcon className="h-4 w-4" />}
              {isPrev || isNext ? (
                <span className="sr-only">{cleanLabel(link.label)}</span>
              ) : (
                cleanLabel(link.label)
              )}
              {isNext && <ChevronRightIcon className="h-4 w-4" />}
            </>
          );

          return (
            <PaginationItem key={`${link.label}-${index}`}>
              {isEllipsis ? (
                <PaginationEllipsis />
              ) : (
                <Button
                  asChild
                  variant={link.active ? "outline" : "ghost"}
                  size={size}
                  disabled={isDisabled}
                  aria-current={link.active ? "page" : undefined}
                  className={cn(
                    link.active && "pointer-events-none font-semibold",
                    isDisabled && "pointer-events-none opacity-50",
                  )}
                >
                  {LinkComponent ? (
                    <LinkComponent
                      href={link.url ?? "#"}
                      preserveState
                      preserveScroll
                    >
                      {content}
                    </LinkComponent>
                  ) : (
                    <a
                      href={link.url ?? "#"}
                      aria-disabled={isDisabled || undefined}
                    >
                      {content}
                    </a>
                  )}
                </Button>
              )}
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}
