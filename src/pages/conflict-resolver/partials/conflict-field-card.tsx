import type { ReviewDecision, HistoryItem } from "@/types"
import { ConflictChoicePanel } from "./conflict-choice-panel"

type ConflictFieldCardProps = {
  item: HistoryItem
  selection: ReviewDecision
  onSelect: (decision: Exclude<ReviewDecision, null>) => void
}

export function ConflictFieldCard({
  item,
  selection,
  onSelect,
}: ConflictFieldCardProps) {
  const unresolved = selection === null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <p className="text-sm font-medium text-foreground">{item.fieldLabel}</p>
        {unresolved && (
          <p className="text-xs font-medium text-rose-600">Selection required</p>
        )}
      </div>
      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
        <ConflictChoicePanel
          title="Current (Local)"
          value={item.localValue}
          selected={selection === "local"}
          tone="local"
          onSelect={() => onSelect("local")}
        />
        <ConflictChoicePanel
          title="New (External)"
          value={item.externalValue}
          selected={selection === "external"}
          tone="external"
          onSelect={() => onSelect("external")}
        />
      </div>
    </div>
  )
}
