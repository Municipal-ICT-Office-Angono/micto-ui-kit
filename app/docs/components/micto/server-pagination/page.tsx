import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import ServerPaginationDemo from "@/registry/new-york/example/server-pagination-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/server-pagination.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/server-pagination.json",
  },
];

const stateUsageCode = `import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ServerPagination } from "@/components/micto/server-pagination"

export default function UsersTable() {
  const [page, setPage] = useState(1)
  const { data } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
  })

  return (
    <div>
      {/* Table Elements */}
      <ServerPagination 
        currentPage={page} 
        totalPages={data?.lastPage ?? 1} 
        onPageChange={(targetPage) => setPage(targetPage)} 
      />
    </div>
  )
}`;

const routeUsageCode = `import Link from "next/link"
import { ServerPagination } from "@/components/micto/server-pagination"

export default function BlogListingPage({ searchParams }) {
  const page = parseInt(searchParams.page || "1", 10)
  const totalPages = 15

  return (
    <div>
      {/* Blog Cards */}
      <ServerPagination 
        currentPage={page} 
        totalPages={totalPages} 
        createPageHref={(pageNum) => \`/blog?page=\${pageNum}\`} 
        LinkComponent={Link} 
      />
    </div>
  )
}`;

const propsData = [
  {
    name: "currentPage",
    type: "number",
    default: "required",
    description: "The current active page number (1-indexed).",
  },
  {
    name: "totalPages",
    type: "number",
    default: "required",
    description: "The total number of pages available.",
  },
  {
    name: "onPageChange",
    type: "(page: number) => void",
    default: "undefined",
    description:
      "Callback triggered when a page button is clicked. If provided, default navigation is intercepted.",
  },
  {
    name: "createPageHref",
    type: "(page: number) => string",
    default: "undefined",
    description: "A helper function that builds relative URLs for routing SEO paths.",
  },
  {
    name: "LinkComponent",
    type: "React.ComponentType",
    default: "a",
    description:
      "Custom routing Link component (e.g. Next.js Link, TanStack Router Link, etc.).",
  },
  {
    name: "size",
    type: "'default' | 'sm' | 'lg' | 'icon'",
    default: "'icon'",
    description: "The visual dimensions profile of the buttons.",
  },
  {
    name: "position",
    type: "'start' | 'center' | 'end'",
    default: "'center'",
    description: "Horizontal alignment profile inside the container.",
  },
];

export default async function ServerPaginationPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/server-pagination-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const stateUsageHtml = await highlightCode(stateUsageCode);
  const routeUsageHtml = await highlightCode(routeUsageCode);

  const headerBadges = (
    <>
      <Badge
        variant="secondary"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider"
      >
        React
      </Badge>
      <Badge
        variant="outline"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium"
      >
        Next.js / TanStack
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Server Pagination"
        description="A framework-agnostic pagination component designed for client routers and asynchronous state setups."
        badges={headerBadges}
      />

      {/* Main Content */}
      <div className="space-y-16">
        {/* Preview Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Toggle through the active modes below. Ellipsis automatically slides depending on the selected page."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <ServerPaginationDemo />
          </ComponentPreview>
        </section>

        {/* Installation Section */}
        <section className="space-y-6">
          <DocsSectionHeading title="Installation" />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs
              commands={installCommands}
              defaultValue="pnpm"
            />
          </div>
        </section>

        {/* Usage A Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive State Mode (TanStack Table & Query)"
            description="Use this mode when you are loading data inside local states. Page changes will trigger a reactive query update."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={stateUsageCode} html={stateUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Usage B Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="SEO Route Mode (Next.js & TanStack Router)"
            description="Use this mode to leverage server rendering and routing parameters. Clicks will trigger router navigations to clean relative URLs."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={routeUsageCode} html={routeUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Props Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="API Reference"
            description="Configure the component using the following properties."
          />
          <div className="rounded-xl border overflow-hidden shadow-sm bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[150px] font-bold text-foreground/80 lowercase tracking-tight">
                    Prop
                  </TableHead>
                  <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">
                    Type
                  </TableHead>
                  <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">
                    Default
                  </TableHead>
                  <TableHead className="text-right font-bold text-foreground/80 lowercase tracking-tight">
                    Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propsData.map((prop) => (
                  <TableRow
                    key={prop.name}
                    className="border-b transition-colors hover:bg-muted/5 font-sans"
                  >
                    <TableCell className="font-mono text-xs font-semibold text-primary/80">
                      {prop.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-blue-600 dark:text-blue-400">
                      {prop.type}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground/70">
                      {prop.default}
                    </TableCell>
                    <TableCell className="text-right text-xs leading-relaxed max-w-[300px] text-muted-foreground">
                      {prop.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}


