import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import ConfirmDemo from "@/registry/new-york/example/confirm-demo";
import Link from "next/link";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/confirm.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/confirm.json",
  },
];

const basicUsage = `import { confirm } from "@/components/ui/confirm"

export function DeleteButton() {
  const handleDelete = async () => {
    const ok = await confirm({
      title: "Are you absolutely sure?",
      body: "This action cannot be undone. This will permanently delete your account.",
      icon: "danger",
      confirmText: "Delete Account",
    });

    if (ok) {
      // Proceed with deletion
    }
  }

  return <Button onClick={handleDelete}>Delete</Button>
}`;

const setupCode = `import { ConfirmProvider } from "@/components/ui/confirm"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ConfirmProvider />
      </body>
    </html>
  )
}`;

const propsData = [
  {
    name: "title",
    type: "string",
    default: "undefined",
    description: "The title of the dialog shown in bold.",
  },
  {
    name: "body",
    type: "string | ReactNode",
    default: "required",
    description: "The main content of the alert. Supports custom components.",
  },
  {
    name: "icon",
    type: "'warning' | 'danger' | 'info' | 'ghost'",
    default: "'warning'",
    description: "The visual style and Lucide icon to display.",
  },
  {
    name: "confirmText",
    type: "string",
    default: "'Confirm'",
    description: "Text for the primary action button.",
  },
  {
    name: "cancelText",
    type: "string",
    default: "'Cancel'",
    description: "Text for the secondary/dismiss action button.",
  },
  {
    name: "onConfirm",
    type: "() => Promise<boolean | void> | boolean | void",
    default: "undefined",
    description:
      "Optional async handler called when confirming. Returning false prevents closing.",
  },
  {
    name: "onCancel",
    type: "() => void",
    default: "undefined",
    description: "Optional callback called when the dialog is dismissed or cancelled.",
  },
  {
    name: "size",
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: "The width and text size profile of the dialog.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description:
      "Tailwind classes to override the dialog styling (e.g. width, text-alignment).",
  },
  {
    name: "dismissable",
    type: "boolean",
    default: "true",
    description: "Whether clicking the backdrop closes the dialog.",
  },
];

const providerProps = [
  {
    name: "defaultSize",
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: "Setting a project-wide default size for all confirmations.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Styling the backdrop and stack container globally.",
  },
];

export default async function ConfirmDialogPage() {
  const demoRawCode = getCode("registry/new-york/example/confirm-demo.tsx");
  const demoHtml = await highlightCode(demoRawCode);
  const setupHtml = await highlightCode(setupCode);
  const usageHtml = await highlightCode(basicUsage);

  const headerBadges = (
    <>
      <Badge
        variant="secondary"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider"
      >
        Singleton
      </Badge>
      <Badge
        variant="outline"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium"
      >
        Promise-Based
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Global Confirm"
        description="A singleton, promise-based confirmation system inspired by Sonner. Handles multiple stacked dialogs with ease."
        badges={headerBadges}
      />

      {/* Preview Section */}
      <section className="space-y-6">
        <DocsSectionHeading
          title="Interactive Demo"
          description="Test the functional API. Notice how dialogs stack and scale when triggered simultaneously."
        />
        <ComponentPreview code={demoRawCode} html={demoHtml}>
          <ConfirmDemo />
        </ComponentPreview>
      </section>

      {/* Installation Section */}
      <section className="space-y-6">
        <DocsSectionHeading title="Installation" />
        <div className="rounded-xl border bg-muted/40 p-1">
          <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
        </div>
      </section>

      {/* Setup Section */}
      <section className="space-y-6">
        <DocsSectionHeading
          title="Setup"
          description="Add the ConfirmProvider to your root layout or app component. This ensures the confirmation stack is available globally."
        />
        <div className="overflow-hidden rounded-xl border">
          <CodeBlock code={setupCode} html={setupHtml} language="tsx" />
        </div>
      </section>

      {/* Usage Section */}
      <section className="space-y-6">
        <DocsSectionHeading
          title="Functional API Usage"
          description="Import confirm and await the result. No component wrapping or local state required per call."
        />
        <div className="overflow-hidden rounded-xl border">
          <CodeBlock code={basicUsage} html={usageHtml} language="tsx" />
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-6 text-foreground">
        <DocsSectionHeading
          title="API Reference"
          description="Options passed to the lifecycle functions."
        />

        <div className="space-y-4 font-sans text-muted-foreground">
          <h3 className="text-lg font-semibold text-foreground/80">
            confirm(options)
          </h3>
          <div className="rounded-xl border overflow-hidden shadow-sm bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[150px] font-bold text-foreground/80 lowercase tracking-tight">
                    Prop
                  </TableHead>
                  <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">
                    Type
                  </TableHead>
                  <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">
                    Default
                  </TableHead>
                  <TableHead className="text-right font-bold text-foreground/80 lowercase tracking-tight">
                    Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propsData.map((prop) => (
                  <TableRow
                    key={prop.name}
                    className="border-b transition-colors hover:bg-muted/5"
                  >
                    <TableCell className="font-mono text-xs font-semibold text-primary/80">
                      {prop.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-blue-600 dark:text-blue-400">
                      {prop.type}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground/70">
                      {prop.default}
                    </TableCell>
                    <TableCell className="text-right text-xs leading-relaxed max-w-[300px] text-muted-foreground">
                      {prop.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4 pt-4 font-sans text-muted-foreground">
          <h3 className="text-lg font-semibold text-foreground/80">
            ConfirmProvider
          </h3>
          <div className="rounded-xl border overflow-hidden shadow-sm bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[150px] font-bold text-foreground/80 lowercase tracking-tight">
                    Prop
                  </TableHead>
                  <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">
                    Type
                  </TableHead>
                  <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">
                    Default
                  </TableHead>
                  <TableHead className="text-right font-bold text-foreground/80 lowercase tracking-tight">
                    Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providerProps.map((prop) => (
                  <TableRow
                    key={prop.name}
                    className="border-b transition-colors hover:bg-muted/5"
                  >
                    <TableCell className="font-mono text-xs font-semibold text-primary/80">
                      {prop.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-blue-600 dark:text-blue-400">
                      {prop.type}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground/70">
                      {prop.default}
                    </TableCell>
                    <TableCell className="text-right text-xs leading-relaxed max-w-[300px] text-muted-foreground">
                      {prop.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}
