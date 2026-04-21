"use client";

import * as React from "react";
import { Command, Search } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
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
      url: "#",
      items: [
        {
          title: "Button",
          url: "/docs/components/button",
        },
        {
          title: "Pagination",
          url: "/docs/components/pagination",
        },
      ],
    },
    {
      title: "React Inertia",
      url: "#",
      items: [
        {
          title: "Inertia Pagination",
          url: "/docs/components/inertia-pagination",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-8 px-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex aspect-square size-5 items-center justify-center rounded-[3px] bg-primary text-primary-foreground">
            <Command className="size-3" />
          </div>
          <span className="font-bold tracking-tight text-[13px]">MICTO UI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup className="py-4">
          <SidebarGroupContent className="relative px-2">
            <SidebarInput
              placeholder="Search..."
              className="pl-8 h-8 text-[11px] border-none bg-muted/20 shadow-none transition-all focus-visible:bg-muted/40 focus-visible:ring-0"
            />
            <Search className="pointer-events-none absolute left-4.5 top-1/2 size-3.5 -translate-y-1/2 select-none opacity-20" />
          </SidebarGroupContent>
        </SidebarGroup>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="py-8 px-8 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/30 font-bold">
        v1.0 — MICTO
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
