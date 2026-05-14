"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
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

// --- Types ---

export interface SearchSelectOption {
  value: string;
  label: string;
  description?: string;
  avatar?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [searchResults, setSearchResults] = React.useState<SearchSelectOption[]>(options);
  const [isLoading, setIsLoading] = React.useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Synchronize options when static options prop changes
  React.useEffect(() => {
    if (!onSearch) {
      setSearchResults(options);
    }
  }, [options, onSearch]);

  // Handle Async Searching
  React.useEffect(() => {
    if (!onSearch) return;

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
    if (!value) return [];
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
    const uniqueKnown = Array.from(new Map(allKnown.map((item) => [item.value, item])).values());
    
    return selectedValues.map((val) => {
      const found = uniqueKnown.find((o) => o.value === val);
      return found ? found : { value: val, label: val };
    });
  }, [selectedValues, options, searchResults]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-controls="radix-combobox"
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "flex w-full h-auto min-h-10 items-center justify-between px-3 py-2 text-left text-sm font-normal border border-input rounded-lg bg-background shadow-xs ring-offset-background cursor-pointer hover:bg-muted/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors",
            disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
            selectedValues.length === 0 && "text-muted-foreground",
            className
          )}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
        >
          <div className="flex flex-wrap gap-1.5 items-center max-w-[92%]">
            {getSelectedLabels.length === 0 ? (
              <span>{placeholder}</span>
            ) : multiple ? (
              getSelectedLabels.map((item) => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="flex items-center gap-1 rounded-md py-0.5 pl-2 pr-1 text-xs font-medium border border-muted-foreground/10 max-w-[200px]"
                >
                  <span className="truncate">{item.label}</span>
                  <button
                    type="button"
                    className="ml-0.5 rounded-full outline-hidden hover:bg-muted p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => handleRemove(item.value, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        handleRemove(item.value, e as any);
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <div className="flex items-center gap-2 truncate">
                {getSelectedLabels[0]?.avatar && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-xl border overflow-hidden" align="start">
        <Command shouldFilter={!onSearch}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-10 border-none focus:ring-0"
          />
          <CommandList className="max-h-[300px] overflow-y-auto p-1">
            {isLoading ? (
              <div className="py-6 flex flex-col gap-2.5 px-4">
                {/* Visual Premium Skeletons */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-[60%] bg-muted animate-pulse rounded" />
                    <div className="h-2.5 w-[40%] bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-[45%] bg-muted animate-pulse rounded" />
                    <div className="h-2.5 w-[30%] bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </CommandEmpty>
                <CommandGroup>
                  {searchResults.map((item) => {
                    const isSelected = selectedValues.includes(item.value);
                    return (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={() => handleSelect(item.value)}
                        className="flex items-center justify-between px-2.5 py-2.5 rounded-lg cursor-pointer data-[selected=true]:bg-accent hover:bg-accent"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {item.avatar && (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.avatar}
                                alt={item.label}
                                className="h-8 w-8 rounded-full object-cover shrink-0 border border-muted"
                              />
                            </>
                          )}
                          <div className="flex flex-col min-w-0 leading-tight">
                            <span className="font-medium text-sm text-foreground truncate">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate mt-0.5">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-primary ml-2" />
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
