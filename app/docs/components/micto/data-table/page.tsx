import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import DataTableDemo from "@/registry/new-york/example/data-table-demo";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/data-table.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/data-table.json",
  },
];


const basicUsageCode = `import {
  DataTable,
  createColumnHelper,
  selectionColumn,
  rowActionsColumn,
} from "@/components/micto/data-table"
import { ToolbarAction } from "@/components/micto/table-toolbar"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, Plus } from "lucide-react"

type Employee = { id: string; name: string; department: string }

const col = createColumnHelper<Employee>()

const columns = [
  selectionColumn<Employee>(),
  col.accessor("name", { header: "Name" }),
  col.accessor("department", { header: "Department" }),
  rowActionsColumn<Employee>({
    actions: () => [
      { label: "View",   icon: Eye,    onClick: (r) => console.log(r) },
      { label: "Edit",   icon: Pencil, onClick: (r) => console.log(r) },
      { label: "Delete", icon: Trash2, variant: "destructive", onClick: (r) => console.log(r) },
    ],
  }),
]

const employees: Employee[] = [
  { id: "1", name: "Juan Dela Cruz", department: "ICT" },
  { id: "2", name: "Maria Clara", department: "HR" },
]

export default function EmployeesPage() {
  return (
    <DataTable
      data={employees}
      columns={columns}
      tableId="employees"
      enableRowSelection
      enableColumnVisibility
      pagination="client"
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      toolbarProps={{
        actions: (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        ),
        bulkActions: (rows) => (
          <ToolbarAction icon={Trash2} variant="destructive">
            Delete {rows.length}
          </ToolbarAction>
        ),
      }}
    />
  )
}`;

const flatUsageCode = `import { DataTable } from "@/components/micto/data-table"

type Deduction = { name: string; amount: number }

const deductions: Deduction[] = [
  { name: "SSS", amount: 500 },
  { name: "PhilHealth", amount: 250 },
]

const deductionColumns = [
  { accessorKey: "name", header: "Deduction Name" },
  { accessorKey: "amount", header: "Amount" },
]

export default function FlatTable() {
  return (
    <DataTable
      data={deductions}
      columns={deductionColumns}
      pagination={false}
      toolbar={false}
      density="compact"
    />
  )
}`;

const serverUsageCode = `import * as React from "react"
import { DataTable, ColumnDef, SortingState } from "@/components/micto/data-table"

type User = { id: string; name: string; email: string }

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
]

export default function ServerPaginatedTable() {
  const [data, setData] = React.useState<User[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [search, setSearch] = React.useState("")

  // Trigger data fetching in your component using page, pageSize, sorting, search...

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      pagination="server"
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
      onPageChange={setPage}
      pageSize={pageSize}
      pageSizeOptions={[10, 25, 50]}
      onPageSizeChange={setPageSize}
      manualSorting
      onSortingChange={setSorting}
      onSearchChange={setSearch} // debounced 300ms, fires your API
    />
  )
}`;

