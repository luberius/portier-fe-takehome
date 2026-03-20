import type { ChangeType } from "./history"
import type { EntityType } from "./records"
import type { HistoryItem } from "./history"

export type SyncChange = {
  id: string
  field_name: string
  change_type: ChangeType
  current_value?: string
  new_value?: string
}

export type SyncApproval = {
  application_name: string
  changes: SyncChange[]
}

export type SyncResponse = {
  code: string
  message: string
  data: {
    sync_approval: SyncApproval
    metadata: Record<string, unknown>
  }
}

export type ErrorResponse = {
  error: string
  code: string
  message: string
}

export type SyncApiError = ErrorResponse & {
  status: number
}

export type SyncPreviewItem = HistoryItem

export type SyncPreviewGroup = {
  entityId: string
  entityLabel: string
  entityType: EntityType
  items: SyncPreviewItem[]
}

export type SyncPreviewSummary = {
  totalChanges: number
  added: number
  updated: number
  deleted: number
  estimatedDurationSeconds: number
}

export type SyncPreviewData = {
  applicationId: string
  applicationName: string
  currentVersion: string
  nextVersion: string
  summary: SyncPreviewSummary
  groups: SyncPreviewGroup[]
}
