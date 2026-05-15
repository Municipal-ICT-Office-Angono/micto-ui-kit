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
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import PermissionGuardDemo from "@/registry/new-york/example/permission-guard-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/permission-guard.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/permission-guard.json",
  },
];

const basicUsageCode = `import { PermissionProvider, Can, RoleGuard } from "@/components/micto/permission-guard"

export default function App() {
  const user = { name: "Nehry" }
  const permissions = ["documents.view", "documents.edit"]
  const roles = ["officer"]

  return (
    <PermissionProvider user={user} permissions={permissions} roles={roles}>
      {/* 1. Standard Hide Guard */}
      <Can permission="documents.delete" mode="hide">
        <button>Delete File</button>
      </Can>

      {/* 2. Visual Disable Guard */}
      <Can permission="documents.edit" mode="disable">
        <button className="bg-primary px-4 py-2 rounded">Edit Record</button>
      </Can>

      {/* 3. Role-based Frosted Glass Guard */}
      <RoleGuard roles="admin" mode="blur">
        <div className="p-4 border bg-card">
          <h4>Admin Portal Settings</h4>
        </div>
      </RoleGuard>
    </PermissionProvider>
  )
}`;

const inertiaUsageCode = `// For Laravel / InertiaJS SPAs - zero boilerplate!
// Wrap your layout once, it auto-extracts values from usePage().props.auth.user!

import { PermissionProvider } from "@/components/micto/permission-guard"

export default function Layout({ children }) {
  return (
    <PermissionProvider>
      <main>{children}</main>
    </PermissionProvider>
  )
}`;

const canPropsData = [
  {
    name: "permission",
    type: "string",
    default: "undefined",
    description: "The specific permission key to assert (e.g. 'documents.edit'). Supports trailing wildcards (e.g. 'documents.*').",
  },
  {
    name: "mode",
    type: "'hide' | 'disable' | 'blur'",
    default: "'hide'",
    description: "Visual gating behavior on authentication failure.",
  },
  {
    name: "fallback",
    type: "ReactNode",
    default: "null",
    description: "Custom element rendered inside the unmounted target when mode='hide' or as a CTA inside the overlay card when mode='blur'.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "CSS classes applied to the outer wrapper container when using mode='disable' or mode='blur'.",
  },
];

const rolePropsData = [
  {
    name: "roles",
    type: "string | string[]",
    default: "undefined",
    description: "The classification roles required to authorize children (e.g., 'admin' or ['admin', 'manager']).",
  },
  {
    name: "match",
    type: "'any' | 'all'",
    default: "'any'",
    description: "When an array is supplied, requires either 'any' match (OR gate) or matching 'all' roles (AND gate).",
  },
  {
    name: "mode",
    type: "'hide' | 'disable' | 'blur'",
    default: "'hide'",
    description: "Visual gating behavior on authentication failure.",
  },
  {
    name: "fallback",
    type: "ReactNode",
    default: "null",
    description: "Custom element rendered in place of children.",
  },
];

export default async function PermissionGuardPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/permission-guard-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode);
  const inertiaUsageHtml = await highlightCode(inertiaUsageCode);

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
        Inertia.js Auto
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Permission Guard"
        description="A premium, robust RBAC and wildcard permission gating suite supporting stealth unmounts, visual cloning disable modes, and glowing frosted-glass overlays."
        badges={headerBadges}
      />

      {/* Main Content */}
      <div className="space-y-16">
        {/* Preview Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Toggle between role classifications and permission keys to witness immediate, beautiful layout transformations."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <PermissionGuardDemo />
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
            title="Standard React / Next.js Setup"
            description="Manually provide permissions, roles, and session items down to the provider to authorize children nested in lower sheets or tables."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={basicUsageCode} html={basicUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Usage B Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Zero-Boilerplate Inertia.js Auto-Inference"
            description="If active inside a Laravel + Inertia application, wrapping layouts with a blank provider automatically hooks into usePage().props.auth.user shared state!"
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={inertiaUsageCode} html={inertiaUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Props Reference */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Can Component API"
            description="Properties available on the <Can /> granular gating element."
          />
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
                {canPropsData.map((prop) => (
                  <TableRow
                    key={prop.name}
                    className="border-b transition-colors hover:bg-muted/5 font-sans"
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
        </section>

        {/* Props Reference B */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="RoleGuard Component API"
            description="Properties available on the <RoleGuard /> role-based gating element."
          />
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
                {rolePropsData.map((prop) => (
                  <TableRow
                    key={prop.name}
                    className="border-b transition-colors hover:bg-muted/5 font-sans"
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
        </section>
      </div>
    </div>
  );
}


