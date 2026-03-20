import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DiffContentSkeleton } from "@/pages/diff/partials/skeletons/diff-content-skeleton"

export function SyncPageSkeleton() {
  return (
    <>
      <div className="grid gap-0.5 rounded-lg border border-sky-200 bg-sky-50 px-2 py-1.5 dark:border-sky-400/25 dark:bg-sky-400/10">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-1 h-3 w-96 max-w-full" />
      </div>

      <section className="grid gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="py-3 ring-1 ring-border">
            <CardContent className="px-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-3 h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="ring-1 ring-border">
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>

      <DiffContentSkeleton />
    </>
  )
}
