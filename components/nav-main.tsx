"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-4 py-6">
      <SidebarMenu className="gap-8">
        {items.map((item) => (
          <SidebarMenuItem key={item.title} className="flex flex-col gap-3">
            <div className="px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
              {item.title}
            </div>
            {item.items && item.items.length > 0 && (
              <div className="flex flex-col gap-1">
                {item.items.map((subItem) => {
                  const isActive = pathname === subItem.url;
                  return (
                    <SidebarMenuButton
                      key={subItem.title}
                      asChild
                      isActive={isActive}
                      className="h-8 px-3 text-[13px] font-medium transition-colors hover:bg-muted/50 hover:text-foreground data-[active=true]:bg-muted/60 data-[active=true]:font-semibold data-[active=true]:text-foreground"
                    >
                      <Link href={subItem.url}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  );
                })}
              </div>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
