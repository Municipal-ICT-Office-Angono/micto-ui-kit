import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import TableToolbarDemo from "@/registry/new-york/example/table-toolbar-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/table-toolbar.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/table-toolbar.json",
  },
];

const basicUsageCode = `import { useState } from "react"
import { TableToolbar, ToolbarAction } from "@/components/micto/table-toolbar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Archive, Settings2 } from "lucide-react"

export default function Page() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const activeFiltersCount = statusFilter !== "all" ? 1 : 0

  return (
    <TableToolbar
      selectedCount={selectedIds.length}
      onClearSelection={() => setSelectedIds([])}
      variant="inline" // or "floating"
      search={
        <Input 
          placeholder="Search records..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 max-w-xs" 
        />
      }
      filters={
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase">
            Filter by Status
          </span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      activeFiltersCount={activeFiltersCount}
      actions={
        <ToolbarAction icon={Plus} variant="default">Add Record</ToolbarAction>
      }
      bulkActions={
        <>
          <ToolbarAction icon={Archive}>Bulk Archive</ToolbarAction>
          <ToolbarAction icon={Trash2} variant="destructive">Bulk Delete</ToolbarAction>
        </>
      }
    />
  )
}`;

const toolbarActionCode = `// Automates height padding, font constraints, active transitions,
// and features automatic mobile auto-collapse out-of-the-box!

import { ToolbarAction } from "@/components/micto/table-toolbar"
import { Plus } from "lucide-react"

export default function Example() {
  return (
    <ToolbarAction 
      icon={Plus} 
      variant="default"
      collapseOnMobile={true} // hides text on mobile, displaying full on desktop
    >
      Add Citizen
    </ToolbarAction>
  )
}`;

const toolbarPropsData = [
  {
    name: "selectedCount",
    type: "number",
    default: "0",
    description: "The total number of currently selected/checked items. When greater than zero, transitions into bulk actions view.",
  },
  {
    name: "onClearSelection",
    type: "() => void",
    default: "undefined",
    description: "Callback fired when clicking the deselect trigger (X icon) inside selection trays.",
  },
  {
    name: "variant",
    type: "'inline' | 'floating'",
    default: "'inline'",
    description: "Layout style theme. 'inline' morphs filters in place; 'floating' slides a glossy panel up at viewport bottom.",
  },
  {
    name: "children",
    type: "ReactNode",
    default: "undefined",
    description: "Filters row items (fallback/legacy) visible on selectedCount = 0.",
  },
  {
    name: "search",
    type: "ReactNode",
    default: "undefined",
    description: "Standard search input node, displayed on the left side of the toolbar.",
  },
  {
    name: "filters",
    type: "ReactNode",
    default: "undefined",
    description: "Content of filters, displayed inside a collapsible Popover with a Filters button.",
  },
  {
    name: "activeFiltersCount",
    type: "number",
    default: "0",
    description: "Number of active filters, displayed as a badge next to the Filters trigger button.",
  },
  {
    name: "actions",
    type: "ReactNode",
    default: "undefined",
    description: "Standard action triggers (Add buttons, Export settings) visible on selectedCount = 0.",
  },
  {
    name: "bulkActions",
    type: "ReactNode",
    default: "undefined",
    description: "Multi-item batch action components visible on selectedCount > 0.",
  },
];

const actionPropsData = [
  {
    name: "variant",
    type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
    default: "'outline'",
    description: "Inherits standard button variant parameters.",
  },
  {
    name: "icon",
    type: "LucideIcon",
    default: "undefined",
    description: "Optional leading vector Lucide icon to embed inside the trigger.",
  },
  {
    name: "collapseOnMobile",
    type: "boolean",
    default: "true",
    description: "Automatically collapses and hides text labels on mobile screens to preserve layout, rendering as compact icon-only buttons.",
  },
];

export default async function TableToolbarPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/table-toolbar-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode);
  const actionUsageHtml = await highlightCode(toolbarActionCode);

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
        Reactive Morphs
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Table Toolbar"
        description="A beautiful reactive grid toolbar that smoothly morphs filters into bulk action trays or bottom floating consoles upon selecting records."
        badges={headerBadges}
      />

      {/* Main Content */}
      <div className="space-y-16">
        {/* Preview Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Select checkboxes inside the registry list to watch inline morphs and floating docks transition live!"
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <TableToolbarDemo />
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
            title="Complete Toolbar Layout"
            description="Declare filters, standard operations, and bulk actions. The container handles transitions based on active counts automatically."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={basicUsageCode} html={basicUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Usage B Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Responsive Toolbar Actions"
            description="Use the specialized <ToolbarAction /> component to inherit standard themes, declare icons, and enable automated responsive text collapsing."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={toolbarActionCode} html={actionUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Props Reference A */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="TableToolbar API Reference"
            description="Configure the toolbar layout using the following options."
          />
          <PropsTable data={toolbarPropsData} />
        </section>

        {/* Props Reference B */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="ToolbarAction API Reference"
            description="Configure actions inside buttons using the following properties."
          />
          <PropsTable data={actionPropsData} />
        </section>
      </div>
    </div>
  );
}


