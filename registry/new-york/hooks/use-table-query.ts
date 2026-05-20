"use client";

/**
 * @title Query
 * @description A high-performance TanStack Query wrapper for DataTable that manages server-side pagination, sorting, and searching state automatically.
 * @categories react, hook, table
 * @hidden true
 */
import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { QueryKey, UseQueryResult } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TableQueryParams {
  page: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  trashed: boolean;
}

export interface TableQueryResult<TData> {
  data: TData[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export interface UseTableQueryOptions<TData> {
  /** Base query key — page/pageSize/search/sorting/trashed are appended automatically. */
  queryKey: QueryKey;
  /** Fetcher function. Receives current table params, must return a paginated result. */
  queryFn: (params: TableQueryParams) => Promise<TableQueryResult<TData>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  /** When set, column visibility persists to localStorage. */
  tableId?: string;
  /** Initial page size. Default: 10 */
  initialPageSize?: number;
  /** If provided, renders a "Rows per page" selector. Example: [10, 25, 50] */
  pageSizeOptions?: number[];
  /** Debounce delay for the search input in ms. Default: 300 */
  searchDebounceMs?: number;
  initialSorting?: SortingState;
  /** Enable "Show Trashed" toggle. Default: false */
  enableTrashed?: boolean;
  /** Passthrough to useQuery. Default: true */
  enabled?: boolean;
}

export interface UseTableQueryReturn<TData> {
  // Spread directly onto <DataTable />
  data: TData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  isLoading: boolean;
  isFetching: boolean;
  pagination: "server";
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (value: string) => void;
  manualSorting: true;
  onSortingChange: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
  tableId?: string;
  // Trashed
  enableTrashed: boolean;
  trashed: boolean;
  onTrashedChange: (trashed: boolean) => void;
  // Direct access for advanced use
  queryResult: UseQueryResult<TableQueryResult<TData>>;
  refetch: () => void;
  // Current param state (useful for outside consumers)
  currentParams: TableQueryParams;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTableQuery<TData>({
  queryKey,
  queryFn,
  columns,
  tableId,
  initialPageSize = 10,
  pageSizeOptions,
  searchDebounceMs = 300,
  initialSorting = [],
  enableTrashed = false,
  enabled = true,
}: UseTableQueryOptions<TData>): UseTableQueryReturn<TData> {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Helper to update query parameters in the URL
  const updateParams = React.useCallback(
    (newParams: Record<string, string | number | boolean | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(newParams)) {
        if (value === null || value === undefined || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      }

      const queryString = current.toString();
      router.replace(`${pathname}?${queryString}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Get parameter values directly from URL or fallback to defaults
  const page = React.useMemo(() => {
    const p = searchParams.get("page");
    return p ? Math.max(1, parseInt(p, 10)) : 1;
  }, [searchParams]);

  const pageSize = React.useMemo(() => {
    const ps = searchParams.get("pageSize");
    return ps ? parseInt(ps, 10) : initialPageSize;
  }, [searchParams, initialPageSize]);

  const sorting = React.useMemo<SortingState>(() => {
    const s = searchParams.get("sorting");
    if (!s) return initialSorting;
    try {
      return s.split(",").map((item) => {
        const parts = item.split(".");
        const id = parts[0] || "";
        const order = parts[1];
        return { id, desc: order === "desc" };
      });
    } catch {
      return initialSorting;
    }
  }, [searchParams, initialSorting]);

  const trashed = React.useMemo(() => {
    return searchParams.get("trashed") === "true";
  }, [searchParams]);

  // For the search input, keep a local state to allow fast typing (without router latency).
  const [searchValue, setSearchValue] = React.useState(() => searchParams.get("search") || "");

  // Sync local search input with URL search param changes (e.g. if page loads or changes externally)
  const urlSearch = searchParams.get("search") || "";
  React.useEffect(() => {
    setSearchValue(urlSearch);
  }, [urlSearch]);

  // Debounce the search input updates and push them to the URL
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (searchValue !== currentSearch) {
        updateParams({
          search: searchValue || null,
          page: 1, // Reset to page 1 when search changes
        });
      }
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, searchDebounceMs, searchParams, updateParams]);

  const debouncedSearch = searchParams.get("search") || "";

  const params: TableQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
    sorting,
    trashed,
  };

  const queryResult = useQuery({
    queryKey: [...queryKey, page, pageSize, debouncedSearch, sorting, trashed],
    queryFn: () => queryFn(params),
    enabled,
    placeholderData: keepPreviousData, // keeps stale data visible while fetching next page
  });

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      updateParams({ page: newPage });
    },
    [updateParams]
  );

  const handlePageSizeChange = React.useCallback(
    (newSize: number) => {
      updateParams({
        pageSize: newSize,
        page: 1, // Reset to first page on size change
      });
    },
    [updateParams]
  );

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSortingChange = React.useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const nextSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
      const sortingStr = nextSorting.length
        ? nextSorting.map((s) => `${s.id}.${s.desc ? "desc" : "asc"}`).join(",")
        : null;

      updateParams({
        sorting: sortingStr,
        page: 1, // Reset to page 1 when sorting changes
      });
    },
    [sorting, updateParams]
  );

  const handleTrashedChange = React.useCallback(
    (value: boolean) => {
      updateParams({
        trashed: value ? "true" : null,
        page: 1, // Reset to page 1 when trashed changes
      });
    },
    [updateParams]
  );

  return {
    // DataTable-ready props
    data: queryResult.data?.data ?? [],
    columns,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    pagination: "server",
    currentPage: queryResult.data?.currentPage ?? page,
    totalPages: queryResult.data?.totalPages ?? 1,
    totalCount: queryResult.data?.totalCount ?? 0,
    pageSize,
    pageSizeOptions,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    onSearchChange: handleSearchChange,
    manualSorting: true,
    onSortingChange: handleSortingChange,
    tableId,
    // Trashed
    enableTrashed,
    trashed,
    onTrashedChange: handleTrashedChange,
    // Advanced access
    queryResult,
    refetch: () => { void queryResult.refetch(); },
    currentParams: params,
  };
}
