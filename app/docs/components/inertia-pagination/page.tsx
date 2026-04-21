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
import { Separator } from "@/components/ui/separator";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import InertiaPaginationDemo from "@/registry/new-york/example/inertia-pagination-demo";
import Link from "next/link";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/inertia-pagination.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/inertia-pagination.json",
  },
];

const usageCode = `import { Link } from "@inertiajs/react"
import { InertiaPagination } from "@/components/inertia-pagination"

export default function Page({ users }) {
  return (
    <InertiaPagination 
      links={users.links} 
      LinkComponent={Link} 
    />
  )
}`;

const propsData = [
  {
    name: "links",
    type: "Array<{ url: string | null, label: string, active: boolean }>",
    default: "[]",
    description:
      "The links array directly from the Laravel/Inertia paginator response.",
  },
  {
    name: "LinkComponent",
    type: "React.ComponentType",
    default: "a",
    description:
      "The Link component to use (e.g., Inertia's Link for SPA navigation).",
  },
  {
    name: "size",
    type: "'default' | 'sm' | 'lg' | 'icon'",
    default: "'default'",
    description: "The size of the pagination buttons.",
  },
];

export default async function InertiaPaginationPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/inertia-pagination-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const usageHtml = await highlightCode(usageCode);

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
        Inertia.js
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Inertia Pagination"
        description="A high-performance pagination component optimized for Laravel and Inertia.js responses."
        badges={headerBadges}
      />

      {/* Main Content */}
      <div className="space-y-16">
        {/* Preview Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Preview"
            description="Interact with the live pagination component below to see how it handles active states and ellipsis."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <InertiaPaginationDemo />
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

        {/* Usage Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Usage"
            description="Integrating the paginator is straightforward. Simply pass the links object from your controller."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={usageCode} html={usageHtml} language="tsx" />
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