const inertiaUsageCode = `import React from "react"
import { router } from "@inertiajs/react"
import {
  DataTable,
  createColumnHelper,
  indexColumn,
  rowActionsColumn,
} from "@/components/micto/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Pencil, Trash2 } from "lucide-react"

type Employee = {
  id: string;
  name: string;
  department: string;
  deleted_at: string | null;
}

const col = createColumnHelper<Employee>()
const columns = [
  indexColumn<Employee>(),
  col.accessor("name", { header: "Name" }),
  col.accessor("department", { header: "Department" }),
  rowActionsColumn<Employee>({
    actions: (row) => [
      { label: "View Profile", icon: Eye,    onClick: (r) => router.get(\`/employees/\${r.id}\`) },
      { label: "Edit",         icon: Pencil, onClick: (r) => router.get(\`/employees/\${r.id}/edit\`) },
      { label: "Delete",       icon: Trash2, variant: "destructive", onClick: (r) => router.delete(\`/employees/\${r.id}\`) },
    ],
  }),
]

export default function EmployeesIndex({ records, filters }: {
  records: { data: Employee[]; current_page: number; last_page: number; total: number };
  filters: { search?: string; sorting?: unknown; trashed?: string; pageSize?: number };
}) {
  // Helper to update Inertia URL params while preserving page state/scroll
  const updateQuery = (newParams: Record<string, unknown>) => {
    router.get(
      window.location.pathname,
      { ...filters, ...newParams },
      { preserveState: true, preserveScroll: true }
    )
  }

  return (
    <DataTable
      data={records.data}
      columns={columns}
      pagination="server"
      currentPage={records.current_page}
      totalPages={records.last_page}
      totalCount={records.total}
      pageSize={Number(filters.pageSize ?? 10)}
      pageSizeOptions={[10, 25, 50]}

      // Filter Handlers -> Triggers Inertia router.get()
      onPageChange={(page) => updateQuery({ page })}
      onPageSizeChange={(pageSize) => updateQuery({ pageSize, page: 1 })}
      onSearchChange={(search) => updateQuery({ search, page: 1 })}
      onSortingChange={(sorting) => updateQuery({ sorting, page: 1 })}

      // Trashed / Soft Delete Toggle
      enableTrashed={true}
      trashed={filters.trashed === "true"}
      onTrashedChange={(trashed) => updateQuery({ trashed, page: 1 })}

      toolbarProps={{
        actions: (
          <Button size="sm" className="h-8 text-xs" onClick={() => router.get("/employees/create")}>
            <Plus className="size-3.5 mr-1.5" />
            Add Employee
          </Button>
        ),
      }}
    />
  )
}`;

const columnFactoriesCode = `import {
  selectionColumn,   // checkbox with select-all
  indexColumn,       // row number (#)
  rowActionsColumn,  // ⋮ actions dropdown
  createColumnHelper,
} from "@/components/micto/data-table"
import { Eye, Pencil, UserX, Trash2 } from "lucide-react"

type Employee = {
  id: string
  name: string
  status: "active" | "inactive"
}

// Conceptual router & helper overrides
const router = {
  push: (path: string) => console.log("Navigate to", path),
}
const openEditModal = (employee: Employee) => console.log("Edit", employee)
const deactivate = (employee: Employee) => console.log("Deactivate", employee)
const deleteEmployee = (employee: Employee) => console.log("Delete", employee)

const col = createColumnHelper<Employee>()

const columns = [
  selectionColumn<Employee>(),
  indexColumn<Employee>({ header: "#" }),

  col.accessor("name", {
    header: "Full Name",
    cell: (info) => (
      <span className="font-medium">{info.row.original.name}</span>
    ),
  }),

  rowActionsColumn<Employee>({
    // actions receives the full row data object; use it to conditionally hide/disable
    actions: (row) => [
      { label: "View",       icon: Eye,    onClick: (r) => router.push(\`/employees/\${r.id}\`) },
      { label: "Edit",       icon: Pencil, onClick: (r) => openEditModal(r) },
      { label: "Deactivate", icon: UserX,  onClick: (r) => deactivate(r), separator: true },
      {
        label: "Delete",
        icon: Trash2,
        variant: "destructive",
        disabled: row.status === "inactive",
        onClick: (r) => deleteEmployee(r),
      },
    ],
  }),
]`;

const trashedUsageCode = `import * as React from "react"
import { DataTable, ColumnDef } from "@/components/micto/data-table"

type Employee = { id: string; name: string }

const columns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Name" },
]

const activeEmployees: Employee[] = [{ id: "1", name: "Juan Dela Cruz" }]
const trashedEmployees: Employee[] = [{ id: "2", name: "Maria Clara (Archived)" }]

export default function TrashedExample() {
  const [isTrashed, setIsTrashed] = React.useState(false)

  // In client mode, swap data. In server mode, pass trashed parameter to API query
  const currentData = isTrashed ? trashedEmployees : activeEmployees

  return (
    <DataTable
      data={currentData}
      columns={columns}
      enableTrashed
      trashed={isTrashed}
      onTrashedChange={setIsTrashed}
      trashedLabel="Show Trashed"
      trashedActiveLabel="Viewing Trashed"
    />
  )
}`;

