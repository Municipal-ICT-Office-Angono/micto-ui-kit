"use client";
"use no memo";

/**
 * @title Data Table
 * @description A fully-featured, generic data table built on TanStack Table v8. Supports server/client pagination, sorting, search, and visibility.
 * @categories react, component, table
 */
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Table, VisibilityState } from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  Archive,
  ArchiveRestore,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";
import { ServerPagination } from "@/components/micto/server-pagination";
import { TableToolbar } from "@/components/micto/table-toolbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function setRef<T>(
  ref: React.RefObject<T> | React.MutableRefObject<T> | null | undefined,
  value: T,
) {
  if (ref && "current" in ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function isSortingEqual(a: SortingState, b: SortingState) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i]?.id !== b[i]?.id || a[i]?.desc !== b[i]?.desc) {
      return false;
    }
  }

  return true;
}

const DEFAULT_SORTING: SortingState = [];

function isSelectionEqual<T>(a: T[], b: T[]) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

export { createColumnHelper } from "@tanstack/react-table";
export type { ColumnDef, PaginationState, Row, SortingState, VisibilityState };

export interface RowAction<TData> {
  label: string;
  icon?: React.ElementType;
  variant?: "default" | "destructive";
  onClick: (row: TData) => void;
  hidden?: boolean;
  disabled?: boolean;
  separator?: boolean;
}

export interface DataTableToolbarProps<TData> {
  filters?: React.ReactNode;
  activeFiltersCount?: number;
  actions?: React.ReactNode;
  bulkActions?: React.ReactNode | ((selectedRows: TData[]) => React.ReactNode); // resolved before render
  toolbarVariant?: "inline" | "floating";
}

export interface DataTableProps<TData, TValue = any> {
  // Core
  data: TData[];
  columns: ColumnDef<TData, TValue>[];

  // Identity (localStorage key)
  tableId?: string;

  // Loading & Empty
  isLoading?: boolean;
  loadingRowCount?: number;
  emptyState?: React.ReactNode;

  // Toolbar
  enableToolbar?: boolean;
  toolbar?: React.ReactNode | false;
  toolbarProps?: DataTableToolbarProps<TData>;

  // Search
  enableSearch?: boolean;
  searchPlaceholder?: string;
  initialSearch?: string;
  onSearchChange?: (value: string) => void;

  // Pagination
  pagination?: false | "client" | "server";
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;

  // Sorting
  enableSorting?: boolean;
  manualSorting?: boolean;
  initialSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  // Column Visibility
  enableColumnVisibility?: boolean;
  initialColumnVisibility?: VisibilityState;

  // Row Selection
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  onRowSelectionChange?: (rows: TData[]) => void;

  // Trashed / Soft-Delete Filter
  enableTrashed?: boolean;
  trashed?: boolean;
  onTrashedChange?: (trashed: boolean) => void;
  trashedLabel?: string;
  trashedActiveLabel?: string;

  // Interactions
  onRowClick?: (
    row: TData,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
  onCellClick?: (
    value: unknown,
    columnId: string,
    row: TData,
    event: React.MouseEvent<HTMLTableCellElement>,
  ) => void;

  // Presentation
  density?: "compact" | "default" | "comfortable";
  stickyHeader?: boolean;
  className?: string;
  tableClassName?: string;

  // Advanced
  tableRef?: React.RefObject<Table<TData> | null>;
}

export interface UseDataTableOptions<TData, TValue = any> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  tableId?: string;
  pageSize?: number;
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  initialColumnVisibility?: VisibilityState;
  initialSorting?: SortingState;
  initialSearch?: string;
}

const visibilitySchema = z.record(z.string(), z.boolean());

function loadVisibility(tableId: string): VisibilityState {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(`micto-dt-visibility-${tableId}`);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    const result = visibilitySchema.safeParse(parsed);

    return result.success ? result.data : {};
  } catch {
    return {};
  }
}

function saveVisibility(tableId: string, state: VisibilityState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      `micto-dt-visibility-${tableId}`,
      JSON.stringify(state),
    );
  } catch {
    // Ignore storage errors
  }
}

