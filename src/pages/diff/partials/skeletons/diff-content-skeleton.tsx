import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DiffContentSkeleton() {
  return (
    <section className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="ring-1 ring-border">
          <CardHeader className="border-b border-border">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-14" />
          </CardHeader>
          <CardContent className="grid gap-4 pt-5">
            {Array.from({ length: 2 }).map((__, rowIndex) => (
              <div
                key={rowIndex}
                className="grid items-center gap-3 border border-border p-4 md:grid-cols-[0.8fr_1.4fr_auto]"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
