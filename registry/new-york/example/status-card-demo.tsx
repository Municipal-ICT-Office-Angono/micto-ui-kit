import { StatusCard } from "@/components/micto/status-card"

export default function StatusCardDemo() {
  
  return (
    <div className="flex items-center justify-center p-8">
      <StatusCard 
        title="Status Card Example" 
        description="This is a live demo of the Status Card component generated via the MICTO scaffolder."
        className="max-w-[400px]"
      >
        <div className="flex items-center gap-2 pt-2">
          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-1/3 bg-primary animate-pulse" />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Processing
          </span>
        </div>
      </StatusCard>
    </div>
  )
}
