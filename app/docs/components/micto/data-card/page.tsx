import * as React from "react";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import DataCardDemo from "@/registry/new-york/example/data-card-demo";
import { InstallCommandTabs } from "@/components/install-command-tabs";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/data-card.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/data-card.json",
  },
];

export default async function DataCardPage() {
  const previewRawCode = getCode("registry/new-york/example/data-card-demo.tsx");
  const previewHtml = await highlightCode(previewRawCode);

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Data Card"
        description="A professional, data-driven card component for displaying record summaries and metrics."
      />

      <div className="space-y-16">
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Basic usage and styling of the Data Card component."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <DataCardDemo />
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
      </div>
    </div>
  );
}

