import {
  getEffectiveApplicationDetail,
  groupHistoryItems,
} from "@/lib/history"
import { notFound } from "@/lib/errors"
import type { HistoryEntry, HistoryItem } from "@/types"

function getHistoryEntryById(history: HistoryEntry[], historyId: string) {
  const entry = history.find((historyEntry) => historyEntry.id === historyId)

  if (!entry) {
    throw notFound("History entry not found")
  }

  return entry
}

export function getReviewDetail(applicationId: string, historyId: string) {
  const { detail } = getEffectiveApplicationDetail(applicationId)
  const entry = getHistoryEntryById(detail.history, historyId)

  return {
    detail,
    entry,
  }
}

export function groupReviewItems(items: HistoryItem[]) {
  return groupHistoryItems(items)
}
