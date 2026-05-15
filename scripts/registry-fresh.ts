import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import prompts from "prompts"

// ─── Configuration ───────────────────────────────────────────────────────────

const REGISTRY_PATH = path.join(process.cwd(), "registry.json")
const PACKAGE_JSON_PATH = path.join(process.cwd(), "package.json")
const UI_DIR = path.join(process.cwd(), "registry/new-york/ui")
const INERTIA_DIR = path.join(process.cwd(), "registry/new-york/inertia")

// ─── Types ───────────────────────────────────────────────────────────────────

interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  registryDependencies?: string[]
  dependencies?: string[]
  files: { path: string; type: string }[]
  categories?: string[]
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
  const jsDocMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
  if (!jsDocMatch || !jsDocMatch[1]) return {}

  const jsDoc = jsDocMatch[1]
  const title = jsDoc.match(/@title\s+(.*)/)?.[1]?.trim()
  const description = jsDoc.match(/@description\s+(.*)/)?.[1]?.trim()
  const categories = jsDoc.match(/@category\s+(.*)/)?.[1]?.trim()?.split(",").map(c => c.trim())

  return { title, description, categories }
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
      const name = importPath.replace("@/components/ui/", "")
      registryDeps.add(name)
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
  const inertiaFiles = getFilesRecursively(INERTIA_DIR)
  const allFiles = [...uiFiles, ...inertiaFiles]

  const components = allFiles.map(file => {
    const relativePath = path.relative(process.cwd(), file).replace(/\\/g, "/")
    const name = path.basename(file, path.extname(file))
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

  console.log(`\n🔄 Processing ${selectedComponents.length} components...\n`)

  for (const component of selectedComponents) {
    const content = fs.readFileSync(component.fullPath, "utf8")
    const meta = parseJSDoc(content)
    const { registryDependencies, dependencies } = extractDependencies(content, packageJson)

    const existingItemIndex = registry.items.findIndex(item => item.name === component.name)
    const existingItem = existingItemIndex !== -1 ? registry.items[existingItemIndex] : null
    
    const newItem: RegistryItem = {
      name: component.name,
      type: "registry:component",
      title: meta.title || (existingItem ? existingItem.title : component.name),
      description: meta.description || (existingItem ? existingItem.description : ""),
      registryDependencies: registryDependencies.length > 0 ? registryDependencies : undefined,
      dependencies: dependencies.length > 0 ? dependencies : undefined,
      files: [
        {
          path: component.path,
          type: "registry:component"
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
