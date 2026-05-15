import * as React from "react";
import Link from "next/link";
import {
  MoveRight,
  Search,
  CheckCircle2,
  Sliders,
  CheckSquare,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background font-sans">
      {/* Crisp Dotted Pattern Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-border/50" />

      <div className="container relative mx-auto px-6 py-16 lg:py-28 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left gap-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground">
                Build Digital Giants in the {" "}
                <span className="text-primary mt-1.5">Art Capital.</span>
              </h1>
              <p className="max-w-[560px] text-base sm:text-lg text-muted-foreground leading-relaxed">
                Empowering MICTO developers with a modern, technology-driven design system. 
                We fuse Angono’s creative heritage with high-performance React and Laravel Inertia.js components to craft innovative municipal web applications.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2">
              <Button
                asChild
                size="lg"
                className="transition-all px-7 h-12 text-sm font-semibold shadow-md"
              >
                <Link href="/docs/introduction">
                  Get Started
                  <MoveRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-7 h-12 text-sm font-semibold border-border hover:bg-muted/40"
              >
                <Link href="/docs/components/micto/data-table">
                  Browse Components
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground/80 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>TanStack Table v8</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Inertia.js Native</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Accessible RBAC</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Playground Mockup (5 cols) */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center animate-in fade-in zoom-in duration-700 delay-150">
            <div className="w-full max-w-lg rounded-2xl border bg-card text-card-foreground shadow-2xl overflow-hidden flex flex-col">
              {/* Mockup Header Bar */}
              <div className="px-4 py-3 border-b bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] font-mono text-muted-foreground bg-background px-3 py-0.5 rounded-md border shadow-2xs">
                  micto-ui-kit.misangono.net
                </div>
                <div className="size-4" />
              </div>

              {/* Mockup Body Content */}
              <div className="p-6 space-y-6">
                {/* Search & Actions Bar */}
                <div className="flex items-center gap-3 justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <div className="h-9 w-full rounded-lg border bg-muted/20 pl-9 pr-3 text-xs flex items-center text-muted-foreground/70">
                      Search municipal records...
                    </div>
                  </div>
                  <div className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 shadow-sm">
                    <Sliders className="size-3.5" />
                    <span>Filter</span>
                  </div>
                </div>

                {/* Data Table Mock */}
                <div className="rounded-xl border overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-b text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="size-3.5 text-primary" />
                      <span>Employee Name</span>
                    </div>
                    <span>Status</span>
                  </div>

                  <div className="divide-y divide-border/60 text-xs">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3 font-medium">
                        <div className="size-3.5 rounded border border-muted-foreground/40" />
                        <span>Nehry Dedoro</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3 font-medium">
                        <div className="size-3.5 rounded border border-muted-foreground/40" />
                        <span>Erwin Robles</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3 font-medium text-muted-foreground">
                        <div className="size-3.5 rounded border border-muted-foreground/40" />
                        <span>Ian Aguinaldo</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                        Archived
                      </span>
                    </div>
                     <div className="px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3 font-medium text-muted-foreground">
                        <div className="size-3.5 rounded border border-muted-foreground/40" />
                        <span>Keith Cruz</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                        Archived
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overlays Widget Panel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4 bg-muted/10 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <UploadCloud className="size-4 text-sky-600 dark:text-sky-400" />
                      <span className="text-[10px] font-mono">100%</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold">File Uploader</p>
                      <p className="text-[10px] text-muted-foreground">Strict MIME checking</p>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4 bg-muted/10 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[10px] font-mono">RBAC</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold">Permission Guard</p>
                      <p className="text-[10px] text-muted-foreground">Role ownership</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
