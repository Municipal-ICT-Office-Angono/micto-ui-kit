import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import prompts from "prompts"

// ─── Configuration ───────────────────────────────────────────────────────────

const REGISTRY_PATH = path.join(process.cwd(), "registry.json")
const PACKAGE_JSON_PATH = path.join(process.cwd(), "package.json")
const UI_DIR = path.join(process.cwd(), "registry/new-york/ui")
const MICTO_DIR = path.join(process.cwd(), "registry/new-york/micto")
const INERTIA_DIR = path.join(process.cwd(), "registry/new-york/inertia")
const HOOKS_DIR = path.join(process.cwd(), "registry/new-york/hooks")

// ─── Types ───────────────────────────────────────────────────────────────────

interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  registryDependencies?: string[]
  dependencies?: string[]
  files: { path: string; type: string; target?: string }[]
  categories?: string[]
  hidden?: boolean
}

interface Registry {
  items: RegistryItem[]
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function getFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir)
  let result: string[] = []
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      result = result.concat(getFilesRecursively(fullPath))
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      result.push(fullPath)
    }
  }
  return result
}

function parseJSDoc(content: string) {
  // Find all JSDoc blocks
  const jsDocBlocks = content.match(/\/\*\*([\s\S]*?)\*\//g) || []

  // Find the block that specifically contains a @title tag
  const mainBlock = jsDocBlocks.find(block => block.includes("@title")) || ""

  // Clean up the block: remove leading stars and trim lines
  const cleanBlock = mainBlock
    .replace(/^\/\*\*|\*\/$/g, "") // Remove /** and */
    .split("\n")
    .map(line => line.replace(/^\s*\*\s?/, "").trim()) // Remove leading * and trim
    .join("\n")

  const title = cleanBlock.match(/@title\s+(.*)/)?.[1]?.trim()
  const description = cleanBlock.match(/@description\s+(.*)/)?.[1]?.trim()
  const categoriesRaw = cleanBlock.match(/@categor(?:y|ies)\s+(.*)/)?.[1]?.trim()
  const categories = categoriesRaw
    ? categoriesRaw.split(",").map(c => c.trim()).filter(c => c && c !== "*/")
    : undefined

  // Look for @hidden anywhere in the file's JSDoc blocks
  const hidden = jsDocBlocks.some(block => block.includes("@hidden"))

  return { title, description, categories, hidden }
}

function extractDependencies(content: string, packageJson: any) {
  const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g
  const registryDeps = new Set<string>()
  const deps = new Set<string>()

  let match
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1]
    if (!importPath) continue

    if (importPath.startsWith("@/components/ui/")) {
      const name = importPath.replace("@/components/ui/", "").replace(/\.(tsx|ts)$/, "")
      registryDeps.add(name)
    } else if (importPath.startsWith("@/components/micto/")) {
      const name = importPath.replace("@/components/micto/", "").replace(/\.(tsx|ts)$/, "")
      registryDeps.add(`micto/${name}`)
    } else if (importPath.startsWith("@/components/inertia/")) {
      const name = importPath.replace("@/components/inertia/", "").replace(/\.(tsx|ts)$/, "")
      registryDeps.add(`inertia/${name}`)
    } else if (importPath.startsWith("@/hooks/")) {
      const name = importPath.replace("@/hooks/", "").replace(/\.(tsx|ts)$/, "")
      registryDeps.add(`hooks/${name}`)
    } else if (!importPath.startsWith(".") && !importPath.startsWith("@/")) {
      // Check if it's in package.json dependencies
      const pkgName = importPath.startsWith("@")
        ? importPath.split("/").slice(0, 2).join("/")
        : importPath.split("/")[0]

      if (pkgName && (packageJson.dependencies?.[pkgName] || packageJson.devDependencies?.[pkgName])) {
        if (!["react", "react-dom", "next", "lucide-react"].includes(pkgName)) {
          deps.add(pkgName)
        }
      }
    }
  }

  return {
    registryDependencies: Array.from(registryDeps),
    dependencies: Array.from(deps)
  }
}

