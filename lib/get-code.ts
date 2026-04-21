import fs from "fs"
import path from "path"
import { createHighlighter, type HighlighterCore } from "shiki"

let highlighter: HighlighterCore | null = null

async function getHighlighter() {
  if (highlighter) return highlighter
  highlighter = await createHighlighter({
    themes: ["github-light", "one-dark-pro"],
    langs: ["tsx", "shell"],
  })
  return highlighter
}

/**
 * Utility to read the content of a file from the registry or components directory.
 * This should ONLY be used in Server Components.
 */
export function getCode(filePath: string): string {
  try {
    const absolutePath = path.join(process.cwd(), filePath)
    return fs.readFileSync(absolutePath, "utf8")
  } catch (error) {
    console.error(`Error reading code from ${filePath}:`, error)
    return "// Error reading source code"
  }
}

/**
 * Highlights a string of code using Shiki.
 */
export async function highlightCode(
  code: string,
  lang: "tsx" | "shell" = "tsx"
): Promise<string> {
  const shiki = await getHighlighter()
  return shiki.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "one-dark-pro",
    },
  })
}
