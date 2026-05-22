import Link from "next/link"
import { DocsHeader } from "@/components/docs-header"
import { DocsSectionHeading } from "@/components/docs-section-heading"
import { ArrowRight, Sparkles, Layers, ShieldCheck, Database } from "lucide-react"

export default function IntroductionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8 font-sans">
      <DocsHeader
        title="Introduction"
        description="Welcome to the Municipal ICT Office (MICTO) UI Kit. A professional, accessible collection of reusable React components designed specifically for building reliable, citizen-centric government web applications."
        category="Getting Started"
      />

      {/* Core Principles */}
      <section className="space-y-6">
        <DocsSectionHeading
          title="Architectural Principles"
          description="Every component in the MICTO UI Kit is built with strict adherence to modern web standards, modularity, and excellent developer experience."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-background p-6 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-all group-hover:bg-primary/10 -z-10" />
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <Layers className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground tracking-tight">Registry Driven</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Components are distributed via our custom shadcn CLI registry. Add exactly what you need without bloating your project.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-6 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-full transition-all group-hover:bg-sky-500/10 -z-10" />
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-4">
              <Database className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground tracking-tight">Server Optimized</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Engineered for seamless integration with TanStack Query, Next.js App Router, and Laravel Inertia.js server-side pagination.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-6 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full transition-all group-hover:bg-emerald-500/10 -z-10" />
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground tracking-tight">Accessible & Inclusive</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Built on Radix UI primitives with clear TypeScript definitions. Designed to ensure standard WAI-ARIA compliance and keyboard navigability for all citizens.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="rounded-xl border bg-background p-8 text-center space-y-4 shadow-sm">
        <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
          <Sparkles className="size-6" />
        </div>
        <h3 className="font-bold text-lg text-foreground tracking-tight">Ready to get started?</h3>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Set up your development environment and configure your CLI to start adding MICTO UI components instantly.
        </p>
        <div className="pt-2">
          <Link
            href="/docs/installation"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-md"
          >
            Installation Guide
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
