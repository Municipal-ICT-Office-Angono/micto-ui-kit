import * as React from "react";
import Link from "next/link";
import {
  MoveRight,
  Search,
  CheckCircle2,
  Layout,
  Database,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Build Giants for the <br />
                <span className="text-primary text-balance">Art Capital.</span>
              </h1>
              <p className="max-w-[540px] text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Empowering Angono’s developers with a professional UI Kit that stands tall. 
                Fusing the creative spirit of the Art Capital with high-performance 
                Inertia.js components.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Button
                asChild
                size="lg"
                className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all px-8"
              >
                <Link href="/docs/introduction">
                  Get Started
                  <MoveRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 backdrop-blur-sm"
              >
                <Link href="/docs/components/confirm-dialog">
                  Explore Components
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary/60" />
                <span>React, InertiaJS compatible</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Playground */}
          <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-200 mt-12 lg:mt-0 scale-75 sm:scale-100 transition-transform">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full scale-150 rotate-12" />

            {/* Component Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Floating Card 1: Confirm snippet */}
              <div className="absolute top-0 left-0 p-6 glass bg-card/40 rounded-2xl w-64 rotate-[-6deg] shadow-2xl animate-float z-1 translate-x-4 translate-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Layout className="size-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">Delete Page?</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    This action is permanent and will remove all associated
                    data.
                  </p>
                  <div className="flex justify-end gap-2 mt-2">
                    <div className="h-7 w-16 rounded bg-muted/50" />
                    <div className="h-7 w-16 rounded bg-primary shadow-sm shadow-primary/20" />
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Main UI showcase */}
              <div className="p-1 items-stretch glass rounded-3xl w-80 shadow-2xl z-10 scale-105 border-primary/20">
                <div className="bg-background rounded-[22px] p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                        <Database className="size-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Real-time Data</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                          Inertia Native
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                      <Search className="size-4" />
                    </div>
                    <div className="w-full h-10 rounded-lg border bg-muted/10 pl-10" />
                  </div>

                  <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-border hover:bg-muted/5 transition-all group"
                      >
                        <div className="size-8 rounded-md bg-muted group-hover:scale-105 transition-transform" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 w-1/2 rounded bg-muted" />
                          <div className="h-2 w-1/3 rounded bg-muted/80" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Card 3: Status snippet */}
              <div className="absolute bottom-4 right-0 p-5 bg-card rounded-2xl w-56 rotate-[8deg] shadow-2xl translate-y-4 z-20 -translate-x-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-12">
                    <svg className="size-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted/20 stroke-current"
                        strokeWidth="10"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset="60"
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                      75%
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight">
                      Optimization
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      System Healthy
                    </span>
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
