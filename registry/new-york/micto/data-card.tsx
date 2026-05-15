import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

/**
 * @title Data Card
 * @description A professional good quality component
 * @category react, component
 */
const DataCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "p-6 transition-all hover:shadow-md",
      className
    )}
    {...props}
  />
))
DataCard.displayName = "DataCard"

export { DataCard }
