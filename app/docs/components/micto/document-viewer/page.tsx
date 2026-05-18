import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import DocumentViewerDemo from "@/registry/new-york/example/document-viewer-demo";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/document-viewer.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/document-viewer.json",
  },
];

const dmsUsageCode = `import {
  DocumentViewer,
  DocumentViewerToolbar,
  DocumentViewerCanvas,
  DocumentViewerSidebar,
} from "@/components/micto/document-viewer"
import { Button } from "@/components/ui/button"

export default function OrdinanceViewer() {
  return (
    <DocumentViewer
      url="/docs/resolution-2026.pdf"
      title="Resolution No. 2026-042"
      onDownload={() => alert("Downloading...")}
    >
      <DocumentViewerToolbar
        actions={<Button size="sm">Sign Resolution</Button>}
      />
      <div className="flex flex-1 overflow-hidden">
        <DocumentViewerCanvas />
        <DocumentViewerSidebar width="w-80">
          <h4 className="text-xs font-bold uppercase mb-2">Metadata</h4>
          <p className="text-xs text-muted-foreground">Author: Coun. Dela Cruz</p>
        </DocumentViewerSidebar>
      </div>
    </DocumentViewer>
  )
}`;

const lightboxUsageCode = `import {
  DocumentViewerDialog,
  DocumentViewerToolbar,
  DocumentViewerCanvas,
} from "@/components/micto/document-viewer"
import { Button } from "@/components/ui/button"

export default function PlanModal() {
  return (
    <DocumentViewerDialog
      trigger={<Button size="sm">Open Procurement Plan</Button>}
      url="/docs/procurement-plan.pdf"
      title="Annual Procurement Plan 2026"
    >
      <DocumentViewerToolbar />
      <div className="flex flex-1 overflow-hidden">
        <DocumentViewerCanvas />
      </div>
    </DocumentViewerDialog>
  )
}`;

//  Props Tables 

const rootProps = [
  { name: "url", type: "string", default: "", description: "The direct URL to the document (PDF, PNG, JPG, WEBP)." },
  { name: "title", type: "ReactNode", default: "undefined", description: "Document title displayed in the toolbar header and modal accessibility tags." },
  { name: "initialScale", type: "number", default: "1", description: "Starting zoom factor (e.g. 0.8 for 80%, 1.5 for 150%)." },
  { name: "sidebarPosition", type: "'left' | 'right'", default: "'right'", description: "Dictates which side the collapsible metadata pane appears on." },
  { name: "onDownload", type: "() => void", default: "undefined", description: "Trigger callback when the download icon button is clicked." },
  { name: "onPrint", type: "() => void", default: "undefined", description: "Trigger callback when the printer icon button is clicked." },
];

const toolbarProps = [
  { name: "showZoom", type: "boolean", default: "true", description: "When true, renders zoom scale controls for image documents." },
  { name: "showRotate", type: "boolean", default: "true", description: "When true, renders 90° clockwise rotation button for image documents." },
  { name: "showFullscreen", type: "boolean", default: "true", description: "When true, renders the fullscreen toggle button." },
  { name: "showSidebarToggle", type: "boolean", default: "true", description: "When true, renders the panel collapse/expand button." },
  { name: "actions", type: "ReactNode", default: "undefined", description: "Custom JSX slot for rendering action buttons (e.g. 'Sign Resolution', 'Endorse')." },
];

const sidebarProps = [
  { name: "width", type: "string", default: "'w-80'", description: "Tailwind width utility class for the open sidebar container." },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes for styling the sidebar interior." },
];

const dialogProps = [
  { name: "trigger", type: "ReactNode", default: "", description: "The button or trigger element that launches the modal dialog." },
  { name: "url", type: "string", default: "", description: "Forwarded document source URL." },
  { name: "title", type: "ReactNode", default: "undefined", description: "Forwarded document title." },
  { name: "children", type: "ReactNode", default: "", description: "Toolbar, Canvas, and Sidebar nodes rendered inside the modal." },
];


export default async function DocumentViewerPage() {
  const previewRawCode = getCode("registry/new-york/example/document-viewer-demo.tsx");
  const previewHtml = await highlightCode(previewRawCode);
  const dmsUsageHtml = await highlightCode(dmsUsageCode, "tsx");
  const lightboxUsageHtml = await highlightCode(lightboxUsageCode, "tsx");

  const headerBadges = (
    <>
      <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider">
        React
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium">
        DMS Workspace
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
        PDF & Scanned Preview
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Document Viewer"
        description="A feature-rich, responsive, and composable document viewing component system. Built specifically for Municipal LGU Document Management Systems, Ordinance Archives, and Purchase Request tracking."
        badges={headerBadges}
      />

      <div className="space-y-16">

        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Explore three municipal viewing scenarios: Full DMS Workspace with Routing Sidebar, Scanned Leave Form Image Mode, and Lightbox Dialog Modal."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <DocumentViewerDemo />
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

        {/* DMS Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="DMS Workspace Layout"
            description="Integrate a metadata sidebar and sign-off action buttons directly into your workspace view."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={dmsUsageCode} html={dmsUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Lightbox Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Dialog Lightbox Mode"
            description="Wrap your viewer with DocumentViewerDialog to launch documents in a full-screen overlay popup."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={lightboxUsageCode} html={lightboxUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Props: Root */}
        <section className="space-y-6">
          <DocsSectionHeading title="DocumentViewer Props" description="Root container configuration." />
          <PropsTable data={rootProps} />
        </section>

        {/* Props: Toolbar */}
        <section className="space-y-6">
          <DocsSectionHeading title="DocumentViewerToolbar Props" description="Header toolbar configuration." />
          <PropsTable data={toolbarProps} />
        </section>

        {/* Props: Sidebar */}
        <section className="space-y-6">
          <DocsSectionHeading title="DocumentViewerSidebar Props" description="Collapsible side panel configuration." />
          <PropsTable data={sidebarProps} />
        </section>

        {/* Props: Dialog */}
        <section className="space-y-6">
          <DocsSectionHeading title="DocumentViewerDialog Props" description="Lightbox popup overlay configuration." />
          <PropsTable data={dialogProps} />
        </section>

      </div>
    </div>
  );
}


