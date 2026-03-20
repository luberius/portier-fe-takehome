import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DetailLocalStateSkeleton() {
  return (
    <Card className="ring-1 ring-border">
      <CardHeader className="border-b border-border">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Local state
          </p>
          <CardTitle className="mt-2 text-lg">Current records</CardTitle>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          mocked source of truth
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 pt-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-dashed border-border pb-3 last:border-0 last:pb-0"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
