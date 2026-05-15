import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import prompts from "prompts"

async function main() {
  console.log("🗑️  Initializing component removal tool...\n")

  // 1. Scan for existing components
  const categories = ["micto", "inertia", "hooks"]
  const components: { name: string; folder: string }[] = []

  categories.forEach(folder => {
    const dir = path.join(process.cwd(), "registry/new-york", folder)
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        if (file.endsWith(".tsx") || file.endsWith(".ts")) {
          components.push({
            name: path.parse(file).name,
            folder
          })
        }
      })
    }
  })

  // 2. Check for arguments
  const nameArg = process.argv.find(arg => arg.startsWith("--name="))?.split("=")[1]
  const force = process.argv.includes("--force")
  let selectedComponent = components.find(c => c.name === nameArg)

  if (nameArg && !selectedComponent) {
    console.log(`❌ Component '${nameArg}' not found.`)
    return
  }

  // 3. Selection UI (if no name provided or not forced)
  const response = !force ? await prompts([
    {
      type: selectedComponent ? null : "autocomplete",
      name: "component",
      message: "Select component to remove:",
      choices: components.map(c => ({
        title: `${c.name} (${c.folder})`,
        value: c
      })),
    },
    {
      type: "toggle",
      name: "confirm",
      message: (prev) => {
        const comp = selectedComponent || prev
        return `Are you SURE you want to delete '${comp.name}'? This cannot be undone.`
      },
      initial: false,
      active: "yes",
      inactive: "no",
    }
  ]) : { confirm: true, component: selectedComponent }

  const component = (selectedComponent || (response as any).component)
  if (!response.confirm || !component) {
    console.log("❌ Removal cancelled.")
    return
  }

  const { name, folder } = component
  const isHook = folder === "hooks"
  const ext = isHook ? "ts" : "tsx"

  // 3. Define paths to delete
  const pathsToDelete = [
    `registry/new-york/${folder}/${name}.${ext}`,
    `components/${folder}/${name}.${ext}`,
    `registry/new-york/example/${name}-demo.tsx`,
    `app/docs/components/${folder}/${name}`,
    `public/r/${folder}/${name}.json`
  ]

  console.log(`\n🔥 Removing ${name} from ${folder}...`)

  pathsToDelete.forEach(p => {
    const fullPath = path.join(process.cwd(), p)
    if (fs.existsSync(fullPath)) {
      if (fs.lstatSync(fullPath).isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true })
      } else {
        fs.unlinkSync(fullPath)
      }
      console.log(`🗑️  Deleted: ${p}`)
    }
  })

  // 4. Synchronize Registry
  console.log("\n🔄 Syncing registry and rebuilding manifests...")
  try {
    execSync(`pnpm registry:fresh --all`, { stdio: "inherit" })
    console.log("\n✨ Success! Component removed and registry updated.")
  } catch (error) {
    console.error("\n❌ Error during registry sync. You may need to run 'pnpm registry:fresh --all' manually.")
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