export function useDataTable<TData>({
  data,
  columns,
  tableId,
  pageSize = 10,
  pageCount,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  enableRowSelection = false,
  initialColumnVisibility = {},
  initialSorting = [],
  initialSearch = "",
}: UseDataTableOptions<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState(initialSearch);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const persistedVisibility = React.useMemo(
    () => (tableId ? loadVisibility(tableId) : {}),
    [tableId],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      ...initialColumnVisibility,
      ...persistedVisibility,
    });

  // Persist visibility changes
  React.useEffect(() => {
    if (tableId) {
      saveVisibility(tableId, columnVisibility);
    }
  }, [tableId, columnVisibility]);

  // Sync search input with parent prop
  React.useEffect(() => {
    setGlobalFilter(initialSearch || "");
  }, [initialSearch]);

  // suppress warning
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      columnVisibility,
      pagination,
    },
    // Only pass pageCount in manual mode, in client mode TanStack calculates it from data
    ...(manualPagination ? { pageCount: pageCount ?? -1 } : {}),
    manualPagination,
    manualSorting,
    manualFiltering,
    enableRowSelection: enableRowSelection as boolean,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getSelectedRowModel().rows;
  const selectedRows = React.useMemo(() => rows.map((r) => r.original), [rows]);

  return {
    table,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    pagination,
    rowSelection,
    selectedRows,
    columnVisibility,
  };
}

// Column Factories

export function selectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "__select__",
    size: 40,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(v: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!v)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v: boolean | "indeterminate") =>
          row.toggleSelected(!!v)
        }
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          e.stopPropagation()
        }
        aria-label="Select row"
      />
    ),
  };
}

export function indexColumn<TData>(options?: {
  header?: string;
}): ColumnDef<TData, unknown> {
  return {
    id: "__index__",
    size: 50,
    enableSorting: false,
    enableHiding: false,
    header: () => (
      <span className="text-muted-foreground">{options?.header ?? "#"}</span>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.index + 1}
      </span>
    ),
  };
}

