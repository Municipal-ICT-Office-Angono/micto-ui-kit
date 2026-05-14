"use client";

import * as React from "react";
import { useQuery, UseQueryResult, keepPreviousData } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";

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
  queryKey: unknown[];
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
  onSortingChange: (sorting: SortingState) => void;
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
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [trashed, setTrashed] = React.useState(false);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 when search changes
    }, searchDebounceMs);
    return () => clearTimeout(timer);
  }, [search, searchDebounceMs]);

  // Reset to page 1 when sorting changes
  React.useEffect(() => {
    setPage(1);
  }, [sorting]);

  // Reset to page 1 when trashed changes
  React.useEffect(() => {
    setPage(1);
  }, [trashed]);

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

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1); // Reset to first page on size change
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    // actual debounced reset happens in the useEffect above
  };

  const handleTrashedChange = (value: boolean) => {
    setTrashed(value);
  };

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
    onPageChange: setPage,
    onPageSizeChange: handlePageSizeChange,
    onSearchChange: handleSearchChange,
    manualSorting: true,
    onSortingChange: setSorting,
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
