import { Skeleton } from "@/components/ui/skeleton"

export function ApplicationsListSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1.5fr_0.8fr_1fr_0.7fr] gap-3 border-t border-border px-5 py-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="pt-0.5">
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="pt-1">
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="pt-1">
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </>
  )
}
