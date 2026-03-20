import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"

export function DetailHistorySkeleton() {
  return (
    <Card className="ring-1 ring-border">
      <CardHeader className="border-b border-border">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            History
          </p>
          <CardTitle className="mt-2 text-lg">Recent sync events</CardTitle>
        </div>
        <Skeleton className="h-3 w-24" />
      </CardHeader>
      <CardContent className="grid gap-3 pt-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-1">
          <Button variant="outline" size="sm" disabled>
            <ClockCounterClockwiseIcon />
            Show history
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
