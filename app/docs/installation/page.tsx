import * as React from "react"
import { CodeBlock } from "@/components/code-block"
import { DocsHeader } from "@/components/docs-header"
import { DocsSectionHeading } from "@/components/docs-section-heading"

export default function InstallationPage() {
  return (
    <div className="flex flex-col gap-6">
      <DocsHeader
        title="Installation"
        description="Step-by-step guide to setting up MICTO UI KIT in your project."
        category="Getting Started"
      />

      <section className="space-y-4">
        <DocsSectionHeading 
          title="1. Initialize shadcn/ui" 
          description="Ensure you have a shadcn/ui project ready." 
        />
        <CodeBlock code="npx shadcn@latest init" language="shell" />
      </section>

      <section className="space-y-4">
        <DocsSectionHeading 
          title="2. Add MICTO Components" 
          description="Use our registry URL to add specific components." 
        />
        <CodeBlock 
          code="npx shadcn@latest add https://micto-ui-kit.misangono.net/r/inertia-pagination.json" 
          language="shell" 
        />
      </section>
    </div>
  )
}
