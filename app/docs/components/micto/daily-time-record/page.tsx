import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import DailyTimeRecordDemo from "@/registry/new-york/example/daily-time-record-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/daily-time-record.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/daily-time-record.json",
  },
];

const basicUsageCode = `import { DailyTimeRecord } from "@/components/micto/daily-time-record";

const logs = [
  {
    date: "2026-10-01",
    amIn: "07:52 AM",
    amOut: "12:02 PM",
    pmIn: "12:58 PM",
    pmOut: "05:04 PM",
    status: "regular",
  },
  {
    date: "2026-10-02",
    amIn: "07:48 AM",
    amOut: "12:01 PM",
    pmIn: "12:55 PM",
    pmOut: "05:02 PM",
    status: "regular",
  },
  {
    date: "2026-10-03", // Saturday
    status: "weekend",
  },
  {
    date: "2026-10-04", // Sunday
    status: "weekend",
  },
];

export default function SimpleDtr() {
  return (
    <DailyTimeRecord
      employeeId="2026-1082"
      employeeName="Nehry Guinto"
      department="Municipal Information and Communications Technology Office"
      position="Chief Technology Officer"
      month="October 2026"
      logs={logs}
    />
  );
}`;

const callbackUsageCode = `import * as React from "react";
import { DailyTimeRecord } from "@/components/micto/daily-time-record";

export default function InteractiveDtr() {
  const [logs, setLogs] = React.useState([
    {
      date: "2026-10-12",
      amOut: "12:01 PM",
      pmIn: "12:56 PM",
      pmOut: "05:03 PM",
      status: "regular", // amIn is missing!
    }
  ]);

  const handleAdjustment = (date: string, field: string) => {
    const timePrompt = prompt(\`Enter correct time for \${field} on \${date}:\`, "08:00 AM");
    if (!timePrompt) return;

    setLogs((prev) =>
      prev.map((log) =>
        log.date === date ? { ...log, [field]: timePrompt } : log
      )
    );
  };

  return (
    <DailyTimeRecord
      employeeId="2026-1082"
      employeeName="Nehry Guinto"
      department="MICTO"
      position="Systems Architect"
      month="October 2026"
      logs={logs}
      onFileAdjustment={handleAdjustment}
    />
  );
}`;

const dtrProps = [
  {
    name: "employeeId",
    type: "string",
    default: "",
    description: "The unique local identification ID of the employee.",
  },
  {
    name: "employeeName",
    type: "string",
    default: "",
    description: "The full display name of the employee.",
  },
  {
    name: "department",
    type: "string",
    default: "",
    description: "The municipal office/department (e.g. 'MICTO').",
  },
  {
    name: "position",
    type: "string",
    default: "",
    description: "The official job title/position.",
  },
  {
    name: "month",
    type: "string",
    default: "",
    description: "The target calendar month string (e.g. 'October 2026').",
  },
  {
    name: "logs",
    type: "DtrLogEntry[]",
    default: "[]",
    description: "An array of daily time records containing dates, punch timestamps, and status variables.",
  },
  {
    name: "onFileAdjustment",
    type: "(date: string, field: 'amIn' | 'amOut' | 'pmIn' | 'pmOut') => void",
    default: "undefined",
    description: "Optional callback fired when a user clicks the adjustment trigger on missing or editable log cells.",
  },
];

export default async function DailyTimeRecordPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/daily-time-record-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode, "tsx");
  const callbackUsageHtml = await highlightCode(callbackUsageCode, "tsx");

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
        HRIS
      </Badge>
      <Badge
        variant="outline"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
      >
        LGU Admin
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Daily Time Record (DTR)"
        description="A specialized, high-fidelity log grid built for government personnel systems. Automatically aggregates total work duration, tardiness counters, leave trackers, and supports hover-triggered manual punch correction slips."
        badges={headerBadges}
      />

      <div className="space-y-16">
        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="A visual employee timecard with live status matrices and an adjustment request panel."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <DailyTimeRecordDemo />
          </ComponentPreview>
        </section>

        {/* Installation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install the DailyTimeRecord component."
          />
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/40 p-1">
              <InstallCommandTabs
                commands={installCommands}
                defaultValue="pnpm"
              />
            </div>
          </div>
        </section>

        {/* Basic Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Basic Usage"
            description="Render a simple read-only DTR calendar view."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={basicUsageCode}
              html={basicUsageHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Dynamic Adjustments */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Time Adjustments (Correction Sheets)"
            description="Wire up the onFileAdjustment callback to trigger manual punch adjustment slips whenever time logs are missing or require changes."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={callbackUsageCode}
              html={callbackUsageHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Props Reference */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="DailyTimeRecord API Reference"
            description="Configure the daily time record component using the following options."
          />
          <PropsTable data={dtrProps} />
        </section>
      </div>
    </div>
  );
}
