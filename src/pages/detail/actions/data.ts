import {
  getEffectiveApplicationDetail,
  getLatestConflictHistoryEntry,
} from "@/lib/history"
import type { HistoryEntry } from "@/types"

export function getApplicationDetail(applicationId: string) {
  return getEffectiveApplicationDetail(applicationId)
}

export function getLatestConflictEntry(history: HistoryEntry[]) {
  return getLatestConflictHistoryEntry(history)
}
