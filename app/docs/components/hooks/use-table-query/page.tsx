import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import { highlightCode } from "@/lib/get-code";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/hooks/use-table-query.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/hooks/use-table-query.json",
  },
];

const usageCode = `import { useTableQuery } from "@/hooks/use-table-query"
import { DataTable } from "@/components/micto/data-table"

export default function EmployeesPage() {
  const table = useTableQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    columns,
    tableId: "employees-table",
  })

  return <DataTable {...table} />
}`;

export default async function UseTableQueryPage() {
  const usageHtml = await highlightCode(usageCode, "tsx");

  const headerBadges = (
    <>
      <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider">
        React Hook
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium">
        TanStack Query
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="useTableQuery"
        description="A high-performance TanStack Query wrapper for DataTable that manages server-side pagination, sorting, and searching state automatically."
        badges={headerBadges}
      />

      <div className="space-y-16">
        <section className="space-y-6">
          <DocsSectionHeading
            title="Overview"
            description="The useTableQuery hook simplifies server-side data fetching by synchronizing TanStack Table's state with TanStack Query. It automatically handles debounced searching, page changes, and sort direction."
          />
        </section>

        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install via the shadcn CLI. Note: This hook requires @tanstack/react-query to be installed in your project."
          />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
          </div>
        </section>

        <section className="space-y-6">
          <DocsSectionHeading
            title="Usage"
            description="The hook returns an object that can be spread directly onto the DataTable component."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={usageCode} html={usageHtml} language="tsx" />
          </div>
        </section>
      </div>
    </div>
  );
}
