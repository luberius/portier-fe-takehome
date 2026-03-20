import { Skeleton } from "@/components/ui/skeleton"

export function HistoryListSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1.2fr_0.7fr_0.5fr_1.2fr] gap-3 border-t border-border px-5 py-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="pt-1">
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="pt-0.5">
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="pt-1">
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </>
  )
}