export function rowActionsColumn<TData>(options: {
  actions: (row: TData) => RowAction<TData>[];
}): ColumnDef<TData, unknown> {
  return {
    id: "__actions__",
    size: 50,
    enableSorting: false,
    enableHiding: false,
    header: () => null,
    cell: ({ row }) => {
      const acts = options.actions(row.original).filter((a) => !a.hidden);

      if (!acts.length) {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 data-[state=open]:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-36">
            {acts.map((action, i) => (
              <React.Fragment key={i}>
                {action.separator && i > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  disabled={action.disabled}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    action.onClick(row.original);
                  }}
                  className={cn(
                    "gap-2",
                    action.variant === "destructive" &&
                      "text-destructive focus:bg-destructive/10 focus:text-destructive",
                  )}
                >
                  {action.icon && <action.icon className="h-3.5 w-3.5" />}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}

// Internal Sub-components

const DENSITY_CELL: Record<string, string> = {
  compact: "py-1.5 px-3 text-xs",
  default: "py-2.5 px-4 text-sm",
  comfortable: "py-4 px-4 text-sm",
};

const DENSITY_HEAD: Record<string, string> = {
  compact: "py-2 px-3 text-xs",
  default: "py-3 px-4 text-xs",
  comfortable: "py-3.5 px-4 text-xs",
};

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") {
    return <ArrowUp className="h-3.5 w-3.5 text-foreground" />;
  }

  if (sorted === "desc") {
    return <ArrowDown className="h-3.5 w-3.5 text-foreground" />;
  }

  return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
}

function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No results found</p>
      <p className="text-xs text-muted-foreground">
        Try adjusting your search or filters.
      </p>
    </div>
  );
}

// DataTable Component

export function DataTable<TData, TValue = any>({
  data,
  columns,
  tableId,
  isLoading = false,
  loadingRowCount = 5,
  emptyState,
  enableToolbar = true,
  toolbar,
  toolbarProps,
  enableSearch = true,
  searchPlaceholder = "Search...",
  initialSearch = "",
  onSearchChange,
  pagination: paginationMode = "client",
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  pageSize: initialPageSize = 10,
  pageSizeOptions,
  onPageSizeChange,
  enableSorting = true,
  manualSorting = false,
  initialSorting = DEFAULT_SORTING,
  onSortingChange,
  enableColumnVisibility = false,
  initialColumnVisibility,
  enableRowSelection = false,
  onRowSelectionChange,
  enableTrashed = false,
  trashed: controlledTrashed,
  onTrashedChange,
  trashedLabel = "Show Trashed",
  trashedActiveLabel = "Viewing Trashed",
  onRowClick,
  onCellClick,
  density = "default",
  stickyHeader = false,
  className,
  tableClassName,
  tableRef,
}: DataTableProps<TData, TValue>) {
  const isServerPagination = paginationMode === "server";

  // Trashed toggle state (uncontrolled fallback if no controlled prop)
  const [internalTrashed, setInternalTrashed] = React.useState(false);
  const isTrashed = controlledTrashed ?? internalTrashed;
  const handleTrashedToggle = () => {
    const next = !isTrashed;
    setInternalTrashed(next);
    onTrashedChange?.(next);
  };

  const serverPageCount =
    isServerPagination && totalPages ? totalPages : undefined;

  const {
    table,
    globalFilter,
    setGlobalFilter,
    selectedRows,
    pagination,
    setSorting,
  } = useDataTable<TData>({
    data,
    columns,
    tableId,
    pageSize: initialPageSize,
    pageCount: serverPageCount,
    manualPagination: isServerPagination,
    manualSorting,
    enableRowSelection,
    initialColumnVisibility,
    initialSorting,
    initialSearch,
  });

  // Forward table ref
  React.useEffect(() => {
    setRef(tableRef, table);
  }, [table, tableRef]);

  // Notify parent of selection changes
  const onRowSelectionChangeRef = React.useRef(onRowSelectionChange);
  React.useEffect(() => {
    onRowSelectionChangeRef.current = onRowSelectionChange;
  });

  const prevSelectedRef = React.useRef<TData[]>([]);
  React.useEffect(() => {
    if (
      onRowSelectionChangeRef.current &&
      !isSelectionEqual(prevSelectedRef.current, selectedRows)
    ) {
      onRowSelectionChangeRef.current(selectedRows);
      prevSelectedRef.current = selectedRows;
    }
  }, [selectedRows]);

  // Notify parent of sort changes
  const onSortingChangeRef = React.useRef(onSortingChange);
  React.useEffect(() => {
    onSortingChangeRef.current = onSortingChange;
  });

  const currentSorting = table.getState().sorting;
  const prevSortingRef = React.useRef(currentSorting);

  React.useEffect(() => {
    if (!isSortingEqual(currentSorting, prevSortingRef.current)) {
      prevSortingRef.current = currentSorting;
      onSortingChangeRef.current?.(currentSorting);
    }
  }, [currentSorting]);

  // Sync sorting state with prop
  const prevInitialSortingRef = React.useRef(initialSorting);
  React.useEffect(() => {
    if (!isSortingEqual(initialSorting, prevInitialSortingRef.current)) {
      setSorting(initialSorting);
      prevInitialSortingRef.current = initialSorting;
      prevSortingRef.current = initialSorting;
    }
  }, [initialSorting, setSorting]);

  // Debounced search
  const searchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (value: string) => {
    setGlobalFilter(value);

    if (onSearchChange) {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }

      searchTimer.current = setTimeout(() => onSearchChange(value), 300);
    }
  };

  // Server page change
  const handleServerPageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Computed values
  const activePage = isServerPagination
    ? (currentPage ?? 1)
    : pagination.pageIndex + 1;
  const activeTotalPages = isServerPagination
    ? Math.max(1, totalPages ?? 1)
    : Math.max(1, table.getPageCount());
  const showPagination = paginationMode !== false;
  const showToolbar = enableToolbar && toolbar !== false;

  const resolvedBulkActions: React.ReactNode =
    toolbarProps?.bulkActions && typeof toolbarProps.bulkActions === "function"
      ? toolbarProps.bulkActions(selectedRows)
      : (toolbarProps?.bulkActions as React.ReactNode);

  // Search input node (shared between toolbar and standalone)
  const searchNode = enableSearch ? (
    <div className="relative flex w-full shrink-0 items-center sm:w-auto">
      <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        placeholder={searchPlaceholder}
        value={globalFilter}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-8 w-full pl-8 text-xs focus-visible:ring-1 sm:w-64"
      />
      {globalFilter && (
        <button
          onClick={() => handleSearch("")}
          className="absolute right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  ) : null;

  // Column visibility toggle node
  const columnToggleNode = enableColumnVisibility ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden text-xs sm:inline">Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              className="text-xs capitalize"
              checked={col.getIsVisible()}
              onCheckedChange={(v: boolean | "indeterminate") =>
                col.toggleVisibility(!!v)
              }
            >
              {typeof col.columnDef.header === "string"
                ? col.columnDef.header
                : col.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  // Trashed toggle node
  const trashedToggleNode = enableTrashed ? (
    <Button
      variant={isTrashed ? "default" : "outline"}
      size="sm"
      className={cn(
        "h-8 gap-1.5 text-xs transition-all",
        isTrashed &&
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive",
      )}
      onClick={handleTrashedToggle}
    >
      {isTrashed ? (
        <>
          <ArchiveRestore className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{trashedActiveLabel}</span>
          <X className="ml-0.5 h-3 w-3 opacity-60" />
        </>
      ) : (
        <>
          <Archive className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{trashedLabel}</span>
        </>
      )}
    </Button>
  ) : null;

  // Build toolbar
  const toolbarNode = showToolbar
    ? (toolbar ?? (
        <TableToolbar
          selectedCount={selectedRows.length}
          onClearSelection={() => table.resetRowSelection()}
          variant={toolbarProps?.toolbarVariant ?? "inline"}
          search={searchNode}
          filters={toolbarProps?.filters}
          activeFiltersCount={toolbarProps?.activeFiltersCount}
          actions={
            <>
              {trashedToggleNode}
              {columnToggleNode}
              {toolbarProps?.actions}
            </>
          }
          bulkActions={resolvedBulkActions}
        />
      ))
    : null;

  // Rows to render
  const rows = table.getRowModel().rows;
  const visibleCols = table.getVisibleLeafColumns();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Toolbar */}
      {toolbarNode}

      {/* Trashed indicator banner */}
      {enableTrashed && isTrashed && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs">
          <Archive className="h-3.5 w-3.5 shrink-0 text-destructive" />
          <span className="font-medium text-destructive">
            Showing trashed records
          </span>
          <button
            onClick={handleTrashedToggle}
            className="font-medium text-primary hover:underline"
          >
            Show Active Records
          </button>
        </div>
      )}

      {/* Table */}
      <div
        className={cn(
          "overflow-hidden rounded-md border bg-background",
          tableClassName,
        )}
      >
        <div className={cn(stickyHeader && "max-h-150 overflow-auto")}>
          <ShadTable>
            <TableHeader
              className={cn(stickyHeader && "sticky top-0 z-10 bg-background")}
            >
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-b hover:bg-transparent">
                  {hg.headers.map((header) => {
                    const canSort = enableSorting && header.column.getCanSort();
                    const sorted = header.column.getIsSorted();

                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          DENSITY_HEAD[density],
                          "font-semibold text-muted-foreground",
                        )}
                        style={{
                          width: header.column.columnDef.size,
                        }}
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            <SortIcon sorted={sorted} />
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {/* Loading Skeletons */}
              {isLoading ? (
                Array.from({ length: loadingRowCount }).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    {visibleCols.map((col) => (
                      <TableCell key={col.id} className={DENSITY_CELL[density]}>
                        {col.id === "__select__" ? (
                          <Skeleton className="h-4 w-4 rounded" />
                        ) : col.id === "__actions__" ? (
                          <Skeleton className="h-7 w-7 rounded" />
                        ) : (
                          <Skeleton className="h-4 w-3/4" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={
                      onRowClick
                        ? (e) => onRowClick(row.original, e)
                        : undefined
                    }
                    className={cn(
                      "transition-colors",
                      onRowClick && "cursor-pointer hover:bg-muted/40",
                      row.getIsSelected() && "bg-primary/3",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={DENSITY_CELL[density]}
                        onClick={
                          onCellClick
                            ? (e) => {
                                if (
                                  cell.column.id !== "__select__" &&
                                  cell.column.id !== "__actions__"
                                ) {
                                  onCellClick(
                                    cell.getValue(),
                                    cell.column.id,
                                    row.original,
                                    e,
                                  );
                                }
                              }
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={visibleCols.length} className="p-0">
                    {emptyState ?? <DefaultEmptyState />}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ShadTable>
        </div>
      </div>

      {/* Footer: Pagination + Page Size */}
      {showPagination && (
        <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
          {/* Count label */}
          <p className="shrink-0 text-xs text-muted-foreground">
            {totalCount != null
              ? `Showing ${rows.length} of ${totalCount} result${totalCount !== 1 ? "s" : ""}`
              : !isServerPagination
                ? `Page ${activePage} of ${activeTotalPages}`
                : null}
          </p>

          {/* ServerPagination from the kit */}
          <ServerPagination
            currentPage={activePage}
            totalPages={activeTotalPages}
            size="icon"
            position="center"
            onPageChange={(page: number) => {
              if (isServerPagination) {
                handleServerPageChange(page);
              } else {
                table.setPageIndex(page - 1);
              }
            }}
          />

          {/* Page size selector */}
          {pageSizeOptions && (
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Rows per page
              </span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(v: string) => {
                  const size = Number(v);
                  table.setPageSize(size);

                  if (onPageSizeChange) {
                    onPageSizeChange(size);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" side="top">
                  {pageSizeOptions.map((s) => (
                    <SelectItem key={s} value={String(s)} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
