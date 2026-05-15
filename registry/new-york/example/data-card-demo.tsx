import { DataCard } from "@/components/micto/data-card"

export default function DataCardDemo() {
  return (
    <DataCard className="max-w-md">
      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight">Data Card Demo</h3>
        <p className="text-sm text-muted-foreground">
          A professional good quality component
        </p>
        <div className="pt-4">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full w-2/3 bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </DataCard>
  )
}

