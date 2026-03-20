import { StatusBadge } from "@/components/diff/status-badge"
import { ChangeComparison } from "@/components/diff/change-comparison"
import type { HistoryItem } from "@/types"

type ChangeRowProps = {
  item: HistoryItem
  selected?: boolean
  onToggleSelect?: (itemId: string) => void
}

export function ChangeRow({
  item,
  selected = false,
  onToggleSelect,
}: ChangeRowProps) {
  const isSelectable = typeof onToggleSelect === "function"

  return (
    <div className="grid gap-3 border-t border-border py-3 first:border-t-0 md:grid-cols-[0.9fr_1.5fr] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {isSelectable && (
            <label className="inline-flex items-center" aria-label={`Select ${item.fieldLabel}`}>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleSelect(item.id)}
                className="size-4 rounded border-border accent-primary"
              />
            </label>
          )}
          <p className="truncate text-sm text-foreground">{item.fieldLabel}</p>
          {item.review.required && (
            <StatusBadge kind="pending" value="pending" />
          )}
          <span className="hidden flex-1 md:block" />
          <StatusBadge kind="change" value={item.changeType} />
        </div>
      </div>

      <ChangeComparison item={item} />
    </div>
  )
}
