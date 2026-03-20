import {
  commitApprovedSyncPreview,
  commitResolvedConflictEntry,
  getMergedHistory,
  getPersistedApplicationData,
  getPersistedApplicationsData,
} from "@/lib/persisted-state"
import type { HistoryEntry, HistoryItem, SyncPreviewData } from "@/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const STORAGE_KEY = "portier:approved-sync-history:v1"

function createHistoryItem(
  overrides: Partial<HistoryItem> = {}
): HistoryItem {
  return {
    id: "item_1",
    entityType: "user",
    entityId: "usr_1",
    entityLabel: "User 1",
    fieldPath: "user.email",
    fieldLabel: "Email",
    changeType: "UPDATE",
    localValue: "old@example.com",
    externalValue: "new@example.com",
    review: {
      required: false,
      status: "not_required",
      decision: null,
    },
    ...overrides,
  }
}

function createHistoryEntry(
  overrides: Partial<HistoryEntry> = {}
): HistoryEntry {
  return {
    id: "hist_1",
    applicationId: "intercom",
    applicationName: "Intercom",
    timestamp: "2026-03-20T09:00:00.000Z",
    source: "external",
    version: "v1.5.2",
    status: "conflict",
    summary: "Conflict summary",
    metrics: {
      totalChanges: 1,
      added: 0,
      updated: 1,
      deleted: 0,
      requiresReview: 1,
      resolved: 0,
    },
    items: [
      createHistoryItem({
        review: {
          required: true,
          status: "pending",
          decision: null,
        },
      }),
    ],
    ...overrides,
  }
}

function createPreview(): SyncPreviewData {
  return {
    applicationId: "intercom",
    applicationName: "Intercom",
    currentVersion: "v1.5.2",
    nextVersion: "v1.5.3",
    summary: {
      totalChanges: 2,
      added: 0,
      updated: 2,
      deleted: 0,
      estimatedDurationSeconds: 24,
    },
    groups: [
      {
        entityId: "usr_1",
        entityLabel: "User 1",
        entityType: "user",
        items: [
          createHistoryItem({ id: "sync_item_1" }),
          createHistoryItem({
            id: "sync_item_2",
            fieldPath: "user.role",
            fieldLabel: "Role",
            localValue: "user",
            externalValue: "admin",
            review: {
              required: true,
              status: "pending",
              decision: null,
            },
          }),
        ],
      },
    ],
  }
}

describe("persisted-state", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-20T10:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it("falls back to an empty state for malformed localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "{invalid")
    expect(getPersistedApplicationsData()).toEqual([])

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ persistedData: {} }))
    expect(getPersistedApplicationsData()).toEqual([])
  })

  it("sorts merged history by timestamp descending", () => {
    const sorted = getMergedHistory(
      [
        createHistoryEntry({ id: "mock_old", timestamp: "2026-03-20T08:00:00.000Z" }),
      ],
      [
        createHistoryEntry({
          id: "persisted_new",
          timestamp: "2026-03-20T11:00:00.000Z",
        }),
      ]
    )

    expect(sorted.map((entry) => entry.id)).toEqual([
      "persisted_new",
      "mock_old",
    ])
  })

  it("commits an approved sync preview and persists the next version", () => {
    const preview = createPreview()

    const result = commitApprovedSyncPreview(
      "intercom",
      preview,
      new Set(["sync_item_1", "sync_item_2"])
    )

    const persisted = getPersistedApplicationData("intercom")

    expect(result).toMatchObject({
      applicationName: "Intercom",
      selectedCount: 2,
    })
    expect(persisted).toMatchObject({
      applicationId: "intercom",
      currentVersion: "v1.5.3",
      lastSyncedAt: "2026-03-20T10:00:00.000Z",
      status: "synced",
    })
    expect(persisted?.history).toHaveLength(1)
    expect(persisted?.history[0]).toMatchObject({
      version: "v1.5.3",
      source: "user",
      summary: "Approved 2 sync changes from live preview.",
    })
    expect(persisted?.history[0].items[1].review).toMatchObject({
      status: "resolved",
      decision: "external",
      resolvedAt: "2026-03-20T10:00:00.000Z",
      resolvedBy: "User",
    })
  })

  it("does nothing when resolving a stale conflict from an older version", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        persistedData: [
          {
            applicationId: "intercom",
            currentVersion: "v1.5.3",
            lastSyncedAt: "2026-03-20T09:30:00.000Z",
            status: "synced",
            history: [],
          },
        ],
      })
    )

    const sourceEntry = createHistoryEntry()
    const result = commitResolvedConflictEntry("intercom", sourceEntry, {
      item_1: "local",
    })

    const persisted = getPersistedApplicationData("intercom")

    expect(result).toBeUndefined()
    expect(persisted).toMatchObject({
      currentVersion: "v1.5.3",
      lastSyncedAt: "2026-03-20T09:30:00.000Z",
      status: "synced",
    })
    expect(persisted?.history).toEqual([])
  })
})
