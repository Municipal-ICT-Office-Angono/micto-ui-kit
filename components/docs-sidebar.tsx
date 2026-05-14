"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const navData = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        url: "/docs/introduction",
      },
      {
        title: "Installation",
        url: "/docs/installation",
      },
    ],
  },
  {
    title: "React",
    items: [
      // {
      //   title: "Button",
      //   url: "/docs/components/button",
      // },
      // {
      //   title: "Pagination",
      //   url: "/docs/components/pagination",
      // },
      {
        title: "Activity Timeline",
        url: "/docs/components/activity-timeline",
      },
      {
        title: "Confirm Dialog",
        url: "/docs/components/confirm-dialog",
      },
      {
        title: "Data Table",
        url: "/docs/components/data-table",
      },
      {
        title: "Document Viewer",
        url: "/docs/components/document-viewer",
      },
      {
        title: "File Uploader",
        url: "/docs/components/file-uploader",
      },
      {
        title: "Permission Guard",
        url: "/docs/components/permission-guard",
      },
      {
        title: "Search Select",
        url: "/docs/components/search-select",
      },
      {
        title: "Server Pagination",
        url: "/docs/components/server-pagination",
      },
      {
        title: "Table Toolbar",
        url: "/docs/components/table-toolbar",
      },
    ],
  },
  {
    title: "React Inertia",
    items: [
      {
        title: "Inertia Pagination",
        url: "/docs/components/inertia-pagination",
      },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r px-6 py-10 md:block">
      <div className="flex flex-col gap-8">
        {navData.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h4 className="px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground/90">
              {section.title}
            </h4>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className={cn(
                      "flex h-8 items-center px-3 text-sm font-medium transition-colors hover:text-foreground rounded-md",
                      isActive
                        ? "bg-muted font-semibold text-foreground"
                        : "text-muted-foreground/70 hover:bg-muted/50",
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
