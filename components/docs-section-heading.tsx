import * as React from "react"
import { cn } from "@/lib/utils"

interface DocsSectionHeadingProps {
  title: string
  description?: string
  className?: string
}

export function DocsSectionHeading({
  title,
  description,
  className,
}: DocsSectionHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
