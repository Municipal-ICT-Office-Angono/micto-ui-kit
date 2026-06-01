import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import DatePickerWithRangeDemo from "@/registry/new-york/example/date-picker-with-range-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/date-picker-with-range.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/date-picker-with-range.json",
  },
];

const basicUsageCode = `import { useState } from "react"
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/micto/date-picker-with-range"

export default function Page() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })

  return (
    <DatePickerWithRange 
      value={dateRange} 
      onChange={setDateRange} 
    />
  )
}`;

const propsData = [
  {
    name: "value",
    type: "DateRange",
    default: "undefined",
    description:
      "The selected date range containing optional 'from' and 'to' Date objects.",
  },
  {
    name: "onChange",
    type: "(date: DateRange | undefined) => void",
    default: "undefined",
    description: "Callback triggered when the date range selection changes.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description:
      "Custom classes applied to the container wrapping the date range trigger button.",
  },
];

export default async function DatePickerWithRangePage() {
  const previewRawCode = getCode(
    "registry/new-york/example/date-picker-with-range-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode);

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
        Range Selection
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Date Picker With Range"
        description="An dual-month calendar range selection component designed for choosing date ranges in forms, reports, or scheduling tasks."
        badges={headerBadges}
      />

      <div className="space-y-16">
        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Toggle dates across the calendar grids to choose range bounds."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <DatePickerWithRangeDemo />
          </ComponentPreview>
        </section>

        {/* Installation */}
        <section className="space-y-6">
          <DocsSectionHeading title="Installation" />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs
              commands={installCommands}
              defaultValue="pnpm"
            />
          </div>
        </section>

        {/* Basic Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Usage"
            description="Import and bind control states using react-day-picker ranges."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={basicUsageCode}
              html={basicUsageHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Props Reference */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="API Reference"
            description="Configuration attributes available for the Date Picker With Range component."
          />
          <PropsTable data={propsData} />
        </section>
      </div>
    </div>
  );
}
