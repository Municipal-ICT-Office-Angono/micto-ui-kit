import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import ActivityTimelineDemo from "@/registry/new-york/example/activity-timeline-demo";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/activity-timeline.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/activity-timeline.json",
  },
];


const shorthandUsageCode = `import { ActivityTimelineList } from "@/components/micto/activity-timeline"
import { Badge } from "@/components/ui/badge"

const history = [
  {
    id: 1,
    title: "Purchase Request Submitted",
    description: "PR-2026-009 submitted for IT Equipment procurement.",
    timestamp: "Oct 24, 2026 Â· 09:15 AM",
    status: "completed" as const,
    actor: { name: "Nehry Dedoro", avatar: "/avatars/nehry.jpg", role: "Lead Architect" },
    metadata: [<Badge key="1">ICT Fund</Badge>],
    attachments: [{ label: "Specs.pdf", url: "#" }]
  },
  {
    id: 2,
    title: "Pending Budget Clearance",
    description: "Forwarded to Municipal Budget Office.",
    status: "in-progress" as const,
  }
]

export default function DocumentHistory() {
  return <ActivityTimelineList items={history} orientation="vertical" />
}`;

const horizontalUsageCode = `import { ActivityTimelineList } from "@/components/micto/activity-timeline"

const steps = [
  { id: 1, title: "Filing", description: "Submit Form 6", status: "completed" as const },
  { id: 2, title: "HRMO Review", description: "Leave credits check", status: "in-progress" as const },
  { id: 3, title: "Supervisor Approval", description: "Workload clearance", status: "pending" as const },
]

export default function LeaveStepper() {
  return <ActivityTimelineList items={steps} orientation="horizontal" />
}`;

const composableUsageCode = `import {
  ActivityTimeline,
  ActivityTimelineItem,
  ActivityTimelineTrack,
  ActivityTimelineConnector,
  ActivityTimelineDot,
  ActivityTimelineContent,
} from "@/components/micto/activity-timeline"
import { UserCheck, AlertTriangle } from "lucide-react"

export default function SystemAuditLog() {
  return (
    <ActivityTimeline orientation="vertical" className="gap-2">
      <ActivityTimelineItem status="completed">
        <ActivityTimelineTrack>
          <ActivityTimelineConnector />
          <ActivityTimelineDot className="border-blue-500 bg-blue-50 text-blue-600">
            <UserCheck className="size-4" />
          </ActivityTimelineDot>
        </ActivityTimelineTrack>
        <ActivityTimelineContent>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold">User Auth Success</span>
            <span className="text-[10px] text-muted-foreground">10:02:14 AM</span>
          </div>
          <p className="text-[11px] text-muted-foreground">IP: 192.168.1.45 via Biometrics Gateway</p>
        </ActivityTimelineContent>
      </ActivityTimelineItem>
    </ActivityTimeline>
  )
}`;

// Props Tables 

const rootProps = [
  { name: "orientation", type: "'vertical' | 'horizontal'", default: "'vertical'", description: "Defines the layout orientation. Vertical stacks items down; horizontal places them side-by-side." },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes for the outer wrapper container." },
];

const itemProps = [
  { name: "status", type: "'completed' | 'in-progress' | 'pending' | 'error' | 'muted'", default: "'pending'", description: "Sets the visual styling state of the dot and connector line." },
  { name: "isLast", type: "boolean", default: "false", description: "When true, hides the connector line running from this item." },
];

const listProps = [
  { name: "items", type: "ActivityTimelineItemData[]", default: "", description: "Array of structured item configuration objects for the data-driven shorthand." },
  { name: "orientation", type: "'vertical' | 'horizontal'", default: "'vertical'", description: "Forwarded to the root container to dictate layout flow." },
];

const itemDataProps = [
  { name: "id", type: "string | number", default: "", description: "Unique identifier for React list keys." },
  { name: "title", type: "ReactNode", default: "", description: "Primary title of the timeline step or event." },
  { name: "description", type: "ReactNode", default: "undefined", description: "Secondary details text or paragraph." },
  { name: "timestamp", type: "string", default: "undefined", description: "Formatted date/time string displayed next to or below the title." },
  { name: "status", type: "'completed' | 'in-progress' | 'pending' | 'error' | 'muted'", default: "'pending'", description: "Visual status state for this step." },
  { name: "actor", type: "{ name?: string; avatar?: string; role?: string }", default: "undefined", description: "Actor information. Renders a clickable tooltip badge in vertical mode, or a pill in horizontal mode." },
  { name: "metadata", type: "ReactNode[]", default: "undefined", description: "Array of Badge components or status pills rendered below the description." },
  { name: "attachments", type: "{ label: string; url?: string; onClick?: () => void }[]", default: "undefined", description: "Document attachments. Renders underlined clickable attachment links." },
  { name: "customDot", type: "ReactNode", default: "undefined", description: "Completely replaces the built-in status dot with a custom React element." },
];



export default async function ActivityTimelinePage() {
  // 1. previewRawCode: The raw string of the component for the copy button
  // 2. previewHtml: The pre-highlighted version of the code for fast, zero-JS rendering in the browser
  const previewRawCode = getCode("registry/new-york/example/activity-timeline-demo.tsx");
  const previewHtml = await highlightCode(previewRawCode);
  const shorthandUsageHtml = await highlightCode(shorthandUsageCode, "tsx");
  const horizontalUsageHtml = await highlightCode(horizontalUsageCode, "tsx");
  const composableUsageHtml = await highlightCode(composableUsageCode, "tsx");

  const headerBadges = (
    <>
      <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider">
        React
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium">
        LGU Workflow
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
        Data-Driven & Composable
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Activity Timeline"
        description="A beautiful, responsive, and composable timeline/stepper component system. Built specifically for LGU document routing audit trails, leave application steppers, and system administrator event logs."
        badges={headerBadges}
      />

      <div className="space-y-16">

        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Explore three distinct municipal configurations: Document Routing History, Leave Application Stepper, and Composable IT Audit Logs."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <ActivityTimelineDemo />
          </ComponentPreview>
        </section>

        {/* Installation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install the component via the shadcn/ui CLI."
          />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
          </div>
        </section>

        {/* Shorthand Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Data-Driven Shorthand"
            description="Pass an array of structured items to ActivityTimelineList for instant rendering of document routing histories."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={shorthandUsageCode} html={shorthandUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Horizontal Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Horizontal Stepper"
            description="Change orientation to horizontal for multi-step wizards or application progress tracking."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={horizontalUsageCode} html={horizontalUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Composable Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Composable Primitives"
            description="Use individual ActivityTimelineItem nodes for absolute layout control and custom status icons."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={composableUsageCode} html={composableUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Props: Root */}
        <section className="space-y-6">
          <DocsSectionHeading title="ActivityTimeline Props" description="Root container configuration." />
          <PropsTable data={rootProps} />
        </section>

        {/* Props: List */}
        <section className="space-y-6">
          <DocsSectionHeading title="ActivityTimelineList Props" description="High-level shorthand wrapper configuration." />
          <PropsTable data={listProps} />
        </section>

        {/* Props: Item Data */}
        <section className="space-y-6">
          <DocsSectionHeading title="ActivityTimelineItemData" description="Structure of each item object in the items array." />
          <PropsTable data={itemDataProps} />
        </section>

        {/* Props: Item Node */}
        <section className="space-y-6">
          <DocsSectionHeading title="ActivityTimelineItem Props" description="Individual composable node configuration." />
          <PropsTable data={itemProps} />
        </section>

      </div>
    </div>
  );
}


