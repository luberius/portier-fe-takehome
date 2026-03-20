import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SyncStatus } from "@/types"
import type { ChangeType } from "@/types"
import type { ReviewDecision } from "@/types"

type StatusBadgeProps = {
  kind: "sync" | "change" | "decision" | "resolved" | "pending"
  value: SyncStatus | ChangeType | ReviewDecision | "resolved" | "pending"
  className?: string
}

const syncTone: Record<SyncStatus, string> = {
  synced:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
  syncing:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300",
  conflict:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300",
  error:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300",
}

const changeTone: Record<ChangeType, string> = {
  ADD: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
  UPDATE:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300",
  DELETE:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300",
}

const decisionTone: Record<Exclude<ReviewDecision, null>, string> = {
  local:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300",
  external:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-300",
}

const resolvedTone =
  "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"

const pendingTone =
  "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300"

export function StatusBadge({ kind, value, className }: StatusBadgeProps) {
  let tone: string = ""
  let text: string = ""

  switch (kind) {
    case "sync":
      tone = syncTone[value as SyncStatus]
      text = value as string
      break
    case "change":
      tone = changeTone[value as ChangeType]
      text = value as string
      break
    case "decision":
      tone = decisionTone[value as Exclude<ReviewDecision, null>]
      text = value as string
      break
    case "resolved":
      tone = resolvedTone
      text = "resolved"
      break
    case "pending":
      tone = pendingTone
      text = "need manual"
      break
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-5 min-w-14 justify-center px-2 text-[0.625rem] uppercase",
        tone,
        className
      )}
    >
      {text}
    </Badge>
  )
}
