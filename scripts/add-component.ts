import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import prompts from "prompts"

// ─── Utilities ───────────────────────────────────────────────────────────────

const toPascalCase = (str: string) =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")

const toTitleCase = (str: string) =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

// ─── Main Logic ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Initializing component scaffolder...\n")

  const response = await prompts([
    {
      type: "text",
      name: "name",
      message: "Component name (slug-case, e.g. 'data-card'):",
      validate: (value) => (value.length > 0 ? true : "Name is required"),
    },
    {
      type: "text",
      name: "title",
      message: "Display title:",
      initial: (prev) => toTitleCase(prev),
    },
    {
      type: "text",
      name: "description",
      message: "Short description:",
      initial: "A professional LGU component.",
    },
  ])

  if (!response.name) return

  const name = response.name.toLowerCase().trim()
  const title = response.title
  const description = response.description
  const pascalName = toPascalCase(name)

  const paths = {
    registry: `registry/new-york/ui/${name}.tsx`,
    link: `components/ui/${name}.tsx`,
    demo: `registry/new-york/example/${name}-demo.tsx`,
    doc: `app/docs/components/${name}/page.tsx`,
  }

  // 1. Registry File
  const registryContent = `import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * @title ${title}
 * @description ${description}
 * @category react, component
 */
const ${pascalName} = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}
    {...props}
  />
))
${pascalName}.displayName = "${pascalName}"

export { ${pascalName} }
`

  // 2. Link File
  const linkContent = `export * from "@/registry/new-york/ui/${name}";\n`

  // 3. Demo File
  const demoContent = `import { ${pascalName} } from "@/components/ui/${name}"

export default function ${pascalName}Demo() {
  return (
    <${pascalName} className="max-w-md">
      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight">${title} Demo</h3>
        <p className="text-sm text-muted-foreground">
          ${description}
        </p>
        <div className="pt-4">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full w-2/3 bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </${pascalName}>
  )
}
`

  // 4. Doc Page
  const docContent = `import * as React from "react";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import ${pascalName}Demo from "@/registry/new-york/example/${name}-demo";

export default async function ${pascalName}Page() {
  const previewRawCode = getCode("registry/new-york/example/${name}-demo.tsx");
  const previewHtml = await highlightCode(previewRawCode);

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="${title}"
        description="${description}"
      />

      <div className="space-y-16">
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Basic usage and styling of the ${title} component."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <${pascalName}Demo />
          </ComponentPreview>
        </section>

        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install via the CLI."
          />
          <div className="rounded-xl border bg-muted/40 p-6 font-mono text-sm">
            npx shadcn@latest add https://micto-ui-kit.misangono.net/r/${name}.json
          </div>
        </section>
      </div>
    </div>
  );
}
`

  console.log(`\n🏗️  Scaffolding ${name}...\n`)

  const write = (p: string, content: string) => {
    const dir = path.dirname(p)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(p, content)
    console.log(`✅ Created: ${p}`)
  }

  write(paths.registry, registryContent)
  write(paths.link, linkContent)
  write(paths.demo, demoContent)
  write(paths.doc, docContent)

  console.log("\n🔄 Running registry:fresh to register the new component...")
  try {
    execSync(`pnpm registry:fresh --all`, { stdio: "inherit" })
    console.log("\n✨ Success! Your new component is ready.")
    console.log(`👉 Preview at: http://localhost:3000/docs/components/${name}`)
  } catch (error) {
    console.error("\n❌ Error during registry sync.")
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
