"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { title } from "process";

import { docsConfig } from "@/config/docs";
import registry from "@/registry.json";

interface RegistryItem {
  name: string;
  title: string;
  categories?: string[];
  hidden?: boolean;
}

const typedRegistry = registry as { items: RegistryItem[] };

export const getNavData = () => {
  return docsConfig.navigation.map((section) => {
    if (section.items) return section;

    const filteredItems = typedRegistry.items
      .filter((item) => {
        if (item.hidden) return false;
        const itemCats = item.categories || [];
        if (section.category && !itemCats.includes(section.category)) return false;
        if (section.excludeCategory && itemCats.includes(section.excludeCategory)) return false;
        return true;
      })
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((item) => ({
        title: item.title,
        url: `/docs/components/${item.name}`,
      }));

    return {
      title: section.title,
      items: filteredItems,
    };
  });
};

export function DocsSidebar() {
  const pathname = usePathname();

  const navData = getNavData();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r px-6 py-10 md:block">
      <div className="flex flex-col gap-8">
        {navData.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h4 className="px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground/90">
              {section.title}
            </h4>
            <div className="flex flex-col gap-1">
              {section.items?.map((item) => {
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
