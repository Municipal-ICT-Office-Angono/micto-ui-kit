import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import UseTableQueryDemo from "@/registry/new-york/example/use-table-query-demo";

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
import type { TableQueryParams, TableQueryResult } from "@/registry/new-york/hooks/use-table-query"

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
  const demoRawCode = getCode("registry/new-york/example/use-table-query-demo.tsx");
  const demoHtml = await highlightCode(demoRawCode);

  const headerBadges = (
    <>
      <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider">
        React Hook
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium">
        TanStack Query
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium">
        URL Sync
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="useTableQuery"
        description="A high-performance TanStack Query wrapper for DataTable that manages server-side pagination, sorting, and searching state automatically, fully synchronized with URL parameters."
        badges={headerBadges}
      />

      <div className="space-y-16">
        <section className="space-y-6">
          <DocsSectionHeading
            title="Overview"
            description="The useTableQuery hook simplifies server-side data fetching by synchronizing TanStack Table's state with TanStack Query and Next.js query parameters. It automatically handles URL state persistence, debounced searching, page changes, and sort direction."
          />
        </section>

        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Try changing the page size, paginating, sorting a column, or entering a search term. Notice how the URL query parameters automatically update and preserve state upon refreshing the page."
          />
          <ComponentPreview code={demoRawCode} html={demoHtml}>
            <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Loading demo...</div>}>
              <UseTableQueryDemo />
            </React.Suspense>
          </ComponentPreview>
        </section>

        {/* Installation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install via the shadcn CLI. Note: This hook requires @tanstack/react-query to be installed in your project."
          />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
          </div>
        </section>

        {/* URL Parameters Grid */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="URL Search Parameters"
            description="The hook automatically binds the following parameters to the browser's URL search query:"
          />
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/50 font-medium">
                  <th className="p-3">Query Parameter</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-mono text-xs">page</td>
                  <td className="p-3 text-muted-foreground text-xs">number</td>
                  <td className="p-3 text-xs">Controls pagination page. Defaults to 1. Resets to 1 when filters or sort changes.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono text-xs">pageSize</td>
                  <td className="p-3 text-muted-foreground text-xs">number</td>
                  <td className="p-3 text-xs">Controls the number of rows displayed. Defaults to initialPageSize.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono text-xs">search</td>
                  <td className="p-3 text-muted-foreground text-xs">string</td>
                  <td className="p-3 text-xs">Holds the debounced search term. Input values are debounced in local state before committing to the URL.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono text-xs">sorting</td>
                  <td className="p-3 text-muted-foreground text-xs">string</td>
                  <td className="p-3 text-xs">Comma-separated sorting states. Format: columnId.asc or columnId.desc.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">trashed</td>
                  <td className="p-3 text-muted-foreground text-xs">boolean</td>
                  <td className="p-3 text-xs">Indicates if soft-deleted/archived items should be displayed (true or false).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Usage */}
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
