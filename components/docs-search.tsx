"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { navData } from "@/components/docs-sidebar";

export function DocsSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-9 md:w-[300px] lg:w-[400px] items-center justify-center md:justify-start rounded-md border border-input/50 bg-muted/50 p-0 md:px-3 md:py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40"
        aria-label="Search documentation"
      >
        <Search className="size-4 md:mr-2 text-muted-foreground/80 md:text-muted-foreground/30" />
        <span className="hidden md:inline-flex">Search documentation...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {navData.map((group, index) => (
            <React.Fragment key={group.title}>
              <CommandGroup heading={group.title}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.url}
                    value={item.title}
                    onSelect={() => {
                      runCommand(() => router.push(item.url));
                    }}
                  >
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {index < navData.length - 1 && <CommandSeparator />}
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
