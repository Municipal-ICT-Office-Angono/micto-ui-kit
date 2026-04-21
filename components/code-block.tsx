import * as React from "react"

import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

type Props = {
  code: string
  html?: string
  language?: "shell" | "tsx"
  className?: string
}

function renderHighlightedCode(code: string, language: Props["language"]) {
  if (language === "shell") {
    return highlightWithPattern(
      code,
      /(".*?"|'.*?'|\b(?:pnpm|npx|shadcn)\b|--?[a-z-]+|https?:\/\/[^\s]+)/g,
      (token, index) => {
        if (token.startsWith("http")) {
          return (
            <span key={index} className="text-sky-600 dark:text-sky-400">
              {token}
            </span>
          )
        }

        if (token.startsWith("-")) {
          return (
            <span key={index} className="text-amber-600 dark:text-amber-400">
              {token}
            </span>
          )
        }

        if (token.startsWith('"') || token.startsWith("'")) {
          return (
            <span key={index} className="text-emerald-600 dark:text-emerald-400">
              {token}
            </span>
          )
        }

        return (
          <span key={index} className="text-fuchsia-600 dark:text-fuchsia-400">
            {token}
          </span>
        )
      }
    )
  }

  return highlightWithPattern(
    code,
    /(import|from)|(".*?")|(<\/?[A-Z][A-Za-z0-9]*|\bLinkComponent\b|\blinks\b)|(@\/[^\s"]+|@inertiajs\/react)/g,
    (token, index) => {
      if (token === "import" || token === "from") {
        return (
          <span key={index} className="text-fuchsia-600 dark:text-fuchsia-400">
            {token}
          </span>
        )
      }

      if (token.startsWith('"')) {
        return (
          <span key={index} className="text-emerald-600 dark:text-emerald-400">
            {token}
          </span>
        )
      }

      if (token.startsWith("@/") || token === "@inertiajs/react") {
        return (
          <span key={index} className="text-sky-600 dark:text-sky-400">
            {token}
          </span>
        )
      }

      return (
        <span key={index} className="text-amber-700 dark:text-amber-400">
          {token}
        </span>
      )
    }
  )
}

function highlightWithPattern(
  code: string,
  pattern: RegExp,
  renderToken: (token: string, index: number) => React.ReactNode
) {
  const matches = Array.from(code.matchAll(pattern))

  if (!matches.length) {
    return code
  }

  const result: React.ReactNode[] = []
  let lastIndex = 0

  matches.forEach((match, index) => {
    const matchIndex = match.index ?? 0

    if (matchIndex > lastIndex) {
      result.push(code.slice(lastIndex, matchIndex))
    }

    result.push(renderToken(match[0], index))
    lastIndex = matchIndex + match[0].length
  })

  if (lastIndex < code.length) {
    result.push(code.slice(lastIndex))
  }

  return result
}

export function CodeBlock({ code, html, language = "tsx", className }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-muted/20",
        className
      )}
    >
      <CopyButton
        value={code}
        className="absolute top-2 right-2 z-10 text-foreground/60 hover:text-foreground"
      />
      {html ? (
        <div 
          className="shiki-container px-4 py-4 pr-14 text-sm leading-6 overflow-x-auto [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!grid"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      ) : (
        <pre className="overflow-x-auto px-4 py-4 pr-14 text-sm leading-6 text-foreground/85">
          <code>{renderHighlightedCode(code, language)}</code>
        </pre>
      )}
    </div>
  )
}
