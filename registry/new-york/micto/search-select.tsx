"use client";

/**
 * @title Search Select
 * @description A beautiful searchable combobox supporting single/multi selection.
 * @categories react, component
 */
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// --- Types ---

export interface SearchSelectOption {
  value: string;
  label: string;
  description?: string;
  avatar?: string;

  [key: string]: any;
}

export interface SearchSelectProps {
  /** Mode A: The static list of values to search locally */
  options?: SearchSelectOption[];

  /** Mode B: Fired when typing. Returns a promise resolving list of search results. */
  onSearch?: (query: string) => Promise<SearchSelectOption[]>;

  /** Currently selected value (string in single mode, array of strings in multi mode) */
  value?: string | string[];

  /** Event fired when selections change */

  onChange?: (value: any) => void;

  /** Support selecting multiple options simultaneously */
  multiple?: boolean;

  /** Placeholder text displayed inside trigger and search input */
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  /** Disable the entire combobox selection */
  disabled?: boolean;
  className?: string;
}

// --- Debounce Hook (Zero-Dependency) ---

function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// --- Component ---

export function SearchSelect({
  options = [],
  onSearch,
  value,
  onChange,
  multiple = false,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  className,
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] =
    React.useState<SearchSelectOption[]>(options);
  const [isLoading, setIsLoading] = React.useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // We use derived state instead of syncing options to state via useEffect
  const displayedOptions = onSearch ? searchResults : options;

  // Handle Async Searching
  React.useEffect(() => {
    if (!onSearch) {
      return;
    }

    let isMounted = true;
    const fetchResults = async () => {
      setIsLoading(true);

      try {
        const results = await onSearch(debouncedQuery);

        if (isMounted) {
          setSearchResults(results);
        }
      } catch (error) {
        console.error("SearchSelect fetching error:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchResults();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, onSearch]);

  // Selection state helpers
  const selectedValues = React.useMemo(() => {
    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }, [value]);

  const handleSelect = (itemValue: string) => {
    if (multiple) {
      const alreadySelected = selectedValues.includes(itemValue);
      const nextValue = alreadySelected
        ? selectedValues.filter((v) => v !== itemValue)
        : [...selectedValues, itemValue];
      onChange?.(nextValue);
    } else {
      onChange?.(itemValue);
      setOpen(false);
    }
  };

  const handleRemove = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (multiple) {
      onChange?.(selectedValues.filter((v) => v !== itemValue));
    } else {
      onChange?.(undefined);
    }
  };

  // Resolve matching Option labels for rendering
  const getSelectedLabels = React.useMemo(() => {
    // Merge options and searchResults to match currently selected values
    const allKnown = [...options, ...searchResults];
    const uniqueKnown = Array.from(
      new Map(allKnown.map((item) => [item.value, item])).values(),
    );

    return selectedValues.map((val) => {
      const found = uniqueKnown.find((o) => o.value === val);

      return found ? found : { value: val, label: val };
    });
  }, [selectedValues, options, searchResults]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-controls="radix-combobox"
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "flex h-auto min-h-10 w-full min-w-0 cursor-pointer items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-left text-sm font-normal shadow-xs ring-offset-background transition-colors hover:bg-muted/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden",
            disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
            selectedValues.length === 0 && "text-muted-foreground",
            className,
          )}
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }

            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
        >
          <div className="flex flex-1 min-w-0 flex-wrap items-center gap-1.5">
            {getSelectedLabels.length === 0 ? (
              <span>{placeholder}</span>
            ) : multiple ? (
              getSelectedLabels.map((item) => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="flex max-w-[200px] items-center gap-1 rounded-md border border-muted-foreground/10 py-0.5 pr-1 pl-2 text-xs font-medium"
                >
                  <span className="truncate">{item.label}</span>
                  <button
                    type="button"
                    className="ml-0.5 rounded-full p-0.5 text-muted-foreground outline-hidden transition-colors hover:bg-muted hover:text-foreground"
                    onClick={(e) => handleRemove(item.value, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(item.value, e as any);
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <div className="flex min-w-0 items-center gap-2">
                {getSelectedLabels[0]?.avatar && (
                  <>
                    <img
                      src={getSelectedLabels[0].avatar}
                      alt={getSelectedLabels[0].label}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                  </>
                )}
                <span className="truncate">{getSelectedLabels[0]?.label}</span>
              </div>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) overflow-hidden rounded-xl border p-0 shadow-xl"
        align="start"
      >
        <Command
          shouldFilter={!onSearch}
          filter={(value, search, keywords) => {
            const extendValue = value + " " + (keywords ?? []).join(" ");

            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }

            return 0;
          }}
        >
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-10 border-none focus:ring-0"
          />
          <CommandList className="max-h-[300px] overflow-y-auto p-1">
            {isLoading ? (
              <div className="flex flex-col gap-2.5 px-4 py-6">
                {/* Visual Premium Skeletons */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-[60%] animate-pulse rounded bg-muted" />
                    <div className="h-2.5 w-[40%] animate-pulse rounded bg-muted" />
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-[45%] animate-pulse rounded bg-muted" />
                    <div className="h-2.5 w-[30%] animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </CommandEmpty>
                <CommandGroup>
                  {displayedOptions.map((item) => {
                    const isSelected = selectedValues.includes(item.value);

                    return (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        keywords={[item.label, item.description || ""]}
                        onSelect={() => handleSelect(item.value)}
                        className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2.5 hover:bg-accent data-[selected=true]:bg-accent"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {item.avatar && (
                            <>
                              <img
                                src={item.avatar}
                                alt={item.label}
                                className="h-8 w-8 shrink-0 rounded-full border border-muted object-cover"
                              />
                            </>
                          )}
                          <div className="flex min-w-0 flex-col leading-tight">
                            <span className="truncate text-sm font-medium text-foreground">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="mt-0.5 truncate text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="ml-2 h-4 w-4 shrink-0 text-primary" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
