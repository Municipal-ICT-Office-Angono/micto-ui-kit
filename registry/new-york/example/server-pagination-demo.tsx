"use client";

import * as React from "react";
import { ServerPagination } from "@/components/ui/server-pagination";

export default function ServerPaginationDemo() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 12;

  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-12">
      {/* State-Driven / Client Callback Mode */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            State-Driven Mode (TanStack Query / API Clicks)
          </h4>
          <p className="text-xs text-muted-foreground">
            Intercepts clicks to update local states dynamically without navigating. Currently on page{" "}
            <span className="font-semibold text-primary">{currentPage}</span> of {totalPages}.
          </p>
        </div>
        <div className="flex justify-center border-t border-dashed pt-4 mt-2">
          <ServerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* SEO / Route-Based Mode */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            SEO / Routing Mode (Next.js / TanStack Router)
          </h4>
          <p className="text-xs text-muted-foreground">
            Generates relative search parameter URLs (e.g. <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">/docs?page=[number]</code>)
            ideal for static page generation and server rendering.
          </p>
        </div>
        <div className="flex justify-center border-t border-dashed pt-4 mt-2">
          <ServerPagination
            currentPage={3}
            totalPages={8}
            createPageHref={(page) => `/docs/components/server-pagination?page=${page}`}
          />
        </div>
      </div>
    </div>
  );
}
