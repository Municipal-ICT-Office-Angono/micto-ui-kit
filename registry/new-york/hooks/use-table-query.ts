"use client";

/**
 * @title Query
 * @description A high-performance TanStack Query wrapper for DataTable that manages server-side pagination, sorting, and searching state automatically, synchronized with URL parameters.
 * @categories react, hook, table
 * @hidden true
 */
import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { QueryKey, UseQueryResult } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

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

// Helper to safely get parameter from URL
function getUrlParam(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || fallback;
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
  // Initialize states from URL parameters or fallbacks
  const [page, setPage] = React.useState<number>(() => {
    const p = getUrlParam("page", "1");
    return Math.max(1, parseInt(p, 10));
  });

  const [pageSize, setPageSize] = React.useState<number>(() => {
    const ps = getUrlParam("pageSize", String(initialPageSize));
    return parseInt(ps, 10);
  });

  const [sorting, setSorting] = React.useState<SortingState>(() => {
    const s = getUrlParam("sorting", "");
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
  });

  const [trashed, setTrashed] = React.useState<boolean>(() => {
    return getUrlParam("trashed", "false") === "true";
  });

  const [search, setSearch] = React.useState<string>(() => {
    return getUrlParam("search", "");
  });

  // Debounced search for TanStack Query
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page to 1 when search changes
    }, searchDebounceMs);
    return () => clearTimeout(handler);
  }, [search, searchDebounceMs]);

  // Sync state values to URL search parameters
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const current = new URLSearchParams(window.location.search);

    // Sync page
    if (page > 1) current.set("page", String(page));
    else current.delete("page");

    // Sync pageSize
    if (pageSize !== initialPageSize) current.set("pageSize", String(pageSize));
    else current.delete("pageSize");

    // Sync search
    if (debouncedSearch) current.set("search", debouncedSearch);
    else current.delete("search");

    // Sync sorting
    if (sorting.length > 0) {
      const sortingStr = sorting.map((s) => `${s.id}.${s.desc ? "desc" : "asc"}`).join(",");
      current.set("sorting", sortingStr);
    } else {
      current.delete("sorting");
    }

    // Sync trashed
    if (trashed) current.set("trashed", "true");
    else current.delete("trashed");

    const queryString = current.toString();
    const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

    // Only update if search has actually changed to avoid loop
    if (window.location.search !== `?${queryString}` && (window.location.search || queryString)) {
      window.history.replaceState({ ...window.history.state }, "", nextUrl);
    }
  }, [page, pageSize, debouncedSearch, sorting, trashed, initialPageSize]);

  // Listen to browser Back/Forward navigation changes (popstate) to keep local states synchronized
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);

      const p = params.get("page");
      setPage(p ? Math.max(1, parseInt(p, 10)) : 1);

      const ps = params.get("pageSize");
      setPageSize(ps ? parseInt(ps, 10) : initialPageSize);

      const s = params.get("sorting");
      if (s) {
        try {
          setSorting(s.split(",").map((item) => {
            const parts = item.split(".");
            const id = parts[0] || "";
            return { id, desc: parts[1] === "desc" };
          }));
        } catch {
          setSorting(initialSorting);
        }
      } else {
        setSorting(initialSorting);
      }

      setSearch(params.get("search") || "");
      setTrashed(params.get("trashed") === "true");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialPageSize, initialSorting]);

  const activeParams: TableQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
    sorting,
    trashed,
  };

  const queryResult = useQuery({
    queryKey: [...queryKey, page, pageSize, debouncedSearch, sorting, trashed],
    queryFn: () => queryFn(activeParams),
    enabled,
    placeholderData: keepPreviousData, // keeps stale data visible while fetching next page
  });

  const handlePageChange = React.useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = React.useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleSortingChange = React.useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting((old) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue;
        return next;
      });
      setPage(1);
    },
    []
  );

  const handleTrashedChange = React.useCallback((value: boolean) => {
    setTrashed(value);
    setPage(1);
  }, []);

  return {
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
    enableTrashed,
    trashed,
    onTrashedChange: handleTrashedChange,
    queryResult,
    refetch: () => { void queryResult.refetch(); },
    currentParams: activeParams,
  };
}
