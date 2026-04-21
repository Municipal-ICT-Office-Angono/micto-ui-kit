"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navData } from "./docs-sidebar";

export function DocsPager() {
  const pathname = usePathname();

  // Flatten the navigation data
  const flatNav = navData.flatMap((section) => section.items);
  const currentIndex = flatNav.findIndex((item) => item.url === pathname);

  const prev = currentIndex > 0 ? flatNav[currentIndex - 1] : null;
  const next =
    currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="flex items-center justify-between border-t py-10 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {prev ? (
        <Link
          href={prev.url}
          className="group flex flex-col items-start gap-1 transition-colors hover:text-primary"
        >
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/50">
            <ChevronLeft className="size-3" />
            Previous
          </span>
          <span className="text-sm font-semibold text-foreground">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.url}
          className="group flex flex-col items-end gap-1 transition-colors hover:text-primary text-right"
        >
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/50">
            Next
            <ChevronRight className="size-3" />
          </span>
          <span className="text-sm font-semibold text-foreground">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
