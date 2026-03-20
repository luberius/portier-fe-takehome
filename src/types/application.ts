import type { LocalState } from "./records"
import type { HistoryEntry } from "./history"

export type SyncStatus = "synced" | "syncing" | "conflict" | "error"

export type Application = {
  id: string
  name: string
  status: SyncStatus
  version: string
  lastSyncedAt: string
}

export type ApplicationDetail = {
  applicationId: string
  totalRecords: number
  lastSyncDurationSeconds: number
  lastSyncedAt: string
  currentVersion: string
  localState: LocalState
  history: HistoryEntry[]
}
