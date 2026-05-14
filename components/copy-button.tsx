"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  value: string
  className?: string
}

export function CopyButton({ value, className }: Props) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => { void handleCopy() }}
      className={cn(
        "h-7 w-7 px-0 text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label={copied ? "Copied command" : "Copy command"}
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}
