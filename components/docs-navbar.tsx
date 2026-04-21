"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navData } from "./docs-sidebar";
import { DocsSearch } from "./docs-search";
import { ModeToggle } from "./mode-toggle";
import { Github } from "lucide-react";

export function DocsNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-8">
        <div className="mr-8 flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex aspect-square size-6 items-center justify-center rounded-[4px] bg-primary text-primary-foreground">
              <Command className="size-3.5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight">MICTO</span>
              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest leading-none">UI KIT</span>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <DocsSearch />
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild className="size-9 h-9 w-9">
              <Link
                href="https://github.com/Municipal-ICT-Office-Angono/micto-ui-kit"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="size-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <ModeToggle />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] pr-0">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <div className="flex aspect-square size-6 items-center justify-center rounded-[4px] bg-primary text-primary-foreground">
                    <Command className="size-3.5" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold tracking-tight text-left">MICTO</span>
                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest leading-none text-left">UI KIT</span>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation menu for mobile devices.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-8 pb-10">
                {navData.map((section) => (
                  <div key={section.title} className="flex flex-col gap-3">
                    <h4 className="px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
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
                              "flex h-9 items-center px-3 text-sm font-medium transition-colors hover:text-foreground rounded-md",
                              isActive
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground/70 hover:bg-muted/50"
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
