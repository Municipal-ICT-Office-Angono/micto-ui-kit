import Link from "next/link"
import { CodeBlock } from "@/components/code-block"
import { InstallCommandTabs } from "@/components/install-command-tabs"
import { DocsHeader } from "@/components/docs-header"
import { DocsSectionHeading } from "@/components/docs-section-heading"
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react"

const initCommands = [
  { label: "pnpm", value: "pnpm dlx shadcn@latest init" },
  { label: "npm", value: "npx shadcn@latest init" },
  { label: "bun", value: "bunx shadcn@latest init" },
  { label: "yarn", value: "yarn dlx shadcn@latest init" },
]

const addCommands = [
  { label: "pnpm", value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/data-table.json" },
  { label: "npm", value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/data-table.json" },
  { label: "bun", value: "bunx shadcn@latest add https://micto-ui-kit.misangono.net/r/data-table.json" },
  { label: "yarn", value: "yarn dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/data-table.json" },
]

const addAllCommands = [
  { label: "pnpm", value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/inertia-pagination.json https://micto-ui-kit.misangono.net/r/confirm-dialog.json" },
  { label: "npm", value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/inertia-pagination.json https://micto-ui-kit.misangono.net/r/confirm-dialog.json" },
]

export default function InstallationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8 font-sans">
      <DocsHeader
        title="Installation Guide"
        description="Comprehensive, step-by-step instructions to set up, configure, and integrate the MICTO UI Kit into your modern React, Next.js, or Laravel Inertia.js applications."
        category="Getting Started"
      />

      {/* Prerequisites */}
      <section className="space-y-6">
        <DocsSectionHeading
          title="Prerequisites"
          description="Ensure your development environment meets the following baseline requirements before installing components."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-background p-5 flex items-start gap-3.5 shadow-sm">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">React 18 or 19</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fully compatible with Server Components, Concurrent Mode, and Next.js App Router architectures.
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-5 flex items-start gap-3.5 shadow-sm">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">Tailwind CSS v4</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Utilizes modern CSS first-class variables (`@theme inline`), avoiding legacy config wrappers.
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-5 flex items-start gap-3.5 shadow-sm">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">TypeScript v5+</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Components ship with clear, helpful TypeScript type definitions out of the box.
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-5 flex items-start gap-3.5 shadow-sm">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">shadcn/ui CLI</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Seamlessly integrates with the standard shadcn CLI for effortless component installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1 */}
      <section className="space-y-6">
        <DocsSectionHeading
          title="1. Initialize shadcn CLI"
          description="If you haven't already initialized shadcn in your project, run the initialization command. This configures your `components.json` and CSS variables."
        />
        <div className="rounded-xl border bg-muted/20 p-2 shadow-sm">
          <InstallCommandTabs commands={initCommands} defaultValue="pnpm" />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          When prompted, select your preferred styling configuration (e.g. CSS variables, Tailwind base colors).
        </p>
      </section>

      {/* Step 2 */}
      <section className="space-y-6">
        <DocsSectionHeading
          title="2. Add MICTO UI Kit Components"
          description="You can add any component directly from our custom registry URL. Pass the exact JSON endpoint of the component you wish to install."
        />
        <div className="space-y-4">
          <p className="text-xs font-medium text-foreground">Example: Installing Data Table</p>
          <div className="rounded-xl border bg-muted/20 p-2 shadow-sm">
            <InstallCommandTabs commands={addCommands} defaultValue="pnpm" />
          </div>

          <p className="text-xs font-medium text-foreground mt-6">Example: Installing Multiple Components Simultaneously</p>
          <div className="rounded-xl border bg-muted/20 p-2 shadow-sm">
            <InstallCommandTabs commands={addAllCommands} defaultValue="pnpm" />
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="space-y-6">
        <DocsSectionHeading
          title="3. Global Styles & Theme Configuration"
          description="Ensure your global CSS file imports Tailwind and shadcn base styles correctly. In Tailwind v4, your `globals.css` should look like this:"
        />
        <div className="rounded-xl border overflow-hidden shadow-sm">
          <CodeBlock
            code={`@import "tailwindcss";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ...other tokens */
}`}
            language="shell"
          />
        </div>
      </section>

      {/* Next Steps */}
      <section className="rounded-xl border bg-background p-8 text-center space-y-4 shadow-sm">
        <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
          <BookOpen className="size-6" />
        </div>
        <h3 className="font-bold text-lg text-foreground tracking-tight">Installation Complete</h3>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Your project is now fully configured! Explore our extensive component documentation to see API usage, props, and live demos.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/docs/components/data-table"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md"
          >
            Explore Data Table
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
          <Link
            href="/docs/components/inertia-pagination"
            className="inline-flex items-center justify-center rounded-lg border bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted/40 shadow-sm"
          >
            Inertia Pagination
          </Link>
        </div>
      </section>
    </div>
  )
}
