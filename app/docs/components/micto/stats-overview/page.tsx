import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import StatsOverviewDemo from "@/registry/new-york/example/stats-overview-demo";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/stats-overview.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/stats-overview.json",
  },
];

const usageCode = `import { StatsOverview } from "@/components/micto/stats-overview"

export default function Example() {
  return (
    <StatsOverview>
      {/* Implementation */}
    </StatsOverview>
  )
}`;

export default async function StatsOverviewPage() {
  const previewRawCode = getCode("registry/new-york/example/stats-overview-demo.tsx");
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
        title="Stats Overview"
        description="A beautiful status card for your dashboard"
        badges={headerBadges}
      />

      <div className="space-y-16">
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Basic usage and styling of the Stats Overview component."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <StatsOverviewDemo />
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
      </div>
    </div>
  );
}
