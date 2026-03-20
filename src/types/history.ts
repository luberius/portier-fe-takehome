import type { SyncStatus } from "./application"
import type { EntityType } from "./records"

export type SyncSource = "system" | "external" | "user"

export type ChangeType = "ADD" | "UPDATE" | "DELETE"

export type ReviewStatus = "not_required" | "pending" | "resolved"

export type ReviewDecision = "local" | "external" | null

export type ReviewState = {
  required: boolean
  status: ReviewStatus
  decision: ReviewDecision
  resolvedAt?: string
  resolvedBy?: string
  note?: string
}

export type HistoryItem = {
  id: string
  entityType: EntityType
  entityId: string
  entityLabel: string
  fieldPath: string
  fieldLabel: string
  changeType: ChangeType
  localValue: string | null
  externalValue: string | null
  review: ReviewState
}

export type HistoryMetrics = {
  totalChanges: number
  added: number
  updated: number
  deleted: number
  requiresReview: number
  resolved: number
}

export type HistoryEntry = {
  id: string
  applicationId: string
  applicationName: string
  timestamp: string
  source: SyncSource
  version: string
  status: SyncStatus
  summary: string
  metrics: HistoryMetrics
  items: HistoryItem[]
}
