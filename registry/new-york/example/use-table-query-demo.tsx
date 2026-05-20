"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DataTable,
  createColumnHelper,
  selectionColumn,
  indexColumn,
  rowActionsColumn,
} from "@/components/micto/data-table";
import { useTableQuery } from "@/hooks/use-table-query";
import type { TableQueryParams, TableQueryResult } from "@/registry/new-york/hooks/use-table-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Plus, RefreshCw } from "lucide-react";
import type { CellContext } from "@tanstack/react-table";

// --- Mock Data Database --------------------------------------------------------

type Employee = {
  id: string;
  employeeNo: string;
  name: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "on-leave";
  isDeleted?: boolean;
};

const DATABASE_EMPLOYEES: Employee[] = [
  { id: "1", employeeNo: "EMP-001", name: "Nehry Dedoro",    department: "ICT",         position: "Lead Architect",    status: "active" },
  { id: "2", employeeNo: "EMP-002", name: "Reyna Garcia",    department: "Finance",     position: "Budget Officer",    status: "active" },
  { id: "3", employeeNo: "EMP-003", name: "Mark Alvarez",    department: "HR",          position: "HRMO",              status: "on-leave" },
  { id: "4", employeeNo: "EMP-004", name: "Clara Bautista",  department: "Engineering", position: "Civil Engineer",    status: "active" },
  { id: "5", employeeNo: "EMP-005", name: "Jose Reyes",      department: "ICT",         position: "Systems Analyst",   status: "inactive" },
  { id: "6", employeeNo: "EMP-006", name: "Maria Santos",    department: "Admin",       position: "Admin Assistant",   status: "active" },
  { id: "7", employeeNo: "EMP-007", name: "Pedro Lim",       department: "Finance",     position: "Accountant II",     status: "active" },
  { id: "8", employeeNo: "EMP-008", name: "Ana Flores",      department: "HR",          position: "Payroll Officer",   status: "on-leave" },
  { id: "9", employeeNo: "EMP-009", name: "Carlo Mendoza",   department: "Engineering", position: "Utility Worker",    status: "active" },
  { id: "10", employeeNo: "EMP-010", name: "Luz Villanueva", department: "Admin",       position: "Records Officer",   status: "inactive" },
  { id: "11", employeeNo: "EMP-011", name: "Ryan Dela Cruz", department: "ICT",         position: "IT Support",        status: "active" },
  { id: "12", employeeNo: "EMP-012", name: "Grace Tan",      department: "Finance",     position: "Cashier",           status: "active" },
  { id: "13", employeeNo: "EMP-050", name: "Rico Manalo",    department: "Admin",       position: "Clerk III",         status: "inactive", isDeleted: true },
  { id: "14", employeeNo: "EMP-051", name: "Dolores Cruz",   department: "Finance",     position: "Bookkeeper",        status: "inactive", isDeleted: true },
  { id: "15", employeeNo: "EMP-052", name: "Felix Ramos",    department: "Engineering", position: "Foreman",           status: "inactive", isDeleted: true },
];

// --- Status Badge -------------------------------------------------------------

const STATUS_STYLES: Record<Employee["status"], string> = {
  active:   "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  inactive: "bg-zinc-500/10 border-zinc-500/20 text-zinc-500",
  "on-leave": "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
};

function StatusBadge({ status }: { status: Employee["status"] }) {
  return (
    <Badge variant="outline" className={`text-[10px] py-0.5 px-2 font-semibold capitalize ${STATUS_STYLES[status]}`}>
      {status.replace("-", " ")}
    </Badge>
  );
}

// --- Columns ------------------------------------------------------------------

const col = createColumnHelper<Employee>();

const columns = [
  selectionColumn<Employee>(),
  indexColumn<Employee>(),
  col.accessor("employeeNo", {
    header: "Emp. No.",
    cell: (info: CellContext<Employee, string>) => (
      <span className="font-mono text-xs text-muted-foreground">{info.row.original.employeeNo}</span>
    ),
  }),
  col.accessor("name", {
    header: "Full Name",
    cell: (info: CellContext<Employee, string>) => (
      <span className="font-medium text-foreground">{info.row.original.name}</span>
    ),
  }),
  col.accessor("department", { header: "Department" }),
  col.accessor("position",   { header: "Position" }),
  col.accessor("status", {
    header: "Status",
    enableSorting: false,
    cell: (info: CellContext<Employee, Employee["status"]>) => (
      <StatusBadge status={info.row.original.status} />
    ),
  }),
  rowActionsColumn<Employee>({
    actions: () => [
      { label: "View Profile", icon: Eye,    onClick: (r: Employee) => alert(`Viewing ${r.name}`) },
      { label: "Edit",         icon: Pencil, onClick: (r: Employee) => alert(`Editing ${r.name}`) },
      { label: "Delete",       icon: Trash2, variant: "destructive", onClick: (r: Employee) => alert(`Deleting ${r.name}`) },
    ],
  }),
];

// --- Simulated Server-Side Fetcher --------------------------------------------

async function fetchEmployees(params: TableQueryParams): Promise<TableQueryResult<Employee>> {
  // Simulate network latency (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  let data = DATABASE_EMPLOYEES.filter((e) => !!e.isDeleted === params.trashed);

  // Search filter
  if (params.search) {
    const q = params.search.toLowerCase();
    data = data.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.employeeNo.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (params.sorting && params.sorting.length > 0) {
    const sort = params.sorting[0];
    if (sort) {
      const key = sort.id as keyof Employee;
      data.sort((a, b) => {
        const valA = String(a[key] ?? "");
        const valB = String(b[key] ?? "");
        const comp = valA.localeCompare(valB, undefined, { numeric: true });
        return sort.desc ? -comp : comp;
      });
    }
  }

  // Pagination calculation
  const totalCount = data.length;
  const totalPages = Math.ceil(totalCount / params.pageSize) || 1;
  const page = Math.min(params.page, totalPages);
  const start = (page - 1) * params.pageSize;
  const paginatedData = data.slice(start, start + params.pageSize);

  return {
    data: paginatedData,
    totalPages,
    totalCount,
    currentPage: page,
  };
}

// --- Query Client Wrapper -----------------------------------------------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function TableContainer() {
  const table = useTableQuery<Employee>({
    queryKey: ["employees-server-demo"],
    queryFn: fetchEmployees,
    columns,
    tableId: "demo-use-table-query",
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 20],
    enableTrashed: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            Server-Side Federated DataTable Demo
          </h4>
          <p className="text-xs text-muted-foreground">
            Interactive table with reactive search param bindings. Try sorting, search, or pagination and refresh the page!
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs"
          onClick={() => table.refetch()}
          disabled={table.isFetching}
        >
          <RefreshCw className={`size-3.5 ${table.isFetching ? "animate-spin" : ""}`} />
          Force Refetch
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <DataTable<Employee>
          {...table}
          enableRowSelection
          enableColumnVisibility
          searchPlaceholder="Search employees (server-side)..."
          toolbarProps={{
            actions: (
              <Button size="sm" className="h-8 text-xs gap-1">
                <Plus className="size-3.5" />
                Add Record
              </Button>
            ),
          }}
        />
      </div>
    </div>
  );
}

export default function UseTableQueryDemo() {
  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={
        <div className="h-64 flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
          <RefreshCw className="size-5 animate-spin text-primary" />
          <span>Loading interactive demo...</span>
        </div>
      }>
        <TableContainer />
      </React.Suspense>
    </QueryClientProvider>
  );
}
