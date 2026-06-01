import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import SearchSelectDemo from "@/registry/new-york/example/search-select-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/search-select.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/search-select.json",
  },
];

const basicUsageCode = `import { useState } from "react"
import { SearchSelect } from "@/components/micto/search-select"

const roles = [
  { value: "admin", label: "Administrator", description: "Full privileges" },
  { value: "editor", label: "Editor", description: "Content privileges" },
]

export default function Page() {
  const [role, setRole] = useState("editor")
  return (
    <SearchSelect 
      options={roles} 
      value={role} 
      onChange={setRole} 
      placeholder="Select a system role"
    />
  )
}`;

const asyncUsageCode = `import { SearchSelect } from "@/components/micto/search-select"

export default function Page() {
  const handleUserSearch = async (query: string) => {
    const res = await fetch(\`/api/users?search=\${query}\`)
    const users = await res.json()
    return users.map(u => ({
      value: u.id,
      label: u.name,
      description: u.email,
      avatar: u.avatar_url // optional image avatar
    }))
  }

  return (
    <SearchSelect 
      onSearch={handleUserSearch} 
      multiple // enables pill badge multi-select
      placeholder="Assign team members..."
    />
  )
}`;

const propsData = [
  {
    name: "options",
    type: "SearchSelectOption[]",
    default: "[]",
    description: "Static list of options to search and filter locally inside memory.",
  },
  {
    name: "onSearch",
    type: "(query: string) => Promise<SearchSelectOption[]>",
    default: "undefined",
    description: "Async search callback. Triggers on debounced input (300ms) with shimmer states.",
  },
  {
    name: "value",
    type: "string | string[]",
    default: "undefined",
    description: "Currently selected value. Passes string in single mode, or string array in multi mode.",
  },
  {
    name: "onChange",
    type: "(value: any) => void",
    default: "undefined",
    description: "Callback triggered when selection state updates.",
  },
  {
    name: "multiple",
    type: "boolean",
    default: "false",
    description: "Whether to enable multi-selection. Renders closable pills in trigger box.",
  },
  {
    name: "placeholder",
    type: "string",
    default: "'Select option...'",
    description: "Empty state text shown in select button.",
  },
  {
    name: "searchPlaceholder",
    type: "string",
    default: "'Search...'",
    description: "Placeholder text displayed in popup filter box.",
  },
  {
    name: "emptyMessage",
    type: "string",
    default: "'No results found.'",
    description: "Message rendered when search queries find no matching options.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the entire combobox selection and interactions.",
  },
];

export default async function SearchSelectPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/search-select-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode);
  const asyncUsageHtml = await highlightCode(asyncUsageCode);

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
        Async Debounced
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Search Select"
        description="A beautiful searchable combobox supporting single/multi selection, custom avatars, description lines, and debounced API searching."
        badges={headerBadges}
      />

      {/* Main Content */}
      <div className="space-y-16">
        {/* Preview Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Toggle through single, multi-selection, and faked network loading configurations below."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <SearchSelectDemo />
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
            title="Static Local Filtering"
            description="For localized lists (roles, flags, status items). Loads and filters in client-side memory."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={basicUsageCode} html={basicUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Usage B Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Async Search (Multi-Select assignee style)"
            description="Throttles network requests automatically using a 300ms debounce. Ideal for searching deep databases."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={asyncUsageCode} html={asyncUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Props Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="API Reference"
            description="Configure the component using the following properties."
          />
          <PropsTable data={propsData} />
        </section>
      </div>
    </div>
  );
}