// Props Tables

const coreProps = [
  { name: "data", type: "TData[]", default: "", description: "Array of row objects. Generic works with any shape." },
  { name: "columns", type: "ColumnDef<TData, any>[]", default: "", description: "TanStack Table column definitions. Use createColumnHelper or the built-in factories." },
  { name: "tableId", type: "string", default: "undefined", description: "Unique key for this table instance. When set, column visibility state is persisted to localStorage." },
  { name: "isLoading", type: "boolean", default: "false", description: "Renders skeleton rows matching the column layout instead of data rows." },
  { name: "loadingRowCount", type: "number", default: "5", description: "Number of skeleton placeholder rows shown during loading." },
  { name: "emptyState", type: "ReactNode", default: "built-in", description: "Custom zero-state content. Defaults to a search icon with 'No results found' message." },
];

const toolbarProps = [
  { name: "toolbar", type: "ReactNode | false", default: "undefined", description: "Full custom toolbar override. Pass false to hide the toolbar entirely." },
  { name: "toolbarProps.filters", type: "ReactNode", default: "undefined", description: "Extra filter controls placed left of the search input inside the built-in toolbar." },
  { name: "toolbarProps.actions", type: "ReactNode", default: "undefined", description: "Right-side action buttons (e.g. Add button) shown when no rows are selected." },
  { name: "toolbarProps.bulkActions", type: "ReactNode | (rows: TData[]) => ReactNode", default: "undefined", description: "Actions shown in the bulk tray when rows are selected. Receives selected rows when passed as a function." },
  { name: "toolbarProps.toolbarVariant", type: "'inline' | 'floating'", default: "'inline'", description: "Controls how the toolbar renders bulk actions morphing inline or as a floating dock." },
];

const searchProps = [
  { name: "enableSearch", type: "boolean", default: "true", description: "Shows the built-in global search input inside the toolbar." },
  { name: "searchPlaceholder", type: "string", default: "'Search...'", description: "Placeholder text for the search input." },
  { name: "onSearchChange", type: "(value: string) => void", default: "undefined", description: "Debounced (300ms) callback for server-side search. Client-side filtering is automatic when omitted." },
];

const paginationProps = [
  { name: "pagination", type: "false | 'client' | 'server'", default: "'client'", description: "false = no pagination. client = TanStack manages pages. server = you control state." },
  { name: "currentPage", type: "number", default: "undefined", description: "Active page number (1-indexed). Required in server mode." },
  { name: "totalPages", type: "number", default: "undefined", description: "Total number of pages. Required in server mode." },
  { name: "totalCount", type: "number", default: "undefined", description: "Total row count shown in the footer label." },
  { name: "onPageChange", type: "(page: number) => void", default: "undefined", description: "Called when the user navigates to a different page." },
  { name: "pageSize", type: "number", default: "10", description: "Initial number of rows per page." },
  { name: "pageSizeOptions", type: "number[]", default: "undefined", description: "If provided, renders a 'Rows per page' selector in the footer. Example: [10, 25, 50]." },
  { name: "onPageSizeChange", type: "(size: number) => void", default: "undefined", description: "Called when the user changes the rows-per-page selection." },
];

