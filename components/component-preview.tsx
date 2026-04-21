"use client"

import * as React from "react"
import { Eye, Code2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"
import { cn } from "@/lib/utils"

interface ComponentPreviewProps {
  children: React.ReactNode
  code: string
  html?: string
  className?: string
}

export function ComponentPreview({
  children,
  code,
  html,
  className,
}: ComponentPreviewProps) {
  return (
    <Tabs defaultValue="preview" className={cn("w-full space-y-4", className)}>
      <div className="flex items-center justify-between">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger
            value="preview"
            className="gap-2 px-4 py-1.5 transition-all"
          >
            <Eye className="size-3.5" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="gap-2 px-4 py-1.5 transition-all"
          >
            <Code2 className="size-3.5" />
            Code
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="preview" className="mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <div className="relative rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 min-h-[350px] flex items-center justify-center p-10 overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          <div className="relative w-full flex justify-center animate-in fade-in zoom-in-95 duration-500">
            {children}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="code" className="mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <CodeBlock 
            code={code} 
            html={html}
            language="tsx" 
            className="rounded-xl border shadow-sm" 
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
