import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import { PropsTable } from "@/components/props-table";
import StatusCardDemo from "@/registry/new-york/example/status-card-demo";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/status-card.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/status-card.json",
  },
];

const usageCode = `import { StatusCard } from "@/components/micto/status-card"

export default function Example() {
  return (
    <StatusCard 
      title="Status Card"
      description="A professional LGU component."
    >
      {/* Implementation */}
    </StatusCard>
  )
}`;

const presentationProps = [
  {
    name: "title",
    type: "string",
    default: "-",
    description: "The main heading of the component.",
  },
  {
    name: "description",
    type: "string",
    default: "-",
    description: "Secondary text providing additional context.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Custom CSS classes for styling.",
  },
];

export default async function StatusCardPage() {
  const previewRawCode = getCode("registry/new-york/example/status-card-demo.tsx");
  const previewHtml = await highlightCode(previewRawCode);
  const usageHtml = await highlightCode(usageCode, "tsx");

  const headerBadges = (
    <>
      <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider">
        React
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium">
        Micto
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Status Card"
        description="A professional LGU component."
        badges={headerBadges}
      />

      <div className="space-y-16">
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Basic usage and styling of the Status Card component."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <StatusCardDemo />
          </ComponentPreview>
        </section>

        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install via the shadcn CLI."
          />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
          </div>
        </section>

        <section className="space-y-6">
          <DocsSectionHeading
            title="Usage"
            description="How to use the component in your application."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={usageCode} html={usageHtml} language="tsx" />
          </div>
        </section>

        
        <section className="space-y-6">
          <DocsSectionHeading
            title="Properties"
            description="Available props for the Status Card component."
          />
          <PropsTable data={presentationProps} />
        </section>
        
      </div>
    </div>
  );
}