const interactionProps = [
  { name: "enableSorting", type: "boolean", default: "true", description: "Enables sortable column headers with sort direction icons." },
  { name: "manualSorting", type: "boolean", default: "false", description: "Set true for server-side sorting. Disables client-side sort logic." },
  { name: "onSortingChange", type: "(sorting: SortingState) => void", default: "undefined", description: "Called when sort state changes. Use with manualSorting to trigger server requests." },
  { name: "enableColumnVisibility", type: "boolean", default: "false", description: "Adds a 'Columns' toggle button to the toolbar for showing/hiding columns." },
  { name: "enableRowSelection", type: "boolean | (row) => boolean", default: "false", description: "Enables checkbox column. Pass a function to conditionally enable per row." },
  { name: "onRowSelectionChange", type: "(rows: TData[]) => void", default: "undefined", description: "Called whenever the row selection set changes. Receives full row objects." },
  { name: "onRowClick", type: "(row: TData, event) => void", default: "undefined", description: "Called when a row is clicked. Adds cursor-pointer and hover highlight. Ignored on checkbox/action cells." },
  { name: "onCellClick", type: "(value, columnId, row, event) => void", default: "undefined", description: "Called when a specific cell is clicked. Useful for clipboard copy or inline drill-down." },
];

const trashedProps = [
  { name: "enableTrashed", type: "boolean", default: "false", description: "Adds a 'Show Trashed' toggle button to the toolbar for viewing archived/soft-deleted records." },
  { name: "trashed", type: "boolean", default: "undefined", description: "Controlled trashed state. When omitted, internal state is managed automatically." },
  { name: "onTrashedChange", type: "(trashed: boolean) => void", default: "undefined", description: "Called when the user toggles the trashed filter. Server mode re-fetches data." },
  { name: "trashedLabel", type: "string", default: "'Show Trashed'", description: "Label for the inactive toggle button." },
  { name: "trashedActiveLabel", type: "string", default: "'Viewing Trashed'", description: "Label for the active tinted badge toggle." },
];

const presentationProps = [
  { name: "density", type: "'compact' | 'default' | 'comfortable'", default: "'default'", description: "Controls row height and font size. compact=xs padding, comfortable=relaxed padding." },
  { name: "stickyHeader", type: "boolean", default: "false", description: "Makes the table header sticky on scroll. Best for long tables inside a bounded container." },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes for the outer wrapper div." },
  { name: "tableClassName", type: "string", default: "undefined", description: "Additional CSS classes for the table container border/card." },
  { name: "tableRef", type: "React.RefObject<Table<TData>>", default: "undefined", description: "Ref forwarded to the raw TanStack Table instance for power user access." },
];


