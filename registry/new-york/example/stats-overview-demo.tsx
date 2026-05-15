import { StatsOverview } from "@/components/micto/stats-overview"

export default function StatsOverviewDemo() {
  return (
    <div className="max-w-md p-6 border rounded-xl bg-card">
      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight">Stats Overview Demo</h3>
        <p className="text-sm text-muted-foreground">
          A beautiful status card for your dashboard
        </p>
        <div className="pt-4">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full w-2/3 bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