// ─── Main Logic ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🔍 Scanning registry components...")

  const registry: Registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"))
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"))

  const uiFiles = getFilesRecursively(UI_DIR)
  const mictoFiles = getFilesRecursively(MICTO_DIR)
  const inertiaFiles = getFilesRecursively(INERTIA_DIR)
  const hooksFiles = getFilesRecursively(HOOKS_DIR)
  const allFiles = [...uiFiles, ...mictoFiles, ...inertiaFiles, ...hooksFiles]

  const components = allFiles.map(file => {
    const relativePath = path.relative(process.cwd(), file).replace(/\\/g, "/")
    const fileName = path.basename(file, path.extname(file))

    // Determine the category prefix based on the folder
    let name = fileName
    if (file.includes(MICTO_DIR)) name = `micto/${fileName}`
    if (file.includes(HOOKS_DIR)) name = `hooks/${fileName}`
    if (file.includes(INERTIA_DIR)) name = `inertia/${fileName}`

    return { name, path: relativePath, fullPath: file }
  })

  // Handle CLI arguments or interactive menu
  const args = process.argv.slice(2)
  let selectedComponents = []

  if (args.includes("--all")) {
    selectedComponents = components
  } else if (args.length > 0) {
    const targetNames = args.filter(a => !a.startsWith("--"))
    selectedComponents = components.filter(c => targetNames.includes(c.name))
  } else {
    const response = await prompts({
      type: "multiselect",
      name: "components",
      message: "Select components to refresh in registry:",
      choices: components.map(c => ({ title: c.name, value: c })),
      instructions: false
    })
    selectedComponents = response.components || []
  }

  if (selectedComponents.length === 0) {
    console.log("❌ No components selected. Exiting.")
    return
  }

  // 3. Remove items from registry.json that no longer exist on disk
  const initialCount = registry.items.length
  registry.items = registry.items.filter(item => {
    // Check if the primary file for the component still exists
    const exists = item.files.some(f => fs.existsSync(path.join(process.cwd(), f.path)))
    if (!exists) {
      console.log(`🗑️  Removing from manifest (orphaned): ${item.name}`)
    }
    return exists
  })

  if (registry.items.length < initialCount) {
    console.log(`🧹 Cleaned up ${initialCount - registry.items.length} orphaned components from manifest.\n`)
  }

  console.log(`\n🔄 Processing ${selectedComponents.length} components...\n`)

  for (const component of selectedComponents) {
    const content = fs.readFileSync(component.fullPath, "utf8")
    const fileName = path.basename(component.fullPath, path.extname(component.fullPath))
    const meta = parseJSDoc(content)
    const { registryDependencies, dependencies } = extractDependencies(content, packageJson)

    const existingItemIndex = registry.items.findIndex(item => item.name === component.name)
    const existingItem = existingItemIndex !== -1 ? registry.items[existingItemIndex] : null

    const cleanTitle = (str: string) => str.split(/[-/]/).pop()?.split("-").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") || str;

    let itemType = "registry:component"
    let target: string | undefined = undefined
    const fileBasename = path.basename(component.fullPath)

    if (component.fullPath.includes(MICTO_DIR)) {
      target = `@components/micto/${fileBasename}`
    } else if (component.fullPath.includes(INERTIA_DIR)) {
      target = `@components/inertia/${fileBasename}`
    } else if (component.fullPath.includes(HOOKS_DIR)) {
      itemType = "registry:hook"
      target = `@hooks/${fileBasename}`
    } else if (component.fullPath.includes(UI_DIR)) {
      itemType = "registry:ui"
      target = `@ui/${fileBasename}`
    }

    const newItem: RegistryItem = {
      name: component.name,
      type: itemType,
      title: meta.title || cleanTitle(existingItem?.title || fileName),
      description: meta.description || (existingItem ? existingItem.description : ""),
      registryDependencies: registryDependencies.length > 0 ? registryDependencies : undefined,
      dependencies: dependencies.length > 0 ? dependencies : undefined,
      hidden: meta.hidden || (existingItem ? existingItem.hidden : undefined),
      files: [
        {
          path: component.path,
          type: itemType,
          ...(target ? { target } : {})
        }
      ],
      categories: meta.categories || (existingItem ? existingItem.categories : ["react", "component"])
    }

    if (existingItemIndex !== -1) {
      console.log(`✅ Updated: ${component.name}`)
      registry.items[existingItemIndex] = newItem
    } else {
      console.log(`✨ Added: ${component.name}`)
      registry.items.push(newItem)
    }
  }

  // Save registry.json
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2))
  console.log("\n💾 registry.json updated successfully.")

  // Run build
  console.log("🏗️  Building registry...")
  try {
    execSync("pnpm run registry:build", { stdio: "inherit" })
    console.log("\n🚀 Registry synchronization complete!")
  } catch (error) {
    console.error("\n❌ Error building registry. Please check registry.json for errors.")
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
