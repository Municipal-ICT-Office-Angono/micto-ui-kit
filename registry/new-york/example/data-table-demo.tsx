"use client";

import * as React from "react";
import {
  DataTable,
  createColumnHelper,
  selectionColumn,
  indexColumn,
  rowActionsColumn,
} from "@/components/micto/data-table";
import type { CellContext } from "@tanstack/react-table";
import { ToolbarAction } from "@/components/micto/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Plus, Download, UserX } from "lucide-react";

// --- Mock Data ----------------------------------------------------------------

type Employee = {
  id: string;
  employeeNo: string;
  name: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "on-leave";
};

const MOCK_EMPLOYEES: Employee[] = [
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
];

const TRASHED_EMPLOYEES: Employee[] = [
  { id: "t1", employeeNo: "EMP-050", name: "Rico Manalo",    department: "Admin",       position: "Clerk III",         status: "inactive" },
  { id: "t2", employeeNo: "EMP-051", name: "Dolores Cruz",   department: "Finance",     position: "Bookkeeper",        status: "inactive" },
  { id: "t3", employeeNo: "EMP-052", name: "Felix Ramos",    department: "Engineering", position: "Foreman",           status: "inactive" },
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

// --- Column Definitions -------------------------------------------------------

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
      { label: "Deactivate",   icon: UserX,  onClick: (r: Employee) => alert(`Deactivating ${r.name}`), separator: true },
      { label: "Delete",       icon: Trash2, variant: "destructive", onClick: (r: Employee) => alert(`Deleting ${r.name}`) },
    ],
  }),
];

// --- Demo: Flat (No Pagination, No Toolbar) -----------------------------------

const FLAT_COLUMNS = [
  indexColumn<Employee>(),
  col.accessor("name",       { header: "Name" }),
  col.accessor("department", { header: "Department" }),
  col.accessor("status", {
    header: "Status",
    enableSorting: false,
    cell: (info: CellContext<Employee, Employee["status"]>) => (
      <StatusBadge status={info.row.original.status} />
    ),
  }),
];

// --- Main Demo ----------------------------------------------------------------

export default function DataTableDemo() {
  const [selectedEmployees, setSelectedEmployees] = React.useState<Employee[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTrashed, setIsTrashed] = React.useState(false);

  const tableData = isTrashed ? TRASHED_EMPLOYEES : MOCK_EMPLOYEES;

  const simulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 space-y-10">

      {/* -- SECTION 1: Full featured -- */}
      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold">Full-Featured Table</h3>
          <p className="text-xs text-muted-foreground">
          Row selection · Sorting · Search · Column visibility · Page size · Bulk actions · Trashed toggle
          </p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={simulateLoad}>
            Simulate Loading
          </Button>
        </div>

        <DataTable<Employee>
          data={tableData}
          columns={columns}
          tableId="demo-employees"
          isLoading={isLoading}
          enableSearch
          searchPlaceholder="Search employees..."
          enableRowSelection
          enableColumnVisibility
          enableSorting
          enableTrashed
          trashed={isTrashed}
          onTrashedChange={setIsTrashed}
          pagination="client"
          pageSize={5}
          pageSizeOptions={[5, 10, 25]}
          density="default"
          onRowSelectionChange={setSelectedEmployees}
          onRowClick={(emp: Employee) => console.log("Row clicked:", emp)}
          toolbarProps={{
            actions: (
              <>
                <ToolbarAction icon={Download}>Export</ToolbarAction>
                <ToolbarAction icon={Plus} variant="default">Add Employee</ToolbarAction>
              </>
            ),
            bulkActions: (selected: Employee[]) => (
              <ToolbarAction icon={Trash2} variant="destructive">
                Delete {selected.length} Selected
              </ToolbarAction>
            ),
          }}
        />

        {selectedEmployees.length > 0 && (
          <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
            selected: [{selectedEmployees.map((e) => e.name).join(", ")}]
          </p>
        )}
      </section>

      {/* -- SECTION 2: Flat / No Pagination -- */}
      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold">Flat Table (No Pagination)</h3>
          <p className="text-xs text-muted-foreground">
            Simple, compact display for small datasets. No toolbar, no footer.
          </p>
        </div>

        <DataTable<Employee>
          data={MOCK_EMPLOYEES.slice(0, 5)}
          columns={FLAT_COLUMNS}
          pagination={false}
          enableSearch={false}
          toolbar={false}
          density="compact"
        />
      </section>

      {/* -- SECTION 3: Search-only toolbar (no bulk actions) -- */}
      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold">Simple Filtered Table</h3>
          <p className="text-xs text-muted-foreground">
            Search-only toolbar, client pagination, no selection.
          </p>
        </div>

        <DataTable<Employee>
          data={MOCK_EMPLOYEES}
          columns={FLAT_COLUMNS}
          enableSearch
          searchPlaceholder="Filter employees..."
          pagination="client"
          pageSize={4}
          density="default"
        />
      </section>

    </div>
  );
}

