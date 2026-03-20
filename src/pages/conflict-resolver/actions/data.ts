import {
  getEffectiveApplicationDetail,
  getLatestConflictHistoryEntry,
  groupHistoryItems,
} from "@/lib/history"
import { notFound } from "@/lib/errors"
import type { ReviewDecision, SyncPreviewGroup } from "@/types"

export function createInitialSelections(groups: SyncPreviewGroup[]) {
  return Object.fromEntries(
    groups.flatMap((group) => group.items).map((item) => [item.id, null])
  ) as Record<string, ReviewDecision>
}

export function createBulkSelections(
  groups: SyncPreviewGroup[],
  decision: Exclude<ReviewDecision, null>
) {
  return Object.fromEntries(
    groups.flatMap((group) => group.items.map((item) => [item.id, decision]))
  ) as Record<string, ReviewDecision>
}

export function getSelectionSummary(selections: Record<string, ReviewDecision>) {
  return Object.values(selections).reduce(
    (summary, selection) => {
      if (selection !== null) {
        summary.resolvedCount += 1
      }

      if (selection === "local") {
        summary.localCount += 1
      }

      if (selection === "external") {
        summary.externalCount += 1
      }

      return summary
    },
    {
      resolvedCount: 0,
      localCount: 0,
      externalCount: 0,
    }
  )
}

export function getConflictResolverDetail(applicationId: string) {
  const { detail, applicationName } = getEffectiveApplicationDetail(applicationId)
  const entry = getLatestConflictHistoryEntry(detail.history)

  if (!entry) {
    throw notFound("No unresolved conflict entry found")
  }

  const conflictItems = entry.items.filter((item) => item.review.required)

  return {
    applicationId,
    applicationName,
    detail,
    entry,
    groups: groupHistoryItems(conflictItems),
  }
}
