import { ArrowRightIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { HistoryItem } from "@/types"

type ChangeComparisonProps = {
  item: Pick<HistoryItem, "changeType" | "localValue" | "externalValue">
}

export function ChangeComparison({ item }: ChangeComparisonProps) {
  const isDelete = item.changeType === "DELETE"
  const isUpdate = item.changeType === "UPDATE"
  const isAdd = item.changeType === "ADD"

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-xs text-foreground">
      {!isAdd && (
        <span
          className={cn(
            (isUpdate || isDelete) && "line-through",
            "max-w-full rounded-md border border-border bg-muted/40 px-2.5 py-1.5"
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
        <span className="max-w-full rounded-md border border-border bg-background px-2.5 py-1.5">
          {item.externalValue ?? "null"}
        </span>
      )}
    </div>
  )
}
