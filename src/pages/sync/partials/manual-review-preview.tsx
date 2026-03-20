import { ChangeComparison } from "@/components/diff/change-comparison"
import { StatusBadge } from "@/components/diff/status-badge"
import type { HistoryItem } from "@/types"

type ManualReviewPreviewProps = {
  items: HistoryItem[]
}

export function ManualReviewPreview({ items }: ManualReviewPreviewProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="grid gap-2 rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-200/20 dark:bg-amber-200/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">
          Manual review excluded
        </p>
        <span className="font-mono text-[11px] text-amber-700 uppercase dark:text-amber-400">
          {items.length} unchecked
        </span>
      </div>
      <div className="grid max-h-56 gap-2 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-2 rounded-lg border border-amber-100 bg-background/80 px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-xs font-medium text-foreground">
                {item.fieldLabel}
              </p>
              <StatusBadge
                kind="change"
                value={item.changeType}
              />
            </div>
            <div className="overflow-x-auto">
              <ChangeComparison item={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
