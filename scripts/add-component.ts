import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import prompts from "prompts"
import { docsConfig } from "../config/docs"

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
      type: "select",
      name: "folder",
      message: "Target category:",
      choices: [
        { title: "Micto (UI Components)", value: "micto" },
        { title: "Inertia (Laravel/Inertia Components)", value: "inertia" },
        { title: "Hooks (React Hooks)", value: "hooks" },
      ],
      initial: 0,
    },
    {
      type: "text",
      name: "title",
      message: "Display title:",
      initial: (_, values) => toTitleCase(values.name),
    },
    {
      type: "text",
      name: "description",
      message: "Short description:",
      initial: "A professional LGU component.",
    },
    {
      type: "multiselect",
      name: "categories",
      message: "Select tags (for search/filtering):",
      choices: docsConfig.categories.map(c => ({ title: c.label, value: c.value })),
    },
    {
      type: "toggle",
      name: "showInNav",
      message: "Show in navigation?",
      initial: true,
      active: "yes",
      inactive: "no",
    },
  ])

  if (!response.name) return

  const name = response.name.toLowerCase().trim()
  const folder = response.folder
  const title = response.title
  const description = response.description
  const categories = response.categories || ["react", "component"]
  const showInNav = response.showInNav
  const pascalName = toPascalCase(name)
  const isHook = folder === "hooks"
  const ext = isHook ? "ts" : "tsx"

  const paths = {
    registry: `registry/new-york/${folder}/${name}.${ext}`,
    link: `components/${folder}/${name}.${ext}`,
    demo: `registry/new-york/example/${name}-demo.tsx`,
    doc: `app/docs/components/${folder}/${name}/page.tsx`,
  }

  // 1. Registry File
  const registryContent = `${!isHook ? '"use client";\n\n' : ""}/**
 * @title ${title}
 * @description ${description}
 * @categories ${categories.join(", ")}${folder !== "micto" ? `, ${folder}` : ""}
${!showInNav ? " * @hidden true\n" : ""}*/
${isHook ? "" : 'import * as React from "react"\nimport { cn } from "@/lib/utils"\n\n'}export interface ${pascalName}Props ${isHook ? "= {}" : `extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}`}

export ${isHook ? "function" : "const"} ${isHook ? "use" + pascalName : pascalName} = ${isHook ? "() => {}" : `React.forwardRef<
  HTMLDivElement,
  ${pascalName}Props
>(({ className, title, description, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}
    {...props}
  >
    <div className="space-y-1.5">
      {title && (
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
))
${pascalName}.displayName = "${pascalName}"`}
`

  // 2. Link File
  const linkContent = `export * from "@/registry/new-york/${folder}/${name}";\n`

  // 3. Demo File
  const demoContent = `import { ${isHook ? "use" + pascalName : pascalName} } from "@/components/${folder}/${name}"

export default function ${pascalName}Demo() {
  ${isHook ? `const {} = use${pascalName}()` : ""}
  return (
    <div className="flex items-center justify-center p-8">
      <${isHook ? "div" : pascalName} 
        title="${title} Example" 
        description="This is a live demo of the ${title} component generated via the MICTO scaffolder."
        className="max-w-[400px]"
      >
        <div className="flex items-center gap-2 pt-2">
          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-1/3 bg-primary animate-pulse" />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Processing
          </span>
        </div>
      </${isHook ? "div" : pascalName}>
    </div>
  )
}
`

  // 4. Doc Page
  const docContent = `import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import ${pascalName}Demo from "@/registry/new-york/example/${name}-demo";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/${folder}/${name}.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/${folder}/${name}.json",
  },
];

const usageCode = \`import { ${isHook ? "use" + pascalName : pascalName} } from "@/components/${folder}/${name}"

export default function Example() {
  return (
    <${isHook ? "div" : pascalName} 
      title="${title}"
      description="${description}"
    >
      {/* Implementation */}
    </${isHook ? "div" : pascalName}>
  )
}\`;

export default async function ${pascalName}Page() {
  const previewRawCode = getCode("registry/new-york/example/${name}-demo.tsx");
  const previewHtml = await highlightCode(previewRawCode);
  const usageHtml = await highlightCode(usageCode, "tsx");

  const headerBadges = (
    <>
      <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider">
        React
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium">
        ${folder.charAt(0).toUpperCase() + folder.slice(1)}
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="${title}"
        description="${description}"
        badges={headerBadges}
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
            description="Install via the shadcn CLI."
          />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
          </div>
        </section>

        <section className="space-y-6">
          <DocsSectionHeading
            title="Usage"
            description="How to use the component in your application."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={usageCode} html={usageHtml} language="tsx" />
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
    console.log(`👉 Preview at: http://localhost:3000/docs/components/${folder}/${name}`)
  } catch (error) {
    console.error("\n❌ Error during registry sync.")
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
