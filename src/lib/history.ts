import { notFound } from "@/lib/errors"
import {
  getPersistedApplicationData,
  getMergedHistory,
} from "@/lib/persisted-state"
import { applicationDetails, getApplicationName } from "@/mocks"
import type { ApplicationDetail, HistoryEntry, HistoryItem } from "@/types"

export type HistoryItemGroup = {
  entityId: string
  entityLabel: string
  entityType: HistoryItem["entityType"]
  items: HistoryItem[]
}

export function groupHistoryItems(items: HistoryItem[]): HistoryItemGroup[] {
  const groups = new Map<string, HistoryItemGroup>()

  for (const item of items) {
    const key = `${item.entityType}:${item.entityId}`
    const existing = groups.get(key)

    if (existing) {
      existing.items.push(item)
      continue
    }

    groups.set(key, {
      entityId: item.entityId,
      entityLabel: item.entityLabel,
      entityType: item.entityType,
      items: [item],
    })
  }

  return Array.from(groups.values())
}

export function getEffectiveApplicationDetail(applicationId: string) {
  const detail = applicationDetails.find(
    (item) => item.applicationId === applicationId
  )

  if (!detail) {
    throw notFound("Application not found")
  }

  const persistedData = getPersistedApplicationData(applicationId)
  const history = getMergedHistory(detail.history, persistedData?.history)

  if (!persistedData) {
    return {
      detail: {
        ...detail,
        history,
      },
      applicationName: getApplicationName(applicationId),
    }
  }

  return {
    detail: {
      ...detail,
      currentVersion: persistedData.currentVersion,
      lastSyncedAt: persistedData.lastSyncedAt,
      history,
    } as ApplicationDetail,
    applicationName: getApplicationName(applicationId),
  }
}

export function getLatestConflictHistoryEntry(history: HistoryEntry[]) {
  const latest = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0]

  return latest?.status === "conflict" ? latest : undefined
}

export function formatHistoryMetrics(entry: HistoryEntry) {
  const parts = [
    entry.metrics.added > 0 ? `${entry.metrics.added} added` : null,
    entry.metrics.updated > 0 ? `${entry.metrics.updated} updated` : null,
    entry.metrics.deleted > 0 ? `${entry.metrics.deleted} deleted` : null,
    entry.metrics.requiresReview > 0
      ? `${entry.metrics.requiresReview} review`
      : null,
    entry.metrics.resolved > 0 ? `${entry.metrics.resolved} resolved` : null,
  ].filter(Boolean)

  if (parts.length === 0) {
    return `${entry.metrics.totalChanges} changes`
  }

  return parts.join(" • ")
}
