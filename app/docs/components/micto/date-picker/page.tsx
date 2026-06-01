import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import DatePickerDemo from "@/registry/new-york/example/date-picker-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/date-picker.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/date-picker.json",
  },
];

const basicUsageCode = `import { useState } from "react"
import { DatePicker } from "@/components/micto/date-picker"

export default function Page() {
  const [date, setDate] = useState("")

  return (
    <div className="max-w-xs">
      <DatePicker 
        value={date} 
        onChange={setDate} 
        placeholder="Pick a date"
      />
    </div>
  )
}`;

const propsData = [
  {
    name: "value",
    type: "string | Date",
    default: "undefined",
    description: "The selected date value. Can be a Date object or an ISO/parsed string representation.",
  },
  {
    name: "onChange",
    type: "(dateString: string) => void",
    default: "undefined",
    description: "Callback triggered when a date is selected. Returns the formatted date string in local timezone (YYYY-MM-DD HH:mm).",
  },
  {
    name: "placeholder",
    type: "string",
    default: "'Pick a date'",
    description: "Placeholder text displayed in the input field when no date is selected.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Custom classes applied to the date picker trigger button.",
  },
];

export default async function DatePickerPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/date-picker-demo.tsx",
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
        Calendar Popover
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Date Picker"
        description="A clean, popover-based calendar component that allows users to select a single date, complete with localization and dropdown select styling."
        badges={headerBadges}
      />

      <div className="space-y-16">
        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Try selecting a date below to see how the component behaves and formats the output value."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <DatePickerDemo />
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
            description="How to integrate the Date Picker into your form components."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={basicUsageCode} html={basicUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Props Reference */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="API Reference"
            description="Configuration attributes available for the Date Picker component."
          />
          <PropsTable data={propsData} />
        </section>
      </div>
    </div>
  );
}
