import { ArrowRightIcon } from "@phosphor-icons/react"
import { StatusBadge } from "@/components/diff/status-badge"
import { cn } from "@/lib/utils"
import type { HistoryItem } from "@/types"

type ResolutionRowProps = {
  item: HistoryItem
}

export function ResolutionRow({ item }: ResolutionRowProps) {
  const isDelete = item.changeType === "DELETE"
  const isUpdate = item.changeType === "UPDATE"
  const isAdd = item.changeType === "ADD"
  const decision = item.review.decision
  const isLocal = decision === "local"

  return (
    <div className="grid gap-3 border-t border-border py-3 first:border-t-0 md:grid-cols-[1fr_1.5fr_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm text-foreground">{item.fieldLabel}</p>
          <StatusBadge kind="resolved" value="resolved" />
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-xs text-foreground">
        {!isAdd && (
          <span
            className={cn(
              "max-w-full rounded-md border px-2.5 py-1.5",
              isLocal &&
                "border-sky-300 bg-sky-50 font-medium text-sky-900 dark:border-sky-400 dark:bg-sky-400/20 dark:text-sky-200",
              !isLocal &&
                "border-border bg-muted/40 text-muted-foreground line-through dark:text-muted-foreground"
            )}
          >
            {item.localValue ?? "null"}
          </span>
        )}
        {isUpdate && (
          <span className="text-muted-foreground" aria-hidden="true">
            <ArrowRightIcon size={14} />
          </span>
        )}
        {!isDelete && (
          <span
            className={cn(
              "max-w-full rounded-md border px-2.5 py-1.5",
              !isLocal &&
                "border-violet-300 bg-violet-50 font-medium text-violet-900 dark:border-violet-400 dark:bg-violet-400/20 dark:text-violet-200",
              isLocal &&
                "border-border bg-background text-muted-foreground line-through dark:text-muted-foreground"
            )}
          >
            {item.externalValue ?? "null"}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        {decision && <StatusBadge kind="decision" value={decision} />}
      </div>
    </div>
  )
}