export default async function DataTablePage() {
  const previewRawCode = getCode("registry/new-york/example/data-table-demo.tsx");
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode, "tsx");
  const flatUsageHtml = await highlightCode(flatUsageCode, "tsx");
  const serverUsageHtml = await highlightCode(serverUsageCode, "tsx");
  const inertiaUsageHtml = await highlightCode(inertiaUsageCode, "tsx");
  const trashedUsageHtml = await highlightCode(trashedUsageCode, "tsx");
  const columnFactoriesHtml = await highlightCode(columnFactoriesCode, "tsx");

  const headerBadges = (
    <>
      <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider">
        React
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium">
        TanStack Table v8
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
        Generic
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Data Table"
        description="A fully-featured, generic data table built on TanStack Table v8. Supports server/client pagination, sorting, global search, column visibility with localStorage persistence, row selection, bulk actions, trashed/archived record filter toggle, and skeleton loading all opt-in."
        badges={headerBadges}
      />
      <div className="space-y-16">

        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Three variants shown: full-featured with selection and bulk actions, flat with no pagination, and a simple filtered list."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <DataTableDemo />
          </ComponentPreview>
        </section>

        {/* Features & Props Matrix */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Features & Props Matrix"
            description="Quick reference mapping of DataTable capabilities to their enabling properties and helpers."
          />
          <div className="rounded-xl border overflow-hidden shadow-sm bg-background">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-xs font-bold text-foreground/80 lowercase tracking-tight">Feature</th>
                  <th className="px-4 py-3 text-xs font-bold text-foreground/80 lowercase tracking-tight">Enabling Props / Helpers</th>
                  <th className="px-4 py-3 text-xs font-bold text-foreground/80 lowercase tracking-tight">Default</th>
                  <th className="px-4 py-3 text-xs font-bold text-foreground/80 lowercase tracking-tight">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Client-Side Pagination</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"pagination=\"client\""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{"\"client\""}</td>
                  <td className="px-4 py-3 text-muted-foreground">Automatic in-memory pagination handled by TanStack Table.</td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Server-Side Pagination</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"pagination=\"server\""}<br />
                    {"currentPage, totalPages, totalCount"}<br />
                    {"onPageChange, onPageSizeChange"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">-</td>
                  <td className="px-4 py-3 text-muted-foreground">Delegates pagination calculations to a database/API. Required for large datasets.</td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Client-Side Sorting</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"enableSorting={true}"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{"true"}</td>
                  <td className="px-4 py-3 text-muted-foreground">Interactive sorting by clicking column headers. Handled automatically in-memory.</td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Server-Side Sorting</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"manualSorting={true}"}<br />
                    {"onSortingChange"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{"false"}</td>
                  <td className="px-4 py-3 text-muted-foreground">Bypasses client-side sorting and triggers a callback when sorting state changes.</td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Global Search</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"enableSearch={true}"}<br />
                    {"onSearchChange"} (optional)
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{"true"}</td>
                  <td className="px-4 py-3 text-muted-foreground">Global filter input. If `onSearchChange` is provided, debounces input by 300ms for API queries.</td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Row Selection & Bulk Actions</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"enableRowSelection={true}"}<br />
                    {"selectionColumn<T>()"}<br />
                    {"toolbarProps.bulkActions"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{"false"}</td>
                  <td className="px-4 py-3 text-muted-foreground">Allows multi-row checking. Shows a contextual bulk actions tray (inline or floating).</td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Column Visibility Persistence</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"enableColumnVisibility={true}"}<br />
                    {"tableId=\"unique_key\""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{"false"}</td>
                  <td className="px-4 py-3 text-muted-foreground">Renders a columns dropdown toggle. Persists toggled state to `localStorage` keyed by `tableId`.</td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Soft-Delete (Trashed) Records</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"enableTrashed={true}"}<br />
                    {"trashed, onTrashedChange"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{"false"}</td>
                  <td className="px-4 py-3 text-muted-foreground">Toggles viewing archived or deleted items, displaying safety warning banners.</td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-semibold text-foreground">Skeleton Loading States</td>
                  <td className="px-4 py-3 font-mono text-primary/80">
                    {"isLoading={true}"}<br />
                    {"loadingRowCount={5}"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{"false"}</td>
                  <td className="px-4 py-3 text-muted-foreground">Renders skeleton animation placeholders instead of rows to reflect initial load state.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Installation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install the core DataTable component. The useTableQuery hook is a separate optional install."
          />
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Core component</p>
            <div className="rounded-xl border bg-muted/40 p-1">
              <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
            </div>
          </div>
        </section>

        {/* Basic Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Basic Usage"
            description="Define columns with createColumnHelper, add built-in factories, and pass everything to DataTable."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={basicUsageCode} html={basicUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Flat Table */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Flat Table (No Pagination)"
            description="For small datasets like deduction lists, DTR daily logs, or readonly summaries just the table, nothing else."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={flatUsageCode} html={flatUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Server Pagination */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Server-Side Mode"
            description="Own the page, sort, and search state yourself. DataTable renders the UI, you provide the data fetching logic."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={serverUsageCode} html={serverUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Inertia.js Mode */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Laravel Inertia.js Mode"
            description="Seamlessly bind Laravel paginators to DataTable. All search, sort, and trashed filter events update the URL via Inertia router.get() with preserveState."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={inertiaUsageCode} html={inertiaUsageHtml} language="tsx" />
          </div>
        </section>


        {/* Trashed Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Trashed / Archived Toggle"
            description="Toggle soft-deleted records in and out of the active view. Shows an indicator pill in the toolbar and a dismissible warning banner when viewing archived data."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={trashedUsageCode} html={trashedUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Column Factories */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Column Factories"
            description="Three pre-built column factories ship with the component so you never write checkbox, row number, or actions columns from scratch again."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border p-5 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Selection Column</Badge>
                <code className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">__select__</code>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Helper: <code className="text-primary font-mono font-semibold">selectionColumn&lt;T&gt;()</code>
              </p>
              <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                <li>Fixed width of <strong className="text-foreground">40px</strong></li>
                <li>Displays a header checkbox to select/deselect all rows on the page</li>
                <li>Stops row click event propagation automatically to prevent accidental row selection</li>
                <li>Disabled from sorting or visibility hiding behaviors</li>
              </ul>
            </div>

            <div className="rounded-xl border p-5 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Index Column</Badge>
                <code className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">__index__</code>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Helper: <code className="text-primary font-mono font-semibold">indexColumn&lt;T&gt;()</code>
              </p>
              <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                <li>Fixed width of <strong className="text-foreground">50px</strong></li>
                <li>Renders a 1-indexed row number (#) that matches the current layout row order</li>
                <li>Uses <code className="font-mono text-[10px] bg-muted px-1 rounded text-foreground font-semibold">tabular-nums</code> CSS styling to ensure clean vertical alignment</li>
                <li>Disabled from sorting or visibility hiding behaviors</li>
              </ul>
            </div>

            <div className="rounded-xl border p-5 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Row Actions Column</Badge>
                <code className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">__actions__</code>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Helper: <code className="text-primary font-mono font-semibold">rowActionsColumn&lt;T&gt;()</code>
              </p>
              <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                <li>Fixed width of <strong className="text-foreground">50px</strong></li>
                <li>Renders a vertical ellipsis menu containing custom icons, labels, callbacks, and separators</li>
                <li>Supports conditional disabling, destructive variants, and item visibility filtering</li>
                <li>Disabled from sorting or visibility hiding behaviors</li>
              </ul>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={columnFactoriesCode} html={columnFactoriesHtml} language="tsx" />
          </div>
        </section>

        {/* Props: Core */}
        <section className="space-y-6">
          <DocsSectionHeading title="Core Props" description="Required and identity configuration." />
          <PropsTable data={coreProps} />
        </section>

        {/* Props: Toolbar */}
        <section className="space-y-6">
          <DocsSectionHeading title="Toolbar Props" description="Configure the built-in TableToolbar or replace it entirely." />
          <PropsTable data={toolbarProps} />
        </section>

        {/* Props: Search */}
        <section className="space-y-6">
          <DocsSectionHeading title="Search Props" description="Single internal search input client-side automatic, server-side debounced callback." />
          <PropsTable data={searchProps} />
        </section>

        {/* Props: Pagination */}
        <section className="space-y-6">
          <DocsSectionHeading title="Pagination Props" description="Three modes: off, client-managed, or server-controlled." />
          <PropsTable data={paginationProps} />
        </section>

        {/* Props: Interactions */}
        <section className="space-y-6">
          <DocsSectionHeading title="Interaction Props" description="Sorting, column visibility, row selection, and click handlers." />
          <PropsTable data={interactionProps} />
        </section>

        {/* Props: Trashed Filter */}
        <section className="space-y-6">
          <DocsSectionHeading title="Trashed Filter Props" description="Optional toggle for soft-deleted / archived records." />
          <PropsTable data={trashedProps} />
        </section>

        {/* Props: Presentation */}
        <section className="space-y-6">
          <DocsSectionHeading title="Presentation Props" description="Row density, sticky header, and styling overrides." />
          <PropsTable data={presentationProps} />
        </section>

      </div>
    </div>
  );
}


