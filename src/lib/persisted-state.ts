import type {
  HistoryEntry,
  HistoryItem,
  ReviewDecision,
  SyncPreviewData,
  SyncStatus,
} from "@/types"

const STORAGE_KEY = "portier:approved-sync-history:v1"

type PersistedApplicationData = {
  applicationId: string
  currentVersion: string
  lastSyncedAt: string
  status: SyncStatus
  history: HistoryEntry[]
}

type PersistedSyncHistoryState = {
  persistedData: PersistedApplicationData[]
}

const defaultState = {
  persistedData: [],
}

function readState(): PersistedSyncHistoryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return defaultState
    }

    const parsed = JSON.parse(raw) as Partial<PersistedSyncHistoryState>

    if (!Array.isArray(parsed.persistedData)) {
      return defaultState
    }

    return {
      persistedData: parsed.persistedData,
    }
  } catch {
    return defaultState
  }
}

function writeState(state: PersistedSyncHistoryState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function createHistoryEntry(
  applicationId: string,
  preview: SyncPreviewData,
  selectedItems: HistoryItem[],
  timestamp: string
): HistoryEntry {
  const resolvedItems: HistoryItem[] = selectedItems.map((item) => {
    if (!item.review.required) {
      return item
    }

    return {
      ...item,
      review: {
        ...item.review,
        status: "resolved",
        decision: "external",
        resolvedAt: timestamp,
        resolvedBy: "User",
      },
    }
  })

  const countByType = (changeType: HistoryItem["changeType"]) =>
    resolvedItems.filter((item) => item.changeType === changeType).length

  const resolvedRequired = resolvedItems.filter(
    (item) => item.review.required
  ).length

  return {
    id: `hist_${applicationId}_${Date.now()}`,
    applicationId,
    applicationName: preview.applicationName,
    timestamp,
    source: "user",
    version: preview.nextVersion,
    status: "synced",
    summary: `Approved ${resolvedItems.length} sync change${
      resolvedItems.length === 1 ? "" : "s"
    } from live preview.`,
    metrics: {
      totalChanges: resolvedItems.length,
      added: countByType("ADD"),
      updated: countByType("UPDATE"),
      deleted: countByType("DELETE"),
      requiresReview: 0,
      resolved: resolvedRequired,
    },
    items: resolvedItems,
  }
}

function createResolvedConflictEntry(
  applicationId: string,
  sourceEntry: HistoryEntry,
  decisions: Record<string, ReviewDecision>,
  timestamp: string
): HistoryEntry {
  const resolvedItems = sourceEntry.items
    .filter((item) => item.review.required)
    .map((item) => {
      const decision = decisions[item.id]

      return {
        ...item,
        review: {
          ...item.review,
          status: "resolved" as const,
          decision,
          resolvedAt: timestamp,
          resolvedBy: "User",
        },
      }
    })

  const countByType = (changeType: HistoryItem["changeType"]) =>
    resolvedItems.filter((item) => item.changeType === changeType).length

  return {
    id: `hist_${applicationId}_${Date.now()}`,
    applicationId,
    applicationName: sourceEntry.applicationName,
    timestamp,
    source: "user",
    version: sourceEntry.version,
    status: "synced",
    summary: `Resolved ${resolvedItems.length} conflict field${
      resolvedItems.length === 1 ? "" : "s"
    } from ${sourceEntry.version}.`,
    metrics: {
      totalChanges: resolvedItems.length,
      added: countByType("ADD"),
      updated: countByType("UPDATE"),
      deleted: countByType("DELETE"),
      requiresReview: 0,
      resolved: resolvedItems.length,
    },
    items: resolvedItems,
  }
}

export function getPersistedApplicationData(applicationId: string) {
  return readState().persistedData.find(
    (persistedData) => persistedData.applicationId === applicationId
  )
}

export function getPersistedApplicationsData() {
  return readState().persistedData
}

export function getMergedHistory(
  mockHistory: HistoryEntry[],
  persistedHistory: HistoryEntry[] = []
) {
  return [...persistedHistory, ...mockHistory].sort(
    (left, right) =>
      new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
  )
}

export function commitApprovedSyncPreview(
  applicationId: string,
  preview: SyncPreviewData,
  selectedIds: Set<string>
) {
  const state = readState()
  const timestamp = new Date().toISOString()
  const selectedItems = preview.groups.flatMap((group) =>
    group.items.filter((item) => selectedIds.has(item.id))
  )
  const historyEntry = createHistoryEntry(
    applicationId,
    preview,
    selectedItems,
    timestamp
  )
  const existingPersistedData = state.persistedData.find(
    (item) => item.applicationId === applicationId
  )

  const nextPersistedData: PersistedApplicationData = {
    applicationId,
    currentVersion: preview.nextVersion,
    lastSyncedAt: timestamp,
    status: "synced",
    history: [historyEntry, ...(existingPersistedData?.history ?? [])],
  }

  writeState({
    persistedData: [
      ...state.persistedData.filter(
        (item) => item.applicationId !== applicationId
      ),
      nextPersistedData,
    ],
  })

  return {
    applicationName: preview.applicationName,
    selectedCount: selectedItems.length,
    historyEntryId: historyEntry.id,
  }
}

export function commitResolvedConflictEntry(
  applicationId: string,
  sourceEntry: HistoryEntry,
  decisions: Record<string, ReviewDecision>
) {
  const state = readState()
  const existingPersistedData = state.persistedData.find(
    (item) => item.applicationId === applicationId
  )

  if (
    existingPersistedData &&
    existingPersistedData.currentVersion !== sourceEntry.version
  ) {
    return
  }

  const timestamp = new Date().toISOString()
  const historyEntry = createResolvedConflictEntry(
    applicationId,
    sourceEntry,
    decisions,
    timestamp
  )

  const nextPersistedData: PersistedApplicationData = {
    applicationId,
    currentVersion: existingPersistedData?.currentVersion ?? sourceEntry.version,
    lastSyncedAt: timestamp,
    status: "synced",
    history: [historyEntry, ...(existingPersistedData?.history ?? [])],
  }

  writeState({
    persistedData: [
      ...state.persistedData.filter(
        (item) => item.applicationId !== applicationId
      ),
      nextPersistedData,
    ],
  })

  return {
    applicationName: sourceEntry.applicationName,
    resolvedCount: historyEntry.items.length,
    historyEntryId: historyEntry.id,
  }
}
